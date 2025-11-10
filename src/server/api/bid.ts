import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getIO } from "@/lib/socket";
import { z } from "zod";

// 🧾 Validation schema for incoming bid data
const bidSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  supplierId: z.string().min(1, "Supplier ID is required"),
  amount: z.number().positive("Bid amount must be positive"),
});

// 🧱 POST — Submit a new bid
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate with Zod
    const result = bidSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: issues },
        { status: 400 }
      );
    }

    const { auctionId, supplierId, amount } = result.data;

    // ✅ Fetch auction with bids
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: true },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    // ⏰ Check auction validity
    const now = new Date();
    if (auction.status !== "active" || now > auction.endTime) {
      return NextResponse.json(
        { error: "Auction has ended." },
        { status: 400 }
      );
    }

    // ✅ Get supplier's latest bid
    const lastBid = await prisma.bid.findFirst({
      where: { auctionId, supplierId },
      orderBy: { createdAt: "desc" },
    });

    if (lastBid && amount >= lastBid.amount) {
      return NextResponse.json(
        { error: "New bid must be lower than your previous bid." },
        { status: 400 }
      );
    }

    // ✅ Enforce minimum decrement
    if (lastBid && lastBid.amount - amount < auction.minDecrementValue) {
      return NextResponse.json(
        {
          error: `Each new bid must decrease by at least ₹${auction.minDecrementValue}.`,
        },
        { status: 400 }
      );
    }

    // ✅ Save new bid
    const newBid = await prisma.bid.create({
      data: {
        auctionId,
        supplierId,
        amount,
      },
    });

    // ✅ Update ranks dynamically
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: "asc" },
      include: { supplier: true },
    });

    // Assign rank order
    for (let i = 0; i < bids.length; i++) {
      await prisma.bid.update({
        where: { id: bids[i].id },
        data: { rank: i + 1 },
      });
    }

    // ✅ Broadcast live update through socket
    const io = getIO();
    io.to(auctionId).emit("update_bids", bids);

    // ✅ Return success response
    return NextResponse.json({
      success: true,
      message: "Bid placed successfully",
      newBid,
      currentRanking: bids.map((b) => ({
        supplier: b.supplierId,
        amount: b.amount,
        rank: b.rank,
      })),
    });
  } catch (error) {
    console.error("❌ Error placing bid:", error);
    return NextResponse.json(
      { error: "Server error while placing bid" },
      { status: 500 }
    );
  }
}

// 🧱 GET — Retrieve current auction bids
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const auctionId = searchParams.get("auctionId");

    if (!auctionId) {
      return NextResponse.json({ error: "Missing auctionId" }, { status: 400 });
    }

    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: "asc" },
      include: { supplier: true },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}

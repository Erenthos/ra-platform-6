// src/server/api/bid.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// 🧾 Validation schema for bid submission
const bidSchema = z.object({
  auctionId: z.string(),
  supplierId: z.string(),
  amount: z.number().positive()
});

// 📤 Supplier places a new bid
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bidSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { auctionId, supplierId, amount } = parsed.data;

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: true }
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found." }, { status: 404 });
    }

    // Check auction validity
    const now = new Date();
    if (!auction.isActive || now > auction.endTime) {
      return NextResponse.json({ error: "Auction has ended." }, { status: 400 });
    }

    // Get supplier's last bid (if any)
    const lastBid = await prisma.bid.findFirst({
      where: { auctionId, supplierId },
      orderBy: { createdAt: "desc" }
    });

    // Ensure the new bid respects minimum decrement value
    if (lastBid && amount >= lastBid.amount - auction.minDecrementValue) {
      return NextResponse.json(
        {
          error: `Bid must be at least ₹${auction.minDecrementValue} lower than your previous bid (₹${lastBid.amount}).`
        },
        { status: 400 }
      );
    }

    // Record the new bid
    const newBid = await prisma.bid.create({
      data: {
        auctionId,
        supplierId,
        amount
      }
    });

    // Update ranking for all bids in this auction
    const allBids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: "asc" }
    });

    for (let i = 0; i < allBids.length; i++) {
      await prisma.bid.update({
        where: { id: allBids[i].id },
        data: { rank: i + 1 }
      });
    }

    // (Optional) Notify all connected clients via Socket.IO (pseudo trigger)
    // io.to(auctionId).emit("bid_update", { auctionId });

    return NextResponse.json({
      message: "Bid placed successfully.",
      bid: newBid
    });
  } catch (error) {
    console.error("Bid Placement Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📋 Get all bids for a given auction
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const auctionId = searchParams.get("auctionId");
    const supplierId = searchParams.get("supplierId");

    if (!auctionId) {
      return NextResponse.json(
        { error: "auctionId is required" },
        { status: 400 }
      );
    }

    // Supplier can only view their own rank & bid
    // Buyer can see all
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: "asc" }
    });

    if (supplierId) {
      const supplierBid = bids.find((b) => b.supplierId === supplierId);
      return NextResponse.json({
        supplierBid,
        totalBidders: bids.length
      });
    }

    return NextResponse.json(bids);
  } catch (error) {
    console.error("Bid Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


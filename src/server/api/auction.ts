import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// 🧾 Validation schema for auction creation
const auctionSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  buyerId: z.string().min(1, "Buyer ID is required"),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  minDecrementValue: z.number().positive("Minimum decrement must be positive"),
  invitedSuppliers: z.array(z.string().email("Invalid supplier email")),
});

// 🧱 GET — Fetch all auctions for a specific buyer
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");

    if (!buyerId) {
      return NextResponse.json({ error: "Missing buyerId" }, { status: 400 });
    }

    const auctions = await prisma.auction.findMany({
      where: { buyerId },
      include: {
        invites: true,
        buyer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error("❌ Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}

// 🧱 POST — Create a new auction and invite suppliers
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate input using Zod
    const result = auctionSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: issues },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      buyerId,
      durationMinutes,
      minDecrementValue,
      invitedSuppliers,
    } = result.data;

    // 🔎 Prevent duplicate auction titles for same buyer
    const existing = await prisma.auction.findFirst({
      where: { title, buyerId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An auction with this title already exists" },
        { status: 400 }
      );
    }

    // ⏰ Calculate start and end times
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // ✅ Create the auction (without invitedSuppliers)
    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        buyerId,
        durationMinutes,
        startTime,
        endTime,
        minDecrementValue,
      },
    });

    // ✅ Create supplier invites safely after auction creation
    const invites = await Promise.all(
      invitedSuppliers.map(async (email: string) => {
        const supplier = await prisma.user.findUnique({ where: { email } });

        // ✅ Build object conditionally — omit supplierId if not found
        const inviteData = supplier
          ? {
              auctionId: auction.id,
              email,
              supplierId: supplier.id,
            }
          : {
              auctionId: auction.id,
              email,
            };

        return prisma.invite.create({ data: inviteData });
      })
    );

    // ✅ Return structured success response
    return NextResponse.json({
      success: true,
      message: "Auction created successfully",
      auction,
      invites,
    });
  } catch (error) {
    console.error("❌ Error creating auction:", error);
    return NextResponse.json(
      { error: "Server error while creating auction" },
      { status: 500 }
    );
  }
}

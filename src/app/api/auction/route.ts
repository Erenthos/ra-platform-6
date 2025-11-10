import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------------------------------------------------
// GET: /api/auction?buyerId=...
// Fetch all auctions created by a specific buyer
// -------------------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return NextResponse.json(
      { error: "Missing buyerId parameter" },
      { status: 400 }
    );
  }

  try {
    const auctions = await prisma.auction.findMany({
      where: { buyerId },
      include: { invites: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(auctions);
  } catch (err) {
    console.error("Error fetching auctions:", err);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST: /api/auction
// Create a new auction + invite suppliers
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      buyerId,
      durationMinutes,
      minDecrementValue,
      invitedSuppliers,
    } = body;

    if (!title || !buyerId || !durationMinutes || !minDecrementValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(invitedSuppliers) || invitedSuppliers.length === 0) {
      return NextResponse.json(
        { error: "At least one supplier email is required" },
        { status: 400 }
      );
    }

    // Calculate auction times
    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + durationMinutes * 60 * 1000
    );

    // ✅ Create auction
    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        buyerId,
        durationMinutes,
        minDecrementValue,
        startTime,
        endTime,
      },
    });

    // ✅ Add supplier invites
    const invites = await Promise.all(
      invitedSuppliers.map(async (email: string) => {
        const supplier = await prisma.user.findUnique({
          where: { email },
        });

        // If supplier exists, link to user. If not, store invite email for record.
        return prisma.invite.create({
          data: {
            auctionId: auction.id,
            supplierId: supplier ? supplier.id : undefined,
            email,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: "Auction created successfully",
      auction,
      invites,
    });
  } catch (err) {
    console.error("Auction creation error:", err);
    return NextResponse.json(
      { error: "Server error while creating auction" },
      { status: 500 }
    );
  }
}

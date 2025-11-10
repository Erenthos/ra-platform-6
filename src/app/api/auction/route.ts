import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------------------------------------------------
// GET: /api/auction?buyerId=...
// Fetch all auctions created by a specific buyer
// -------------------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId || buyerId === "current") {
    // You can extend this later to infer buyerId from session
    return NextResponse.json(
      { error: "Missing buyerId parameter" },
      { status: 400 }
    );
  }

  try {
    const auctions = await prisma.auction.findMany({
      where: { buyerId },
      include: {
        invites: true,
        buyer: true,
      },
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

    // --- Validation ---
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

    // --- Calculate auction start and end times ---
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // --- Prevent duplicate auctions with same title for same buyer ---
    const existingAuction = await prisma.auction.findFirst({
      where: { title, buyerId },
    });

    if (existingAuction) {
      return NextResponse.json(
        { error: "An auction with this title already exists for this buyer." },
        { status: 400 }
      );
    }

    // --- Create new auction ---
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

    // --- Create supplier invites ---
    const invites = await Promise.all(
      invitedSuppliers.map(async (email: string) => {
        const supplier = await prisma.user.findUnique({ where: { email } });

        // ✅ Safely construct the invite data
        const inviteData: any = {
          auctionId: auction.id,
          email,
        };

        if (supplier && supplier.id) {
          inviteData.supplierId = supplier.id;
        }

        return prisma.invite.create({ data: inviteData });
      })
    );

    // --- Return success response ---
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

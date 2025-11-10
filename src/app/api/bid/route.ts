import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------------------------------------------
// GET: /api/bid?auctionId=...&supplierId=...
// Fetch the supplier's latest bid in a specific auction
// -------------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auctionId = searchParams.get("auctionId");
  const supplierId = searchParams.get("supplierId");

  if (!auctionId || !supplierId) {
    return NextResponse.json(
      { error: "Missing auctionId or supplierId" },
      { status: 400 }
    );
  }

  const supplierBid = await prisma.bid.findFirst({
    where: { auctionId, supplierId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ supplierBid });
}

// -------------------------------------------------------
// POST: /api/bid
// Validate and place a new bid for supplier
// -------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auctionId, supplierId, amount } = body;

    if (!auctionId || !supplierId || !amount) {
      return NextResponse.json(
        { error: "Missing auctionId, supplierId, or amount" },
        { status: 400 }
      );
    }

    // Fetch auction details
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: true },
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Check if auction is still active
    const now = new Date();
    if (auction.endTime <= now) {
      return NextResponse.json(
        { error: "Auction has already ended" },
        { status: 400 }
      );
    }

    // Get supplier’s latest bid
    const lastBid = await prisma.bid.findFirst({
      where: { auctionId, supplierId },
      orderBy: { createdAt: "desc" },
    });

    // Validation 1: If supplier has placed a bid before, new one must be lower
    if (lastBid && amount >= lastBid.amount) {
      return NextResponse.json(
        { error: "New bid must be lower than your previous bid" },
        { status: 400 }
      );
    }

    // Validation 2: Enforce minimum decrement rule
    if (lastBid) {
      const minAllowed = lastBid.amount - auction.minDecrementValue;
      if (amount > minAllowed) {
        return NextResponse.json(
          {
            error: `Bid must be at least ₹${auction.minDecrementValue} lower than your previous bid (Max allowed: ₹${minAllowed})`,
          },
          { status: 400 }
        );
      }
    }

    // Validation 3: If first bid, ensure it’s reasonable (not zero or negative)
    if (!lastBid && amount <= 0) {
      return NextResponse.json(
        { error: "Initial bid amount must be greater than 0" },
        { status: 400 }
      );
    }

    // ✅ Create the new bid
    const newBid = await prisma.bid.create({
      data: {
        auctionId,
        supplierId,
        amount: Number(amount),
      },
    });

    // Recalculate ranks for all bids
    const allBids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: "asc" },
    });

    for (let i = 0; i < allBids.length; i++) {
      await prisma.bid.update({
        where: { id: allBids[i].id },
        data: { rank: i + 1 },
      });
    }

    return NextResponse.json({ success: true, bid: newBid });
  } catch (err) {
    console.error("Bid placement error:", err);
    return NextResponse.json(
      { error: "Server error while placing bid" },
      { status: 500 }
    );
  }
}

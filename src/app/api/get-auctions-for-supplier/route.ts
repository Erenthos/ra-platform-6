import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------------------------------------------
// POST: /api/get-auctions-for-supplier
// Fetch all auctions where supplier (email) is invited
// -------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supplierEmail } = body;

    if (!supplierEmail) {
      return NextResponse.json(
        { error: "Missing supplierEmail" },
        { status: 400 }
      );
    }

    // Find all invites that match supplier's email
    const invites = await prisma.invite.findMany({
      where: { email: supplierEmail },
      include: {
        auction: {
          include: {
            buyer: true,
          },
        },
      },
    });

    // Map to auctions list
    const auctions = invites.map((invite) => invite.auction);

    return NextResponse.json(auctions);
  } catch (err) {
    console.error("Error fetching supplier auctions:", err);
    return NextResponse.json(
      { error: "Server error while fetching auctions" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { supplierEmail } = await req.json();

    if (!supplierEmail) {
      return NextResponse.json({ error: "Supplier email required" }, { status: 400 });
    }

    const auctions = await prisma.auction.findMany({
      where: {
        invitedSuppliers: { has: supplierEmail },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error("Error fetching supplier auctions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

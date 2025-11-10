// src/server/api/auction.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// 🧾 Validation schema for auction creation
const auctionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  buyerId: z.string(),
  durationMinutes: z.number().min(1),
  minDecrementValue: z.number().positive(),
  invitedSuppliers: z.array(z.string().email())
});

// 🏗️ Create a new auction (Buyer only)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = auctionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      buyerId,
      durationMinutes,
      minDecrementValue,
      invitedSuppliers
    } = parsed.data;

    const now = new Date();
    const endTime = new Date(now.getTime() + durationMinutes * 60000);

    const auction = await prisma.auction.create({
      data: {
        title,
        description: description || "",
        buyerId,
        startTime: now,
        endTime,
        minDecrementValue,
        invitedSuppliers
      }
    });

    return NextResponse.json({
      message: "Auction created successfully",
      auction
    });
  } catch (error) {
    console.error("Auction Create Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 📋 Fetch all auctions created by a buyer
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");

    if (!buyerId) {
      return NextResponse.json(
        { error: "buyerId is required" },
        { status: 400 }
      );
    }

    const auctions = await prisma.auction.findMany({
      where: { buyerId },
      include: { bids: true }
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error("Auction Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// src/lib/socket.ts
import { Server } from "socket.io";
import { NextApiResponseServerIO } from "@/types/next";
import type { NextApiRequest } from "next";
import { prisma } from "@/lib/prisma";

// Singleton instance to prevent reinitialization in dev
let io: Server | null = null;

export default function initializeSocket(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    console.log("🔌 Socket.IO initialized.");

    io.on("connection", (socket) => {
      console.log(`⚡ Client connected: ${socket.id}`);

      // Supplier joins auction room
      socket.on("join_auction", (auctionId: string) => {
        socket.join(auctionId);
        console.log(`📦 Supplier joined auction room: ${auctionId}`);
      });

      // Handle new bid broadcast
      socket.on("new_bid", async (data) => {
        const { auctionId } = data;

        // Recalculate ranks & broadcast to all
        const bids = await prisma.bid.findMany({
          where: { auctionId },
          orderBy: { amount: "asc" },
          include: { supplier: true },
        });

        io?.to(auctionId).emit("update_bids", bids);
        console.log(`📣 Bids updated for auction ${auctionId}`);
      });

      // Extend auction time
      socket.on("extend_auction", async (data) => {
        const { auctionId, extraMinutes } = data;
        const auction = await prisma.auction.update({
          where: { id: auctionId },
          data: { endTime: new Date(Date.now() + extraMinutes * 60000) },
        });

        io?.to(auctionId).emit("auction_extended", auction);
        console.log(`⏰ Auction ${auctionId} extended by ${extraMinutes} min`);
      });

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
}


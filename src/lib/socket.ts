// src/lib/socket.ts
import { Server } from "socket.io";
import { prisma } from "@/lib/prisma";

let io: Server | null = null;

/**
 * Initializes or retrieves the existing Socket.IO server instance.
 * This ensures we only create one server during hot reloads or multiple API calls.
 */
export function getIO(): Server {
  if (!io) {
    console.log("🧠 Initializing Socket.IO server...");

    io = new Server(3001, {
      cors: {
        origin: "*",
      },
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      // Supplier joins auction room
      socket.on("join_auction", (auctionId: string) => {
        socket.join(auctionId);
        console.log(`Supplier joined auction room: ${auctionId}`);
      });

      // Supplier submits new bid
      socket.on("new_bid", async ({ auctionId, supplierId, amount }: { auctionId: string; supplierId: string; amount: number }) => {
        try {
          // Save bid to DB
          await prisma.bid.create({
            data: {
              auctionId,
              supplierId,
              amount,
            },
          });

          // Get updated bids sorted by lowest amount
          const bids = await prisma.bid.findMany({
            where: { auctionId },
            orderBy: { amount: "asc" },
            include: { supplier: true },
          });

          // Broadcast new ranking to all buyers & suppliers in that auction
          io?.to(auctionId).emit("update_bids", bids);
          console.log(`📡 Updated bids for auction ${auctionId}`);
        } catch (err) {
          console.error("❌ Error handling new bid:", err);
        }
      });

      // Buyer extends auction duration
      socket.on(
        "extend_auction",
        async ({ auctionId, extraMinutes }: { auctionId: string; extraMinutes: number }) => {
          try {
            const updatedAuction = await prisma.auction.update({
              where: { id: auctionId },
              data: {
                endTime: {
                  set: new Date(Date.now() + extraMinutes * 60 * 1000),
                },
              },
            });

            io?.to(auctionId).emit("auction_extended", updatedAuction);
            console.log(`⏰ Auction ${auctionId} extended by ${extraMinutes} minutes`);
          } catch (err) {
            console.error("❌ Error extending auction:", err);
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
      });
    });
  }

  return io;
}

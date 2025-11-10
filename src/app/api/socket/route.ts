import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { prisma } from "@/lib/prisma";

let io: any;

// -------------------------------------------------------
// Socket.IO server route
// Path: /api/socket
// -------------------------------------------------------
export async function GET(req: Request) {
  if (!(global as any).io) {
    console.log("🧠 Starting new Socket.IO server...");

    io = new Server(3001, {
      cors: { origin: "*" },
      path: "/api/socket",
    });

    // Store instance globally to prevent hot reload duplicates
    (global as any).io = io;

    // Handle socket connection
    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      // 🧩 When supplier joins auction room
      socket.on("join_auction", (auctionId: string) => {
        socket.join(auctionId);
        console.log(`Supplier joined auction room: ${auctionId}`);
      });

      // 🧾 When a new bid is placed
      socket.on("new_bid", async ({ auctionId }: { auctionId: string }) => {
        try {
          const bids = await prisma.bid.findMany({
            where: { auctionId },
            orderBy: { amount: "asc" },
            include: { supplier: true },
          });

          // Broadcast bid list to all clients in the same auction room
          io.to(auctionId).emit("update_bids", bids);
        } catch (err) {
          console.error("Error broadcasting new bids:", err);
        }
      });

      // ⏰ When buyer extends auction duration
      socket.on(
        "extend_auction",
        async ({ auctionId, extraMinutes }: { auctionId: string; extraMinutes: number }) => {
          try {
            const auction = await prisma.auction.update({
              where: { id: auctionId },
              data: {
                endTime: {
                  set: new Date(Date.now() + extraMinutes * 60 * 1000),
                },
              },
            });

            io.to(auctionId).emit("auction_extended", auction);
            console.log(`Auction ${auctionId} extended by ${extraMinutes} minutes`);
          } catch (err) {
            console.error("Error extending auction:", err);
          }
        }
      );

      // 🔴 Handle disconnect
      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ status: "Socket.IO server running" });
}

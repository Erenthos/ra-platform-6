"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

const socket = io("/", { path: "/api/socket" });

export default function SupplierAuctionRoom() {
  const { data: session } = useSession();
  const { auctionId } = useParams();
  const supplierId = session?.user?.id; // ✅ dynamic supplier ID
  const supplierEmail = session?.user?.email;

  const [amount, setAmount] = useState<number>(0);
  const [rank, setRank] = useState<number | null>(null);
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [auctionEnd, setAuctionEnd] = useState<Date | null>(null);
  const [bidding, setBidding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 🔌 Join auction room
  useEffect(() => {
    if (auctionId) {
      socket.emit("join_auction", auctionId);
      fetchMyBid();
    }

    socket.on("update_bids", (bids: any[]) => {
      const myBid = bids.find((b) => b.supplierId === supplierId);
      if (myBid) {
        setRank(myBid.rank);
        setCurrentBid(myBid.amount);
      }
    });

    socket.on("auction_extended", (auction: any) => {
      setAuctionEnd(new Date(auction.endTime));
    });

    return () => {
      socket.off("update_bids");
      socket.off("auction_extended");
    };
  }, [auctionId, supplierId]);

  // 🧮 Fetch initial bid info
  const fetchMyBid = async () => {
    if (!supplierId) return;
    const res = await fetch(
      `/api/bid?auctionId=${auctionId}&supplierId=${supplierId}`
    );
    const data = await res.json();
    if (data?.supplierBid) {
      setCurrentBid(data.supplierBid.amount);
      setRank(data.supplierBid.rank);
    }
  };

  // 🏷️ Place new bid
  const placeBid = async () => {
    if (!supplierId || !auctionId) {
      setModalMessage("❌ Session expired. Please sign in again.");
      setModalOpen(true);
      return;
    }

    setBidding(true);
    const res = await fetch("/api/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auctionId,
        supplierId,
        amount: Number(amount),
      }),
    });

    const data = await res.json();
    setBidding(false);

    if (!res.ok) {
      setModalMessage(data.error || "Bid failed. Please try again.");
      setModalOpen(true);
      return;
    }

    socket.emit("new_bid", { auctionId });
    await fetchMyBid();
    setAmount(0);
    setModalMessage("✅ Bid placed successfully!");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-xl">
      <motion.div
        className="bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-2xl shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          ⚡ Live Reverse Auction Room
        </h1>

        <div className="text-gray-200 text-lg mb-4">
          <p>
            <span className="font-semibold">Auction ID:</span> {auctionId}
          </p>
          {auctionEnd && (
            <p>
              <span className="font-semibold">Ends At:</span>{" "}
              {auctionEnd.toLocaleString()}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            Signed in as: <span className="text-indigo-300">{supplierEmail}</span>
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-white">
            🏷️ <strong>Your Current Bid:</strong>{" "}
            {currentBid ? `₹${currentBid.toLocaleString()}` : "No bid yet"}
          </p>
          <p className="text-white mt-2">
            🥇 <strong>Your Rank:</strong>{" "}
            {rank ? `#${rank}` : "Not ranked yet"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Input
            type="number"
            placeholder="Enter your new bid (₹)"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-2/3 text-center"
          />

          <Button
            onClick={placeBid}
            disabled={bidding || !amount}
            className="w-2/3 bg-indigo-500 hover:bg-indigo-600"
          >
            {bidding ? "Submitting..." : "Place Bid"}
          </Button>
        </div>

        <p className="text-gray-300 text-sm mt-6">
          * Each new bid must be at least the minimum decrement lower than your previous one.
        </p>
      </motion.div>

      {/* ✅ Feedback Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Bid Update"
        confirmText="Close"
        onConfirm={() => setModalOpen(false)}
      >
        {modalMessage}
      </Modal>
    </div>
  );
}

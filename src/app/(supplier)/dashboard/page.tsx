"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function SupplierDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const supplierEmail = session?.user?.email; // ✅ from authenticated session

  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierEmail) fetchAuctions();
  }, [supplierEmail]);

  const fetchAuctions = async () => {
    try {
      const res = await fetch("/api/get-auctions-for-supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierEmail }),
      });
      const data = await res.json();
      setAuctions(data || []);
    } catch (err) {
      console.error("Error fetching auctions:", err);
    }
    setLoading(false);
  };

  const handleJoinAuction = (auctionId: string) => {
    router.push(`/supplier/auction-room/${auctionId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading your auctions...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-xl">
      <h1 className="text-4xl font-bold text-center text-white mb-10">
        🧾 Supplier Dashboard
      </h1>

      {auctions.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">
          No active auctions available for your account.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => {
            const isActive = new Date(auction.endTime) > new Date();

            return (
              <motion.div
                key={auction.id}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl backdrop-blur-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-2">{auction.title}</h2>
                <p className="text-gray-300 mb-3">{auction.description}</p>
                <p className="text-sm mb-2">
                  🕒 <strong>Start:</strong>{" "}
                  {new Date(auction.startTime).toLocaleString()}
                </p>
                <p className="text-sm mb-4">
                  ⏳ <strong>Ends:</strong>{" "}
                  {new Date(auction.endTime).toLocaleString()}
                </p>

                <Button
                  onClick={() => handleJoinAuction(auction.id)}
                  disabled={!isActive}
                  className={`w-full ${
                    isActive
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isActive ? "Join Live Auction" : "Closed"}
                </Button>

                <p
                  className={`text-sm mt-4 ${
                    isActive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isActive ? "🟢 Live" : "🔴 Closed"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

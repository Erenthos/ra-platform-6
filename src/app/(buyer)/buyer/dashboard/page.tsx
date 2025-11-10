"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExcelJS from "exceljs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function BuyerDashboard() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // TEMP buyerId — replace with authenticated Buyer ID from session
  const buyerId = "buyer-temp-uuid";

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const res = await fetch(`/api/auction?buyerId=${buyerId}`);
    const data = await res.json();
    setAuctions(data);
    setLoading(false);
  };

  const extendAuction = async (auctionId: string) => {
    setExtending(auctionId);

    // connect socket dynamically (avoiding static import issues in SSR)
    const socket = (await import("socket.io-client")).io("/", { path: "/api/socket" });
    socket.emit("extend_auction", { auctionId, extraMinutes: 5 });

    setModalMessage("⏰ Auction extended successfully by 5 minutes!");
    setModalOpen(true);

    setTimeout(() => {
      setExtending(null);
    }, 1000);
  };

  const downloadSummary = async (auction: any) => {
    const bidsRes = await fetch(`/api/bid?auctionId=${auction.id}`);
    const bids = await bidsRes.json();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Auction Summary");

    sheet.mergeCells("A1:D1");
    sheet.getCell("A1").value = "AUCTION SUMMARY REPORT";
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow(["Auction Title", auction.title]);
    sheet.addRow(["Description", auction.description]);
    sheet.addRow(["Ends At", new Date(auction.endTime).toLocaleString()]);
    sheet.addRow([]);
    sheet.addRow(["Supplier Email", "Bid Amount (₹)", "Rank"]);

    bids.forEach((bid: any) => {
      sheet.addRow([
        bid.supplier?.email || "N/A",
        bid.amount,
        bid.rank || "-",
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${auction.title}_Summary.xlsx`;
    link.click();

    setModalMessage("📊 Auction Summary downloaded successfully!");
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading your auctions...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl">
      <h1 className="text-4xl font-bold text-center text-white mb-10">
        💼 Buyer Dashboard
      </h1>

      {auctions.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">
          No auctions found. Create one to get started!
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
                  ⏱ <strong>Ends At:</strong>{" "}
                  {new Date(auction.endTime).toLocaleString()}
                </p>
                <p className="text-sm mb-4">
                  🧾 <strong>Suppliers Invited:</strong>{" "}
                  {auction.invitedSuppliers.length}
                </p>

                <div className="flex flex-col gap-2">
                  {isActive && (
                    <Button
                      onClick={() => extendAuction(auction.id)}
                      disabled={extending === auction.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {extending === auction.id
                        ? "Extending..."
                        : "Extend +5 min"}
                    </Button>
                  )}

                  <Button
                    onClick={() => downloadSummary(auction)}
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    Download Summary
                  </Button>
                </div>

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

      {/* ✅ Modal Integration */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Action Completed"
        confirmText="Close"
        onConfirm={() => setModalOpen(false)}
      >
        {modalMessage}
      </Modal>
    </div>
  );
}

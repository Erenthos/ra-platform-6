"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import ExcelJS from "exceljs";

interface Auction {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  minDecrementValue: number;
  buyer: {
    name: string | null;
    email: string;
  };
}

export default function AuctionSummaryPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await fetch("/api/auction?buyerId=current");
      if (!res.ok) throw new Error("Failed to fetch auctions");
      const data = await res.json();
      setAuctions(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load auction summaries.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async (auction: Auction) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Auction Summary");

      // Header Title
      sheet.mergeCells("A1", "F1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = `AUCTION SUMMARY REPORT`;
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: "center" };

      // Auction details
      sheet.addRow([]);
      sheet.addRow(["Title", auction.title]);
      sheet.addRow(["Description", auction.description || "-"]);
      sheet.addRow(["Buyer", `${auction.buyer?.name || ""} (${auction.buyer?.email})`]);
      sheet.addRow(["Ends At", new Date(auction.endTime).toLocaleString()]);
      sheet.addRow([]);
      sheet.addRow(["Supplier ID", "Supplier Email", "Item Name", "Qty (UOM)", "Rate (₹)", "Amount (₹)"]);

      // Placeholder data — replace later with Prisma join of bids
      sheet.addRow(["SUP123", "vendor1@example.com", "Solar Cables", "100m", "98", "9800"]);
      sheet.addRow(["SUP234", "vendor2@example.com", "Solar Cables", "100m", "96", "9600"]);

      // Styling
      sheet.columns.forEach((col) => {
        col.width = 25;
        col.alignment = { vertical: "middle", horizontal: "left" };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${auction.title.replace(/\s+/g, "_")}_Summary.xlsx`;
      link.click();
      toast.success("Auction summary downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate Excel summary.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl">
      <motion.div
        className="w-full max-w-5xl p-8 bg-white/10 rounded-2xl shadow-2xl border border-white/20 text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          📊 Auction Summary Reports
        </h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading auction data...</p>
        ) : auctions.length === 0 ? (
          <p className="text-center text-gray-400">No auctions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-white/20">
              <thead>
                <tr className="bg-white/10 text-gray-200">
                  <th className="p-3 border border-white/10">Title</th>
                  <th className="p-3 border border-white/10">Status</th>
                  <th className="p-3 border border-white/10">End Time</th>
                  <th className="p-3 border border-white/10">Action</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction) => (
                  <tr
                    key={auction.id}
                    className="hover:bg-white/10 transition-all border-t border-white/10"
                  >
                    <td className="p-3">{auction.title}</td>
                    <td className="p-3 capitalize">
                      {auction.status === "active" ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Closed</span>
                      )}
                    </td>
                    <td className="p-3">
                      {new Date(auction.endTime).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <Button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                        onClick={() => downloadExcel(auction)}
                      >
                        Download Summary
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}


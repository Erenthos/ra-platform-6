"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // optional if you’re using sonner/toastify
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function CreateAuctionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(10);
  const [minDecrement, setMinDecrement] = useState(100);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  // TEMP: Replace with actual logged-in buyerId
  const buyerId = "buyer-temp-uuid";

  const addEmail = () => {
    if (emailInput.trim() && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleSubmit = async () => {
    if (!title || emails.length === 0) {
      toast?.error?.("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        buyerId,
        durationMinutes: Number(duration),
        minDecrementValue: Number(minDecrement),
        invitedSuppliers: emails,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast?.success?.("Auction created successfully!");
      setTitle("");
      setDescription("");
      setDuration(10);
      setMinDecrement(100);
      setEmails([]);
    } else {
      toast?.error?.(data.error || "Failed to create auction");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/40 backdrop-blur-xl">
      <motion.div
        className="w-full max-w-3xl p-8 bg-white/10 rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🏗️ Create New Auction
        </h1>

        <div className="space-y-4">
          <Input
            placeholder="Auction Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Auction Description (optional)"
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Min Decrement (₹)"
              value={minDecrement}
              onChange={(e) => setMinDecrement(Number(e.target.value))}
            />
          </div>

          {/* Supplier Email Input */}
          <div className="bg-white/10 p-4 rounded-xl">
            <label className="text-sm text-gray-200 mb-2 block">
              Invite Supplier Emails:
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter supplier email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Button onClick={addEmail} className="bg-indigo-500 hover:bg-indigo-600">
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {emails.map((email) => (
                <span
                  key={email}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    className="text-white/80 hover:text-red-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 mt-6"
          >
            {loading ? "Creating..." : "Create Auction"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}


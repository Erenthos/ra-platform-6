"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-gray-900/60 backdrop-blur-2xl">
      {/* Animated background aurora lights */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-60 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 opacity-25 blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      />

      {/* Hero Section */}
      <motion.div
        className="z-10 text-center px-6 sm:px-12 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Experience the Future of Bidding With <span className="text-indigo-400">Avaada</span>
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl mb-10">
          Join the next-generation Reverse Auction Platform designed for
          seamless, transparent, and competitive online bidding between buyers
          and suppliers — powered by modern technology and stunning design.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            onClick={() => router.push("/signup")}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-2xl text-lg"
          >
            Start as Buyer
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl text-lg"
          >
            Start as Supplier
          </Button>
        </div>
      </motion.div>

      {/* Info Section / Feature Cards */}
      <motion.div
        className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 px-6 max-w-6xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {[
          {
            title: "🔒 Secure & Transparent",
            desc: "All bids are confidential — no supplier can see others’ prices. Buyers see only live rankings.",
          },
          {
            title: "⚡ Real-Time Bidding",
            desc: "Experience instant rank updates and dynamic bid changes using our Socket.IO powered engine.",
          },
          {
            title: "📈 Powerful Insights",
            desc: "Download real-time auction summaries and gain visibility into performance instantly.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center text-gray-200 hover:bg-white/20 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.div
        className="z-10 mt-20 mb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <p className="text-gray-300 text-sm">
          © {new Date().getFullYear()} Avaada Reverse Auction Platform — Empowering smarter procurement decisions.
        </p>
      </motion.div>
    </div>
  );
}


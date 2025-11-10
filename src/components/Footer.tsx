"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const links = [
    { name: "About", path: "/about" },
    { name: "Support", path: "/support" },
    { name: "Terms", path: "/terms" },
  ];

  return (
    <motion.footer
      className="relative z-20 w-full bg-white/10 border-t border-white/20 backdrop-blur-xl text-gray-300 py-6 mt-auto shadow-[0_-2px_20px_rgba(255,255,255,0.05)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section - Brand */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center gap-2"
        >
          <img src="/logo.svg" alt="Logo" className="w-7 h-7" />
          <p className="text-white font-semibold text-lg tracking-wide">
            Reverse Auction Platform
          </p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex gap-6 text-sm">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Section - Copyright */}
        <p className="text-xs text-gray-400 text-center md:text-right">
          © {new Date().getFullYear()} Reverse Auction Platform. All rights reserved.
        </p>
      </div>

      {/* Gradient Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-75"></div>
    </motion.footer>
  );
}


"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo / Title */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center gap-2"
        >
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg md:text-xl font-bold text-white">
            Reverse Auction Platform
          </h1>
        </div>

        {/* Right: User Info + Signout */}
        {session?.user ? (
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="text-gray-200 text-right">
              <p className="font-semibold text-white">{session.user.name}</p>
              <p className="text-gray-400 text-xs">
                {session.user.role === "BUYER" ? "Buyer" : "Supplier"}
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 text-sm md:text-base"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => router.push("/signin")}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            Sign In
          </Button>
        )}
      </div>
    </motion.nav>
  );
}


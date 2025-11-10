"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    // Fetch user role from session
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "BUYER") router.push("/buyer/dashboard");
    else if (role === "SUPPLIER") router.push("/supplier/dashboard");
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-2xl">
      <motion.div
        className="bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          🔐 Sign In to Your Account
        </h1>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            onClick={handleSignin}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 mt-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="text-gray-300 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}


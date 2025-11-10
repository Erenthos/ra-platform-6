"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SUPPLIER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    alert("Signup successful! You can now sign in.");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-2xl">
      <motion.div
        className="bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          ✨ Create Your Account
        </h1>

        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none"
          >
            <option value="SUPPLIER">Supplier</option>
            <option value="BUYER">Buyer</option>
          </select>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 mt-4"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>

        <p className="text-gray-300 text-sm text-center mt-6">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}


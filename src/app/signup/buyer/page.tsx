"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

export default function BuyerSignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "BUYER" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      alert("✅ Buyer signup successful!");
      window.location.href = "/signin";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <div className="glass max-w-md w-full p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Buyer Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full Name"
            type="text"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4"
          >
            {loading ? "Signing up..." : "Sign Up as Buyer"}
          </button>
        </form>
      </div>
    </div>
  );
}

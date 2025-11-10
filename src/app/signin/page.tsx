"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");

      alert("✅ Login successful!");
      // Redirect based on role
      if (data.user.role === "BUYER") window.location.href = "/buyer/dashboard";
      else window.location.href = "/supplier/dashboard";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <div className="glass max-w-md w-full p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button type="submit" disabled={loading} className="btn-primary mt-4">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

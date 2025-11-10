"use client";

import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="glass max-w-4xl w-full p-10 md:p-16 rounded-3xl shadow-2xl backdrop-blur-2xl border border-white/20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Experience the Future of Bidding With{" "}
            <span className="text-blue-400">Avaada</span>
          </h1>

          <p className="text-gray-300 mb-10 text-lg md:text-xl leading-relaxed">
            Join the next-generation Reverse Auction Platform designed for seamless,
            transparent, and competitive online bidding between buyers and suppliers —
            powered by modern technology and stunning glassmorphic design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Link
              href="/signup/buyer"
              className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/40"
            >
              Start as Buyer
            </Link>

            <Link
              href="/signup/supplier"
              className="btn-secondary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-green-500/40"
            >
              Start as Supplier
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left text-gray-300">
            <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">🔒 Secure & Transparent</h3>
              <p className="text-sm">
                All bids are confidential — suppliers only see their rank. Buyers get
                complete transparency and control.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-2 text-green-400">⚡ Real-Time Bidding</h3>
              <p className="text-sm">
                Instant rank updates and automatic bid adjustments powered by Socket.IO
                ensure seamless live bidding.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">📈 Powerful Insights</h3>
              <p className="text-sm">
                Download real-time auction summaries, analyze trends, and make informed
                procurement decisions.
              </p>
            </div>
          </div>

          {/* Footer Text Inside Hero */}
          <p className="text-xs text-gray-500 mt-12">
            © {new Date().getFullYear()} Avaada Reverse Auction Platform — Empowering smarter procurement decisions.
          </p>
        </div>
      </section>
    </div>
  );
}

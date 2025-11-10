"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-gray-900/60 backdrop-blur-2xl px-6 py-20">
      {/* Aurora background animation */}
      <motion.div
        className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[-250px] right-[-150px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 opacity-25 blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      />

      {/* Main Content */}
      <motion.div
        className="z-10 max-w-5xl text-center text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400">
          About Avaada Reverse Auction Platform
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
          At <span className="text-indigo-300 font-semibold">Avaada</span>, we
          believe in reshaping how organizations procure, negotiate, and win.
          Our English-style Reverse Auction Platform brings transparency,
          fairness, and efficiency to every bidding experience — empowering
          both buyers and suppliers with real-time insights and equal
          opportunity to compete.
        </p>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: "💡 Our Mission",
              text: "To revolutionize procurement through innovation and technology — ensuring every bid is transparent, data-driven, and sustainable.",
            },
            {
              title: "⚙️ Our Vision",
              text: "To become the global standard for reverse auction excellence, empowering buyers and suppliers to collaborate with trust and speed.",
            },
            {
              title: "🌿 Our Values",
              text: "Transparency, Integrity, and Sustainability — these principles drive every decision and every line of code at Avaada.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left shadow-xl backdrop-blur-lg hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-semibold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider Line */}
        <div className="mt-16 mb-8 w-40 h-[2px] mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-80"></div>

        {/* Why Choose Us Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose Avaada?
          </h2>
          <p className="text-gray-300 mb-8">
            Avaada stands at the intersection of technology, trust, and
            transparency. With real-time bidding, automated summaries, and
            world-class performance — we bring clarity to competition.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "⚡ Real-Time Socket Engine",
                desc: "Powered by Socket.IO for instant bid synchronization and rank updates.",
              },
              {
                title: "🧠 Intelligent Insights",
                desc: "Download structured Excel summaries and data-driven insights instantly.",
              },
              {
                title: "🔐 End-to-End Security",
                desc: "Encrypted data, strict access control, and secure authentication with NextAuth.",
              },
              {
                title: "🌍 Sustainable Procurement",
                desc: "Enabling smarter sourcing decisions aligned with sustainability goals.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-left"
                whileHover={{ scale: 1.05 }}
              >
                <h4 className="text-lg font-semibold mb-1 text-white">
                  {card.title}
                </h4>
                <p className="text-gray-300 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

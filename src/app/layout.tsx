import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reverse Auction Platform",
  description: "Experience the Future of Bidding with Avaada",
};

// ✅ Global dynamic rendering so session context always works
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white antialiased`}
      >
        {/* ✅ Client-side session provider to support NextAuth context */}
        <SessionProviderWrapper>
          {/* ✅ Navbar (visible on all pages) */}
          <Navbar />

          {/* ✅ Main content area */}
          <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
            {children}
          </main>

          {/* ✅ Glassmorphic footer */}
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reverse Auction Platform",
  description: "Experience the Future of Bidding with Avaada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white`}
      >
        {/* ✅ Client-side SessionProvider for NextAuth */}
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

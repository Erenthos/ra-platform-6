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
        <SessionProviderWrapper>
          <Navbar />

          {/* ✅ Full width but visually centered */}
          <main className="min-h-[80vh] w-full flex justify-center">
            <div className="max-w-7xl w-full px-8 py-10">
              {children}
            </div>
          </main>

          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

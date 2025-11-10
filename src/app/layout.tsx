// src/app/layout.tsx
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Reverse Auction Platform",
  description:
    "A modern English Reverse Auction Platform for Buyers and Suppliers — built with Next.js, Prisma, and Neon PostgreSQL.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white min-h-screen overflow-x-hidden">
        {/* NextAuth Session Context */}
        <SessionProvider>
          {/* Global Toast Notification */}
          <Toaster richColors position="top-right" />

          {/* Persistent Navbar */}
          <Navbar />

          {/* Main Page Area */}
          <main className="pt-20 pb-10 flex-1 flex items-center justify-center px-4 sm:px-8">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

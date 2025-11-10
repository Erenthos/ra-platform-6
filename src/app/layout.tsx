// src/app/layout.tsx
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reverse Auction Platform",
  description: "Traditional English Reverse Auction System — Buyer vs Supplier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white min-h-screen">
        <SessionProvider>
          {/* Global Notification Toasts */}
          <Toaster richColors position="top-right" />

          {/* Main App Container */}
          <div className="flex flex-col min-h-screen">
            {/* Optional: Navbar could go here */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
              {children}
            </main>

            {/* Optional: Footer */}
            <footer className="text-center text-gray-400 text-sm pb-4">
              © {new Date().getFullYear()} Reverse Auction Platform — All Rights Reserved
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}


'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/context/BrandContext";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white m-0 p-0`}>
        <BrandProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <main className="h-full">
                <div className="p-0">
                  <div className="w-full max-w-none">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </BrandProvider>
      </body>
    </html>
  );
}

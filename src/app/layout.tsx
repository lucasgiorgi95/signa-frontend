'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/context/BrandContext";
import { AuthProvider } from "@/context/AuthContext";
import LayoutContent from "@/components/LayoutContent";

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
        <AuthProvider>
          <BrandProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

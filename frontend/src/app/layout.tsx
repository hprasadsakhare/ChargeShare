import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import fcl from "@/lib/fcl";
import { Suspense } from "react";
import WalletButtons from "@/components/WalletButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChargeShare",
  description: "P2P EV Charging on Flow",
};

function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-50 via-emerald-50 to-pink-50">
      <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 tracking-tight text-lg">
        ChargeShare <span className="align-middle">⚡</span>
      </div>
      <Suspense>
        <WalletButtons />
      </Suspense>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}

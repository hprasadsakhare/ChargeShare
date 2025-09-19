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

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-pink-400 tracking-tight text-xl">
              ChargeShare <span className="align-middle">⚡</span>
            </div>
            <p className="text-slate-300 text-sm">
              Decentralized EV charging marketplace on Flow blockchain. 
              Connect, charge, and earn with peer-to-peer charging stations.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-400">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/register" className="hover:text-emerald-400 transition-colors">Register Station</a></li>
              <li><a href="/book" className="hover:text-emerald-400 transition-colors">Book Station</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-pink-400">Connect</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 ChargeShare. 
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
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
        <Footer />
      </body>
    </html>
  );
}

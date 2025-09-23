import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Link from "next/link";
import WalletButtons from "@/components/WalletButtons";
import FCLProvider from "@/components/FCLProvider";
import NotificationSystem from "@/components/NotificationSystem";
import FloatingActionButton from "@/components/FloatingActionButton";
import StatusIndicator from "@/components/StatusIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "ChargeShare - P2P EV Charging on Flow",
  description: "Decentralized peer-to-peer EV charging platform. Find charging stations, register your own, and earn with secure blockchain payments.",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChargeShare",
  },
  openGraph: {
    title: "ChargeShare - P2P EV Charging on Flow",
    description: "Decentralized peer-to-peer EV charging platform",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChargeShare - P2P EV Charging on Flow",
    description: "Decentralized peer-to-peer EV charging platform",
  },
};

function Header() {
  return (
    <header className="header-container relative flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-50 via-emerald-50 to-pink-50 overflow-hidden animate-header-glow">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-16 h-16 bg-indigo-300 rounded-full mix-blend-multiply filter blur-sm animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-emerald-300 rounded-full mix-blend-multiply filter blur-sm animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-pink-300 rounded-full mix-blend-multiply filter blur-sm animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Interactive Logo */}
      <div className="relative z-10">
        <Link href="/" className="header-logo group block">
          <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 tracking-tight text-lg animate-gradient-shift-logo transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg">
            ChargeShare 
            <span className="logo-lightning align-middle text-2xl transition-all duration-300 group-hover:animate-pulse group-hover:drop-shadow-lg group-hover:text-yellow-400">
              ⚡
            </span>
          </div>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-pink-400 tracking-tight text-lg opacity-0 group-hover:opacity-30 group-hover:blur-sm transition-all duration-300">
            ChargeShare 
            <span className="align-middle text-2xl">⚡</span>
          </div>
          {/* Click ripple effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-20 group-active:bg-gradient-to-r group-active:from-indigo-200 group-active:to-pink-200 group-active:animate-ping"></div>
        </Link>
      </div>
      
      {/* Navigation and Wallet */}
      <div className="relative z-10 flex items-center gap-6">
        <nav className="hidden md:flex items-center space-x-4">
          <a href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            Dashboard
          </a>
          <a href="/register" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
            Register
          </a>
          <a href="/book" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
            Book
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <StatusIndicator status="online" />
          </div>
          <NotificationSystem />
          <Suspense>
            <WalletButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and description - compact */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-pink-400 tracking-tight text-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
              ChargeShare <span className="align-middle animate-pulse">⚡</span>
            </Link>
            <p className="text-slate-300 text-xs hidden sm:block">
              P2P EV Charging on Flow
            </p>
          </div>
          
          {/* Interactive navigation links */}
          <div className="flex items-center space-x-6">
            <a href="/dashboard" className="footer-link text-slate-300 hover:text-indigo-400 transition-all duration-300 text-sm hover:scale-110 transform hover:shadow-lg hover:shadow-indigo-400/20 px-3 py-1 rounded-md">
              Dashboard
            </a>
            <a href="/register" className="footer-link text-slate-300 hover:text-emerald-400 transition-all duration-300 text-sm hover:scale-110 transform hover:shadow-lg hover:shadow-emerald-400/20 px-3 py-1 rounded-md">
              Register
            </a>
            <a href="/book" className="footer-link text-slate-300 hover:text-emerald-400 transition-all duration-300 text-sm hover:scale-110 transform hover:shadow-lg hover:shadow-emerald-400/20 px-3 py-1 rounded-md">
              Book
            </a>
            <a href="#" className="footer-link text-slate-300 hover:text-pink-400 transition-all duration-300 text-sm hover:scale-110 transform hover:shadow-lg hover:shadow-pink-400/20 px-3 py-1 rounded-md">
              How It Works
            </a>
          </div>
          
          {/* Social links with hover effects */}
          <div className="flex items-center space-x-4">
            <a href="#" className="footer-social text-slate-400 hover:text-indigo-400 transition-all duration-300 text-lg p-2 rounded-full hover:bg-indigo-400/10">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="footer-social text-slate-400 hover:text-indigo-400 transition-all duration-300 text-lg p-2 rounded-full hover:bg-indigo-400/10">
              <span className="sr-only">Discord</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="#" className="footer-social text-slate-400 hover:text-indigo-400 transition-all duration-300 text-lg p-2 rounded-full hover:bg-indigo-400/10">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Bottom bar with copyright and legal links */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-400 text-xs">
            © 2025 ChargeShare. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="footer-link text-slate-400 hover:text-white transition-all duration-300 text-xs hover:underline hover:scale-105 transform px-2 py-1 rounded">
              Privacy
            </a>
            <a href="#" className="footer-link text-slate-400 hover:text-white transition-all duration-300 text-xs hover:underline hover:scale-105 transform px-2 py-1 rounded">
              Terms
            </a>
            <a href="#" className="footer-link text-slate-400 hover:text-white transition-all duration-300 text-xs hover:underline hover:scale-105 transform px-2 py-1 rounded">
              Cookies
            </a>
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
        <FCLProvider>
          <Header />
          <main className="p-4">{children}</main>
          <Footer />
          <FloatingActionButton />
        </FCLProvider>
      </body>
    </html>
  );
}

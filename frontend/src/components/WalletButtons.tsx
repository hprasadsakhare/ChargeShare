"use client";
import fcl from "@/lib/fcl";
import { useEffect, useState } from "react";

export default function WalletButtons() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  if (user && user.addr) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-lg border border-emerald-200/50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700 font-medium">
            {user.addr.slice(0, 6)}...{user.addr.slice(-4)}
          </span>
        </div>
        <button 
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
          onClick={() => fcl.unauthenticate()}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 animate-pulse"
      onClick={() => fcl.authenticate()}
    >
      Connect Wallet
    </button>
  );
}



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
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{user.addr}</span>
        <button className="px-3 py-1 border rounded" onClick={() => fcl.unauthenticate()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button className="px-3 py-1 border rounded" onClick={() => fcl.authenticate()}>
      Connect Wallet
    </button>
  );
}



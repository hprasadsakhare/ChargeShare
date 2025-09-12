"use client";
import fcl from "@/lib/fcl";
import { useState } from "react";

export default function BookPage() {
  const [stationId, setStationId] = useState("");
  const [amount, setAmount] = useState("10.0");
  const [status, setStatus] = useState("");

  const lockFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Locking funds...");
    try {
      const FT = process.env.NEXT_PUBLIC_FT_ADDRESS || "0x9a0766d93b6608b7";
      const ESCROW = process.env.NEXT_PUBLIC_BOOKING_ESCROW || "0xDeployer";
      const txId = await fcl.mutate({
        cadence: `
          import FungibleToken from ${"${FT}"}
          import BookingEscrow from ${"${ESCROW}"}
          transaction(stationId: UInt64, amount: UFix64) {
            prepare(acct: auth(BorrowValue) &Account) {
              let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/USDCVault)
                ?? panic("Missing USDC Vault")
              let temp <- vaultRef.withdraw(amount: amount)
              let _ = BookingEscrow.lockFunds(stationId: stationId, <- temp)
            }
          }
        `,
        args: (arg: any, t: any) => [arg(stationId, t.UInt64), arg(amount, t.UFix64)],
        limit: 200,
      });
      await fcl.tx(txId).onceSealed();
      setStatus("Funds locked.");
    } catch (e: any) {
      setStatus(e.message || "Failed");
    }
  };

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Completing...");
    try {
      const FT = process.env.NEXT_PUBLIC_FT_ADDRESS || "0x9a0766d93b6608b7";
      const ESCROW = process.env.NEXT_PUBLIC_BOOKING_ESCROW || "0xDeployer";
      const txId = await fcl.mutate({
        cadence: `
          import FungibleToken from ${"${FT}"}
          import BookingEscrow from ${"${ESCROW}"}
          transaction(bookingId: UInt64) {
            prepare(acct: auth(BorrowValue) &Account) {
              let receiver = acct.getCapability(/public/USDCReceiver)
                .borrow<&{FungibleToken.Receiver}>() ?? panic("No receiver")
              BookingEscrow.completeSession(bookingId: bookingId, ownerReceiver: receiver)
            }
          }
        `,
        args: (arg: any, t: any) => [arg(stationId, t.UInt64)],
        limit: 200,
      });
      await fcl.tx(txId).onceSealed();
      setStatus("Session completed; funds released.");
    } catch (e: any) {
      setStatus(e.message || "Failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Book Station</h1>
        <form className="space-y-3 mx-auto max-w-md" onSubmit={lockFunds}>
          <input className="w-full border p-2 rounded" placeholder="Station ID" value={stationId} onChange={(e) => setStationId(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Amount (USDC UFix64)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="px-4 py-2 rounded-lg border bg-emerald-600 text-white border-emerald-600" type="submit">Lock Funds</button>
        </form>
        <form className="space-y-3" onSubmit={complete}>
          <button className="px-4 py-2 rounded-lg border bg-pink-600 text-white border-pink-600" type="submit">Simulate Complete Session</button>
        </form>
        <div className="text-sm text-gray-600">{status}</div>
      </div>
    </div>
  );
}



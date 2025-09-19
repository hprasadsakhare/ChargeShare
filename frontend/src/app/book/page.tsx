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
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-indigo-100 text-emerald-700 text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Secure booking via smart contracts
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600">
            Book a Charging Session
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Lock funds in escrow and start charging. When your session completes, funds are released instantly.</p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Booking Form */}
          <div className="md:col-span-3">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-xl">⚡</div>
                <h2 className="text-xl font-bold text-emerald-700">Lock Funds</h2>
              </div>
              <form className="space-y-5" onSubmit={lockFunds}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station ID</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 42"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC UFix64)</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 10.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Use UFix64 format with exactly one decimal point (e.g., 10.0, 15.5).</p>
                </div>
                <button
                  className="w-full px-4 py-3 rounded-xl border-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Lock Funds & Start
                </button>
              </form>
            </div>
          </div>

          {/* Right: Complete Session */}
          <div className="md:col-span-2">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-pink-100 shadow-lg bg-gradient-to-br from-pink-50 to-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center text-xl">💸</div>
                <h2 className="text-xl font-bold text-pink-700">Complete Session</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">When your charging session is over, release funds from escrow to the station owner.</p>
              <form className="space-y-4" onSubmit={complete}>
                <button
                  className="w-full px-4 py-3 rounded-xl border-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white border-pink-600 hover:from-pink-700 hover:to-pink-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Release Funds
                </button>
              </form>
              <div className="mt-6 text-xs text-gray-500">
                Note: This demo uses a simulated completion flow. In production, the session would be confirmed via IoT or host confirmation.
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {status && (
          <div className="mt-8">
            <div className="rounded-2xl p-4 text-center bg-gradient-to-r from-indigo-50 via-emerald-50 to-pink-50 border">
              <span className="text-sm text-gray-700">{status}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



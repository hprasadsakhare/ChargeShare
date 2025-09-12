"use client";
import MapView from "@/components/MapView";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600">
          Find affordable charging nearby, or rent out your own station and earn instantly
        </h1>
        <div className="flex gap-3">
          <a className="px-4 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600" href="/register">Register Station</a>
          <a className="px-4 py-2 rounded-lg border bg-emerald-600 text-white border-emerald-600" href="/book">Book Station</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <MapView />
      </div>
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600">How It Works (3 Steps)</h3>
          <p className="text-sm text-gray-600">Quick overview of the flow</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-2xl p-6 border shadow-sm bg-gradient-to-br from-indigo-50 to-white">
            <div className="text-3xl">🔌</div>
            <div className="mt-2 font-semibold">1) List Your Station</div>
            <div className="text-sm text-gray-700 mt-1">Connect your wallet and register your charger. Set price per kWh and availability.</div>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm bg-gradient-to-br from-emerald-50 to-white">
            <div className="text-3xl">🚗</div>
            <div className="mt-2 font-semibold">2) Book & Charge</div>
            <div className="text-sm text-gray-700 mt-1">EV drivers find stations nearby, lock payment in escrow, and start charging.</div>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm bg-gradient-to-br from-amber-50 to-white">
            <div className="text-3xl">💸</div>
            <div className="mt-2 font-semibold">3) Get Paid, Build Reputation</div>
            <div className="text-sm text-gray-700 mt-1">Once charging is complete, funds are released instantly. Both drivers and hosts earn reputation NFTs.</div>
          </div>
        </div>
      </section>
    </div>
  );
}

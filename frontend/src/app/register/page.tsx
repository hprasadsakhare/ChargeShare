"use client";
import fcl from "@/lib/fcl";
import { useState } from "react";

export default function RegisterPage() {
  const [location, setLocation] = useState("");
  const [chargerType, setChargerType] = useState("AC");
  const [price, setPrice] = useState("0.20");
  const [available, setAvailable] = useState(true);
  const [status, setStatus] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const REG = process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer";
      const txId = await fcl.mutate({
        cadence: `
          import StationRegistry from ${"${REG}"}
          transaction(location: String, chargerType: String, price: UFix64, available: Bool) {
            prepare(signer: auth(BorrowValue) &Account) {
              let _ = StationRegistry.registerStation(location: location, chargerType: chargerType, costPerKWh: price, available: available)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(location, t.String),
          arg(chargerType, t.String),
          arg(price, t.UFix64),
          arg(available, t.Bool),
        ],
        limit: 100,
      });
      await fcl.tx(txId).onceSealed();
      setStatus("Registered!");
    } catch (e: any) {
      setStatus(e.message || "Failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-emerald-100 text-indigo-700 text-sm font-medium">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Earn by sharing your charger
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600">
            Register Your Charging Station
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">List your charger with pricing and availability. Drivers can find and book instantly—payments are secured by smart contracts.</p>
        </div>

        {/* Card */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xl">🔌</div>
                <h2 className="text-xl font-bold text-indigo-700">Station Details</h2>
              </div>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (lat,lng)</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 18.5204,73.8567"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter coordinates in decimal degrees separated by a comma.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Charger Type</label>
                  <select
                    className="w-full border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={chargerType}
                    onChange={(e) => setChargerType(e.target.value)}
                  >
                    <option value="AC">AC</option>
                    <option value="DC">DC</option>
                    <option value="Type2">Type 2</option>
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per kWh (UFix64)</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 0.20"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Use UFix64 with exactly one decimal place (e.g., 0.2, 1.5).</p>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                  <span className="text-sm text-gray-700">Available for booking</span>
                </label>
                <button
                  className="w-full px-4 py-3 rounded-xl border-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Register Station
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-xl">📍</div>
                <h3 className="text-lg font-bold text-emerald-700">Tips for Better Visibility</h3>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                <li>Use accurate coordinates to help drivers find your charger easily.</li>
                <li>Set a competitive price per kWh based on your area.</li>
                <li>Keep availability updated to earn more bookings.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-white/70 border p-4 text-sm text-gray-700">
                Example coordinates: <span className="font-mono">18.5204,73.8567</span> (Pune), <span className="font-mono">19.0760,72.8777</span> (Mumbai)
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



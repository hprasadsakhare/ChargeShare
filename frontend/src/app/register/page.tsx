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
      <div className="w-full max-w-xl mx-auto space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Register Station</h1>
        <form onSubmit={onSubmit} className="space-y-3 mx-auto max-w-md">
          <input className="w-full border p-2 rounded" placeholder="lat,lng" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Charger Type" value={chargerType} onChange={(e) => setChargerType(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Cost per kWh (UFix64)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <label className="flex items-center justify-center gap-2">
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            <span>Available</span>
          </label>
          <button className="px-4 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600" type="submit">Register</button>
        </form>
        <div className="text-sm text-gray-600">{status}</div>
      </div>
    </div>
  );
}



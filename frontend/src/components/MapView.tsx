"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import fcl from "@/lib/fcl";

type Station = {
  id: number;
  owner: string;
  location: string; // "lat,lng" for demo simplicity
  chargerType: string;
  costPerKWh: string; // UFix64 string
  available: boolean;
};

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function MapView() {
  const [stations, setStations] = useState<Station[]>([]);
  const [view, setView] = useState<
    | "pune"
    | "india"
    | "mumbai"
    | "delhi"
    | "kolkata"
    | "bangalore"
    | "solapur"
  >("pune");

  useEffect(() => {
    let mounted = true;
    const REG = process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer";
    const cadence = `
      import StationRegistry from ${"${REG}"}
      pub fun main(): [StationRegistry.Station] {
        return StationRegistry.getAllStations()
      }
    `;
    (async () => {
      try {
        const data: any = await fcl.query({ cadence, args: (_: any, __: any) => [] });
        if (!mounted) return;
        const parsed: Station[] = (data || []).map((s: any) => ({
          id: Number(s.id),
          owner: s.owner,
          location: s.location as string,
          chargerType: s.chargerType as string,
          costPerKWh: String(s.costPerKWh),
          available: Boolean(s.available),
        }));
        setStations(parsed);
      } catch (_e) {
        // Fallback demo markers if query fails
        if (!mounted) return;
        setStations([
          { id: 1, owner: "0x0", location: "18.5204,73.8567", chargerType: "AC", costPerKWh: "0.20", available: true }, // Pune
          { id: 2, owner: "0x0", location: "19.0760,72.8777", chargerType: "DC", costPerKWh: "0.35", available: true }, // Mumbai
        ]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const centers: Record<string, [number, number]> = {
    pune: [18.5204, 73.8567],
    india: [22.3511148, 78.6677428],
    mumbai: [19.076, 72.8777],
    delhi: [28.6139, 77.209],
    kolkata: [22.5726, 88.3639],
    bangalore: [12.9716, 77.5946],
    solapur: [17.6599, 75.9064],
  };
  const center = centers[view];
  const zoom = view === "india" ? 5 : 12;

  return (
    <div className="w-full h-[70vh] rounded-xl border bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 p-2">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button className={`px-3 py-1 rounded border ${view === "pune" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`} onClick={() => setView("pune")}>Pune</button>
        <button className={`px-3 py-1 rounded border ${view === "india" ? "bg-pink-600 text-white border-pink-600" : "bg-white"}`} onClick={() => setView("india")}>India</button>
        <button className={`px-3 py-1 rounded border ${view === "mumbai" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"}`} onClick={() => setView("mumbai")}>Mumbai</button>
        <button className={`px-3 py-1 rounded border ${view === "delhi" ? "bg-amber-600 text-white border-amber-600" : "bg-white"}`} onClick={() => setView("delhi")}>Delhi</button>
        <button className={`px-3 py-1 rounded border ${view === "kolkata" ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white"}`} onClick={() => setView("kolkata")}>Kolkata</button>
        <button className={`px-3 py-1 rounded border ${view === "bangalore" ? "bg-cyan-600 text-white border-cyan-600" : "bg-white"}`} onClick={() => setView("bangalore")}>Bangalore</button>
        <button className={`px-3 py-1 rounded border ${view === "solapur" ? "bg-rose-600 text-white border-rose-600" : "bg-white"}`} onClick={() => setView("solapur")}>Solapur</button>
      </div>
      <div className="h-[calc(70vh-40px)]">
        <LeafletMap stations={stations} center={center} zoom={zoom} />
      </div>
    </div>
  );
}



"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

type Station = {
  id: number;
  owner: string;
  location: string;
  chargerType: string;
  costPerKWh: string;
  available: boolean;
};

function MapCanvas({
  stations,
  center,
  zoom,
}: {
  stations: Station[];
  center: [number, number];
  zoom: number;
}) {
  // Ensure default marker icons load in Next.js
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  function MapController({ targetCenter, targetZoom }: { targetCenter: [number, number]; targetZoom: number }) {
    const map = useMap();
    // Recenter the map when props change
    map.setView(targetCenter, targetZoom, { animate: true });
    return null;
  }
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", borderRadius: 12 }}>
      <MapController targetCenter={center} targetZoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      
      {stations.map((s) => {
        const [lat, lng] = s.location.split(",").map(Number);
        return (
          <Marker key={s.id} position={[lat, lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="font-medium">Station #{s.id}</div>
                <div>Type: {s.chargerType}</div>
                <div>Price: {s.costPerKWh} / kWh</div>
                <div>Status: {s.available ? "Available" : "Unavailable"}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapCanvas;



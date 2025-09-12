"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Station = {
  id: number;
  owner: string;
  location: string;
  chargerType: string;
  costPerKWh: string;
  available: boolean;
};

export default function LeafletMap({
  stations,
  center,
  zoom,
}: {
  stations: Station[];
  center: [number, number];
  zoom: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", borderRadius: 12 }}>
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



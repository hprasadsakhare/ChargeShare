"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Ensure default marker icons load in Next.js
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  center: [number, number];
  zoom: number;
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: [number, number] | null;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function LocationPicker({ center, zoom, onLocationSelect, selectedLocation }: LocationPickerProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onLocationSelect={onLocationSelect} />
      
      {selectedLocation && (
        <Marker position={selectedLocation}>
          <div className="text-center">
            <div className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
              Selected Location
            </div>
          </div>
        </Marker>
      )}
    </MapContainer>
  );
}

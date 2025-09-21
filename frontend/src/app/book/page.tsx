"use client";
import fcl from "@/lib/fcl";
import { useState, useEffect } from "react";
import StationSearch from "@/components/StationSearch";

type Station = {
  id: number;
  owner: string;
  location: string;
  chargerType: string;
  costPerKWh: string;
  available: boolean;
};

export default function BookPage() {
  const [user, setUser] = useState<any>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [amount, setAmount] = useState("10.0");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    chargerType: "all",
    maxPrice: 1.0,
    minRating: 0,
    availability: true,
    sortBy: "price"
  });

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    setLoading(true);
    try {
      const REG = process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer";
      const cadence = `
        import StationRegistry from ${REG}
        pub fun main(): [StationRegistry.Station] {
          return StationRegistry.getAllStations()
        }
      `;
      
      const data = await fcl.query({
        cadence,
        args: (arg: any, t: any) => []
      });
      
      const parsedStations: Station[] = (data || []).map((s: any) => ({
        id: Number(s.id),
        owner: s.owner,
        location: s.location,
        chargerType: s.chargerType,
        costPerKWh: String(s.costPerKWh),
        available: Boolean(s.available),
      }));
      setStations(parsedStations);
    } catch (error) {
      console.error('Error loading stations:', error);
      // Fallback demo data
      setStations([
        { id: 1, owner: "0x0", location: "18.5204,73.8567", chargerType: "AC", costPerKWh: "0.20", available: true },
        { id: 2, owner: "0x0", location: "19.0760,72.8777", chargerType: "DC", costPerKWh: "0.35", available: true },
        { id: 3, owner: "0x0", location: "28.6139,77.209", chargerType: "Type2", costPerKWh: "0.25", available: false },
        { id: 4, owner: "0x0", location: "12.9716,77.5946", chargerType: "CCS", costPerKWh: "0.30", available: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lockFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    
    setStatus("Locking funds...");
    try {
      const FT = process.env.NEXT_PUBLIC_FT_ADDRESS || "0x9a0766d93b6608b7";
      const ESCROW = process.env.NEXT_PUBLIC_BOOKING_ESCROW || "0xDeployer";
      const txId = await fcl.mutate({
        cadence: `
          import FungibleToken from ${FT}
          import BookingEscrow from ${ESCROW}
          transaction(stationId: UInt64, amount: UFix64) {
            prepare(acct: auth(BorrowValue) &Account) {
              let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/USDCVault)
                ?? panic("Missing USDC Vault")
              let temp <- vaultRef.withdraw(amount: amount)
              let _ = BookingEscrow.lockFunds(stationId: stationId, <- temp)
            }
          }
        `,
        args: (arg: any, t: any) => [arg(selectedStation.id, t.UInt64), arg(amount, t.UFix64)],
        limit: 200,
      });
      await fcl.tx(txId).onceSealed();
      setStatus("Funds locked successfully!");
      setShowBookingModal(false);
      setSelectedStation(null);
    } catch (e: any) {
      setStatus(e.message || "Failed to lock funds");
    }
  };

  const filteredStations = stations
    .filter(station => {
      const matchesSearch = station.location.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
                           station.chargerType.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
                           station.id.toString().includes(searchFilters.searchTerm);
      const matchesFilter = searchFilters.chargerType === "all" || station.chargerType === searchFilters.chargerType;
      const matchesPrice = parseFloat(station.costPerKWh) <= searchFilters.maxPrice;
      const matchesAvailability = !searchFilters.availability || station.available;
      return matchesSearch && matchesFilter && matchesPrice && matchesAvailability;
    })
    .sort((a, b) => {
      switch (searchFilters.sortBy) {
        case "price":
          return parseFloat(a.costPerKWh) - parseFloat(b.costPerKWh);
        case "price-desc":
          return parseFloat(b.costPerKWh) - parseFloat(a.costPerKWh);
        case "type":
          return a.chargerType.localeCompare(b.chargerType);
        case "location":
          return a.location.localeCompare(b.location);
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  const calculateEstimatedCost = (station: Station, amount: string) => {
    const costPerKWh = parseFloat(station.costPerKWh);
    const amountValue = parseFloat(amount);
    return (costPerKWh * amountValue).toFixed(2);
  };

  if (!user?.addr) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to book charging sessions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-indigo-100 text-emerald-700 text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Find and book charging stations
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 mb-4">
          Book a Charging Session
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover available charging stations near you and book secure charging sessions with instant payments
        </p>
      </div>

      {/* Search and Filters */}
      <StationSearch
        onFiltersChange={setSearchFilters}
        onSearch={() => {}} // Search happens automatically on filter change
        initialFilters={searchFilters}
      />

      {/* Stations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stations...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div key={station.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Station #{station.id}</h3>
                    <p className="text-sm text-gray-600">{station.chargerType}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">📍</span>
                  <span>{station.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold text-emerald-600">₹{station.costPerKWh}/kWh</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStation(station);
                  setShowBookingModal(true);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book This Station
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredStations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Station #{selectedStation.id}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-semibold">{selectedStation.chargerType}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">📍</span>
                  <span className="text-sm text-gray-600">{selectedStation.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold text-emerald-600">₹{selectedStation.costPerKWh}/kWh</span>
                </div>
              </div>

              <form onSubmit={lockFunds} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Cost:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{calculateEstimatedCost(selectedStation, amount)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    {status === "Locking funds..." ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="spinner"></div>
                        Locking...
                      </div>
                    ) : (
                      "Lock Funds & Book"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {status && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 border-l-4 border-emerald-500 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">{status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import fcl from "@/lib/fcl";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ReputationDisplay from "@/components/ReputationDisplay";

type Station = {
  id: number;
  owner: string;
  location: string;
  chargerType: string;
  costPerKWh: string;
  available: boolean;
};

type Booking = {
  id: number;
  stationId: number;
  driver: string;
  owner: string;
  amount: string;
  completed: boolean;
  driverRated: boolean;
  ownerRated: boolean;
};

type ReputationData = {
  totalRatings: number;
  averageRating: number;
  role: 'owner' | 'driver';
  recentRatings: Array<{
    rating: number;
    counterparty: string;
    stationId: number;
    timestamp: number;
  }>;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'bookings' | 'reputation'>('overview');
  const [stations, setStations] = useState<Station[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  useEffect(() => {
    if (user?.addr) {
      loadUserData();
    }
  }, [user?.addr]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStations(),
        loadBookings(),
        loadReputation()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStations = async () => {
    const REG = process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer";
    const cadence = `
      import StationRegistry from ${REG}
      pub fun main(owner: Address): [StationRegistry.Station] {
        return StationRegistry.getOwnerStations(owner: owner)
      }
    `;
    
    try {
      const data = await fcl.query({
        cadence,
        args: (arg: any, t: any) => [arg(user?.addr, t.Address)]
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
    }
  };

  const loadBookings = async () => {
    // This would require additional smart contract functions to query user's bookings
    // For now, we'll show a placeholder
    setBookings([]);
  };

  const loadReputation = async () => {
    // This would require querying the ReputationNFT contract
    // For now, we'll show placeholder data
    setReputation({
      totalRatings: 0,
      averageRating: 0,
      role: 'owner',
      recentRatings: []
    });
  };

  const toggleStationAvailability = async (stationId: number, currentStatus: boolean) => {
    try {
      const REG = process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer";
      const txId = await fcl.mutate({
        cadence: `
          import StationRegistry from ${REG}
          transaction(id: UInt64, available: Bool) {
            prepare(signer: auth(BorrowValue) &Account) {
              StationRegistry.updateAvailability(id: id, available: available)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(stationId, t.UInt64),
          arg(!currentStatus, t.Bool)
        ],
        limit: 100,
      });
      await fcl.tx(txId).onceSealed();
      loadStations(); // Refresh data
    } catch (error) {
      console.error('Error updating station availability:', error);
    }
  };

  if (!user?.addr) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to access your dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Manage your stations, bookings, and reputation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Stations</p>
              <p className="text-3xl font-bold">{stations.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔌</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold">{bookings.filter(b => !b.completed).length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">₹0</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Reputation</p>
              <p className="text-3xl font-bold">{reputation?.averageRating.toFixed(1) || '0.0'}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'stations', label: 'My Stations', icon: '🔌' },
          { id: 'bookings', label: 'Bookings', icon: '⚡' },
          { id: 'reputation', label: 'Reputation', icon: '⭐' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Overview</h2>
            
            {/* Analytics Dashboard */}
            <AnalyticsDashboard />
            
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/register" className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition-colors">
                    Register New Station
                  </a>
                  <a href="/book" className="block w-full px-4 py-3 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700 transition-colors">
                    Find Charging Stations
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Station Uptime</span>
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Rating</span>
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="text-sm font-medium">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Stations</h2>
              <a href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Add Station
              </a>
            </div>

            {stations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔌</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stations registered</h3>
                <p className="text-gray-600 mb-4">Start earning by registering your first charging station</p>
                <a href="/register" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Register Station
                </a>
              </div>
            ) : (
              <div className="grid gap-4">
                {stations.map((station) => (
                  <div key={station.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Station #{station.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            station.available 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {station.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Location:</span> {station.location}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {station.chargerType}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ₹{station.costPerKWh}/kWh
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStationAvailability(station.id, station.available)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            station.available
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          {station.available ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Your booking history will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'reputation' && (
          <ReputationDisplay />
        )}
      </div>
    </div>
  );
}

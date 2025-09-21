"use client";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

type ReputationData = {
  totalRatings: number;
  averageRating: number;
  role: 'owner' | 'driver';
  recentRatings: Array<{
    rating: number;
    counterparty: string;
    stationId: number;
    timestamp: number;
    role: string;
  }>;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export default function ReputationDisplay() {
  const [user, setUser] = useState<any>(null);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  useEffect(() => {
    if (user?.addr) {
      loadReputation();
    }
  }, [user?.addr]);

  const loadReputation = async () => {
    setLoading(true);
    try {
      // In a real app, this would query the ReputationNFT contract
      // For now, we'll show demo data
      const demoData: ReputationData = {
        totalRatings: 24,
        averageRating: 4.6,
        role: 'owner',
        recentRatings: [
          {
            rating: 5,
            counterparty: '0x1234...5678',
            stationId: 1,
            timestamp: Date.now() - 1000 * 60 * 30,
            role: 'driver'
          },
          {
            rating: 4,
            counterparty: '0x9876...5432',
            stationId: 2,
            timestamp: Date.now() - 1000 * 60 * 60 * 2,
            role: 'driver'
          },
          {
            rating: 5,
            counterparty: '0xabcd...efgh',
            stationId: 1,
            timestamp: Date.now() - 1000 * 60 * 60 * 24,
            role: 'driver'
          }
        ],
        ratingDistribution: {
          5: 18,
          4: 4,
          3: 2,
          2: 0,
          1: 0
        }
      };
      setReputation(demoData);
    } catch (error) {
      console.error('Error loading reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const getRoleIcon = (role: string) => {
    return role === 'owner' ? '🏠' : '🚗';
  };

  const getRoleColor = (role: string) => {
    return role === 'owner' ? 'text-indigo-600' : 'text-emerald-600';
  };

  if (!user?.addr) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!reputation) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reputation & Ratings</h2>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getRoleIcon(reputation.role)}</span>
          <span className={`font-medium ${getRoleColor(reputation.role)}`}>
            {reputation.role === 'owner' ? 'Station Owner' : 'EV Driver'}
          </span>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl font-bold text-amber-600 mb-2">
            {reputation.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {getRatingStars(Math.floor(reputation.averageRating))}
          </div>
          <p className="text-gray-600">
            Based on {reputation.totalRatings} rating{reputation.totalRatings !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reputation.ratingDistribution[rating as keyof typeof reputation.ratingDistribution];
              const percentage = (count / reputation.totalRatings) * 100;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ratings</h3>
          <div className="space-y-4">
            {reputation.recentRatings.map((rating, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-1">
                  {getRatingStars(rating.rating)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    From {rating.counterparty.slice(0, 6)}...{rating.counterparty.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Station #{rating.stationId} • {formatTimestamp(rating.timestamp)}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {getRoleIcon(rating.role)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reputation Benefits */}
      <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reputation Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-medium text-gray-900 mb-1">Premium Status</h4>
            <p className="text-sm text-gray-600">Higher visibility in search results</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-medium text-gray-900 mb-1">Better Rates</h4>
            <p className="text-sm text-gray-600">Access to premium pricing tiers</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-medium text-gray-900 mb-1">Priority Support</h4>
            <p className="text-sm text-gray-600">Faster response times</p>
          </div>
        </div>
      </div>

      {/* Reputation Tips */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips to Improve Your Reputation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">For Station Owners</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Keep your station clean and well-maintained</li>
              <li>• Respond quickly to booking requests</li>
              <li>• Provide accurate location information</li>
              <li>• Set competitive pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">For EV Drivers</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Arrive on time for your bookings</li>
              <li>• Follow station rules and guidelines</li>
              <li>• Leave the area clean after charging</li>
              <li>• Communicate clearly with station owners</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

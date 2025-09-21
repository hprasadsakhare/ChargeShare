"use client";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

type AnalyticsData = {
  totalEarnings: number;
  totalSessions: number;
  averageRating: number;
  monthlyEarnings: Array<{ month: string; amount: number }>;
  popularStations: Array<{ id: number; sessions: number; earnings: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    amount?: number;
    timestamp: number;
  }>;
};

export default function AnalyticsDashboard() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  useEffect(() => {
    if (user?.addr) {
      loadAnalytics();
    }
  }, [user?.addr, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your backend or smart contract
      // For now, we'll show demo data
      const demoData: AnalyticsData = {
        totalEarnings: 2450.75,
        totalSessions: 127,
        averageRating: 4.8,
        monthlyEarnings: [
          { month: 'Jan', amount: 320.50 },
          { month: 'Feb', amount: 450.25 },
          { month: 'Mar', amount: 380.75 },
          { month: 'Apr', amount: 520.00 },
          { month: 'May', amount: 480.25 },
          { month: 'Jun', amount: 299.00 }
        ],
        popularStations: [
          { id: 1, sessions: 45, earnings: 890.50 },
          { id: 2, sessions: 32, earnings: 640.25 },
          { id: 3, sessions: 28, earnings: 560.75 },
          { id: 4, sessions: 22, earnings: 359.25 }
        ],
        recentActivity: [
          {
            type: 'earning',
            description: 'Payment received from Station #1',
            amount: 25.50,
            timestamp: Date.now() - 1000 * 60 * 30
          },
          {
            type: 'booking',
            description: 'New booking for Station #2',
            timestamp: Date.now() - 1000 * 60 * 60 * 2
          },
          {
            type: 'rating',
            description: 'Received 5-star rating',
            timestamp: Date.now() - 1000 * 60 * 60 * 4
          },
          {
            type: 'earning',
            description: 'Payment received from Station #3',
            amount: 18.75,
            timestamp: Date.now() - 1000 * 60 * 60 * 6
          }
        ]
      };
      setAnalytics(demoData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  if (!user?.addr) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">{formatCurrency(analytics.totalEarnings)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Sessions</p>
              <p className="text-3xl font-bold">{analytics.totalSessions}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Average Rating</p>
              <p className="text-3xl font-bold">{analytics.averageRating}/5</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.monthlyEarnings.map((item, index) => {
              const maxAmount = Math.max(...analytics.monthlyEarnings.map(m => m.amount));
              const height = (item.amount / maxAmount) * 200;
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg w-full transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                    style={{ height: `${height}px` }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                  <div className="text-xs font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Stations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Stations</h3>
          <div className="space-y-4">
            {analytics.popularStations.map((station, index) => (
              <div key={station.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Station #{station.id}</p>
                    <p className="text-sm text-gray-600">{station.sessions} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{formatCurrency(station.earnings)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'earning' ? 'bg-emerald-100' :
                activity.type === 'booking' ? 'bg-indigo-100' :
                activity.type === 'rating' ? 'bg-amber-100' : 'bg-gray-100'
              }`}>
                <span className="text-lg">
                  {activity.type === 'earning' ? '💰' :
                   activity.type === 'booking' ? '⚡' :
                   activity.type === 'rating' ? '⭐' : '📢'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-600">{formatTimestamp(activity.timestamp)}</p>
              </div>
              {activity.amount && (
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">+{formatCurrency(activity.amount)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import MapView from "@/components/MapView";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center gap-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-indigo-100 text-emerald-700 text-sm font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Live on Flow Blockchain
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 leading-tight">
          The Future of EV Charging is Here
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          Join the decentralized revolution. Find affordable charging nearby, or rent out your own station and earn instantly. 
          Built on Flow blockchain for secure, transparent, and sustainable mobility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a className="px-8 py-4 rounded-xl border-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl" href="/register">
            Register Station
          </a>
          <a className="px-8 py-4 rounded-xl border-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl" href="/book">
            Book Station
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Powering the EV Revolution</h2>
            <p className="text-gray-600">Join thousands of users already using ChargeShare</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1,247</div>
              <div className="text-sm text-gray-600">Active Stations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">15,892</div>
              <div className="text-sm text-gray-600">Successful Charges</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">₹2.4M</div>
              <div className="text-sm text-gray-600">Total Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Charging Stations Near You</h2>
          <p className="text-gray-600">Explore our network of peer-to-peer charging stations across India</p>
        </div>
        <MapView />
      </div>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">Simple, secure, and sustainable - in just 3 steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="rounded-3xl p-8 border-2 border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50 to-white hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🔌</div>
              <div className="text-2xl font-bold text-indigo-600 mb-3">1. List Your Station</div>
              <div className="text-gray-700 leading-relaxed">
                Connect your Flow wallet and register your charger. Set competitive pricing per kWh and manage availability. 
                Your station becomes part of the decentralized network instantly.
              </div>
            </div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">→</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl p-8 border-2 border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50 to-white hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🚗</div>
              <div className="text-2xl font-bold text-emerald-600 mb-3">2. Book & Charge</div>
              <div className="text-gray-700 leading-relaxed">
                EV drivers discover stations nearby using our interactive map. Payment is secured in smart contract escrow, 
                and charging begins with complete transparency and security.
              </div>
            </div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">→</div>
            </div>
          </div>
          
          <div>
            <div className="rounded-3xl p-8 border-2 border-pink-100 shadow-lg bg-gradient-to-br from-pink-50 to-white hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">💸</div>
              <div className="text-2xl font-bold text-pink-600 mb-3">3. Earn & Build Reputation</div>
              <div className="text-gray-700 leading-relaxed">
                Once charging completes, funds are released instantly to your wallet. Both drivers and hosts earn 
                reputation NFTs that unlock premium features and better rates.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-3xl p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ChargeShare?</h2>
            <p className="text-lg text-gray-600">Built for the future of sustainable transportation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Security</h3>
              <p className="text-gray-600">Smart contracts ensure secure payments and transparent transactions on Flow blockchain.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Payments</h3>
              <p className="text-gray-600">No waiting periods. Get paid immediately when charging sessions complete.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Future</h3>
              <p className="text-gray-600">Support the green revolution by making EV charging accessible and affordable for everyone.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reputation System</h3>
              <p className="text-gray-600">Build trust through our NFT-based reputation system that rewards quality service.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface with real-time map integration makes finding and booking stations effortless.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Rates</h3>
              <p className="text-gray-600">Set your own pricing and earn more than traditional charging networks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 rounded-3xl p-12 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Join the EV Revolution?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start earning from your charging station today or find affordable charging near you. 
            The future of sustainable transportation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg" href="/register">
              Start Earning Now
            </a>
            <a className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200" href="/book">
              Find Charging Stations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

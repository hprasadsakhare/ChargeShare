"use client";
import MapView from "@/components/MapView";
import AnimatedCounter from "@/components/AnimatedCounter";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import StatsCard from "@/components/StatsCard";
import PricingCard from "@/components/PricingCard";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="relative flex flex-col items-center justify-center text-center gap-6 py-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-indigo-100 text-emerald-700 text-sm font-medium animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live on Flow Blockchain
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 leading-tight animate-slide-up">
            The Future of EV Charging is Here
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Join the decentralized revolution. Find affordable charging nearby, or rent out your own station and earn instantly. 
            Built on Flow blockchain for secure, transparent, and sustainable mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <a className="px-8 py-4 rounded-xl border-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover-lift btn-primary" href="/register">
              Register Station
            </a>
            <a className="px-8 py-4 rounded-xl border-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover-lift btn-primary" href="/book">
              Book Station
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Powering the EV Revolution</h2>
            <p className="text-gray-600">Join thousands of users already using ChargeShare</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard 
              value={1247} 
              label="Active Stations" 
              gradient="text-indigo-600" 
              delay={0}
            />
            <StatsCard 
              value={15892} 
              label="Successful Charges" 
              gradient="text-emerald-600" 
              delay={200}
            />
            <StatsCard 
              value={2.4} 
              label="Total Savings (M)" 
              prefix="₹" 
              gradient="text-pink-600" 
              delay={400}
            />
            <StatsCard 
              value={4.9} 
              label="User Rating" 
              suffix="★" 
              gradient="text-amber-600" 
              delay={600}
            />
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
            <FeatureCard
              icon="🔒"
              title="Blockchain Security"
              description="Smart contracts ensure secure payments and transparent transactions on Flow blockchain."
              gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
              delay={0}
            />
            <FeatureCard
              icon="⚡"
              title="Instant Payments"
              description="No waiting periods. Get paid immediately when charging sessions complete."
              gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
              delay={100}
            />
            <FeatureCard
              icon="🌱"
              title="Sustainable Future"
              description="Support the green revolution by making EV charging accessible and affordable for everyone."
              gradient="bg-gradient-to-r from-pink-500 to-pink-600"
              delay={200}
            />
            <FeatureCard
              icon="🏆"
              title="Reputation System"
              description="Build trust through our NFT-based reputation system that rewards quality service."
              gradient="bg-gradient-to-r from-amber-500 to-amber-600"
              delay={300}
            />
            <FeatureCard
              icon="📱"
              title="Easy to Use"
              description="Intuitive interface with real-time map integration makes finding and booking stations effortless."
              gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
              delay={400}
            />
            <FeatureCard
              icon="💰"
              title="Competitive Rates"
              description="Set your own pricing and earn more than traditional charging networks."
              gradient="bg-gradient-to-r from-purple-500 to-purple-600"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">Real stories from the ChargeShare community</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Priya Sharma"
            role="EV Owner, Mumbai"
            content="ChargeShare has revolutionized my daily commute. I can find affordable charging stations anywhere in the city, and the payments are instant and secure."
            avatar="P"
            rating={5}
            delay={0}
          />
          <TestimonialCard
            name="Rajesh Kumar"
            role="Station Owner, Delhi"
            content="I've been earning ₹15,000+ monthly by sharing my home charger. The smart contracts handle everything automatically - no hassle, just profit!"
            avatar="R"
            rating={5}
            delay={200}
          />
          <TestimonialCard
            name="Anita Patel"
            role="Fleet Manager, Bangalore"
            content="The reputation system is brilliant. We only book stations with high ratings, ensuring reliable charging for our entire fleet."
            avatar="A"
            rating={5}
            delay={400}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that works best for you</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Station Owner"
            price="5%"
            period="per transaction"
            features={[
              "List unlimited stations",
              "Set your own pricing",
              "Instant payments",
              "Reputation building",
              "24/7 support"
            ]}
            gradient="text-indigo-600"
            delay={0}
          />
          <PricingCard
            title="EV Driver"
            price="Free"
            period="forever"
            features={[
              "Find nearby stations",
              "Secure payments",
              "Real-time availability",
              "Rating system",
              "Mobile app access"
            ]}
            gradient="text-emerald-600"
            isPopular={true}
            delay={200}
          />
          <PricingCard
            title="Fleet Manager"
            price="2%"
            period="per transaction"
            features={[
              "Bulk booking discounts",
              "Fleet management tools",
              "Priority support",
              "Custom reporting",
              "API access"
            ]}
            gradient="text-purple-600"
            delay={400}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 rounded-3xl p-12 text-center text-white animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Join the EV Revolution?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start earning from your charging station today or find affordable charging near you. 
            The future of sustainable transportation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg hover-lift" href="/register">
              Start Earning Now
            </a>
            <a className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200 hover-lift" href="/book">
              Find Charging Stations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

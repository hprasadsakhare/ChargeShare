"use client";
import fcl from "@/lib/fcl";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function RegisterPage() {
  const [location, setLocation] = useState("");
  const [chargerType, setChargerType] = useState("AC");
  const [price, setPrice] = useState("0.20");
  const [available, setAvailable] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 73.8567]); // Default to Pune
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Validation functions
  const validateLocation = (loc: string) => {
    const coordRegex = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    if (!loc.trim()) return "Location is required";
    if (!coordRegex.test(loc.trim())) return "Please enter valid coordinates (lat,lng)";
    const [lat, lng] = loc.split(',').map(Number);
    if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
    if (lng < -180 || lng > 180) return "Longitude must be between -180 and 180";
    return "";
  };

  const validatePrice = (priceStr: string) => {
    const price = parseFloat(priceStr);
    if (isNaN(price)) return "Please enter a valid number";
    if (price < 0) return "Price cannot be negative";
    if (price > 10) return "Price seems too high (max 10 FLOW per kWh)";
    if (!/^\d+\.?\d*$/.test(priceStr)) return "Please use decimal format (e.g., 0.20)";
    return "";
  };

  // Real-time validation
  useEffect(() => {
    const errors: {[key: string]: string} = {};
    
    if (location) {
      const locationError = validateLocation(location);
      if (locationError) errors.location = locationError;
    }
    
    if (price) {
      const priceError = validatePrice(price);
      if (priceError) errors.price = priceError;
    }
    
    setFormErrors(errors);
  }, [location, price]);

  // Calculate estimated earnings
  useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const dailyUsage = 8; // hours per day
    const efficiency = 0.8; // 80% efficiency
    const dailyEarnings = priceNum * dailyUsage * efficiency;
    setEstimatedEarnings(dailyEarnings);
  }, [price, available]);

  // Auto-save form data
  useEffect(() => {
    const formData = { location, chargerType, price, available };
    localStorage.setItem('chargerRegistration', JSON.stringify(formData));
  }, [location, chargerType, price, available]);

  // Load saved form data
  useEffect(() => {
    const saved = localStorage.getItem('chargerRegistration');
    if (saved) {
      try {
        const formData = JSON.parse(saved);
        setLocation(formData.location || "");
        setChargerType(formData.chargerType || "AC");
        setPrice(formData.price || "0.20");
        setAvailable(formData.available !== undefined ? formData.available : true);
        
        // Set map center if location exists
        if (formData.location) {
          const [lat, lng] = formData.location.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter([lat, lng]);
            setSelectedLocation([lat, lng]);
          }
        }
      } catch {
        console.log("No saved form data");
      }
    }
  }, []);

  // Handle map click to select location
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setLocation(`${lat.toFixed(4)},${lng.toFixed(4)}`);
    setMapCenter([lat, lng]);
    setCurrentStep(1);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setSelectedLocation([latitude, longitude]);
          setLocation(`${latitude.toFixed(4)},${longitude.toFixed(4)}`);
          setCurrentStep(1);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    
    // Validate all fields
    const locationError = validateLocation(location);
    const priceError = validatePrice(price);
    
    if (locationError || priceError) {
      setFormErrors({
        location: locationError,
        price: priceError
      });
      setIsValidating(false);
      return;
    }
    
    setStatus("Submitting...");
    try {
      const txId = await fcl.mutate({
        cadence: `
          import StationRegistry from ${process.env.NEXT_PUBLIC_STATION_REGISTRY || "0xDeployer"}
          transaction(location: String, chargerType: String, price: UFix64, available: Bool) {
            prepare(signer: auth(BorrowValue) &Account) {
              let _ = StationRegistry.registerStation(location: location, chargerType: chargerType, costPerKWh: price, available: available)
            }
          }
        `,
        args: (arg: (value: unknown, type: unknown) => unknown, t: unknown) => [
          arg(location, t),
          arg(chargerType, t),
          arg(price, t),
          arg(available, t),
        ],
        limit: 100,
      });
      await fcl.tx(txId).onceSealed();
      setStatus("Registered!");
      setShowSuccess(true);
      // Clear saved form data on success
      localStorage.removeItem('chargerRegistration');
      // Reset form after success animation
      setTimeout(() => {
        setLocation("");
        setPrice("0.20");
        setChargerType("AC");
        setAvailable(true);
        setShowSuccess(false);
        setStatus("");
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed";
      setStatus(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-emerald-100 text-indigo-700 text-sm font-medium">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Earn by sharing your charger
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-emerald-600 to-pink-600 animate-slide-up">
            Register Your Charging Station
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>List your charger with pricing and availability. Drivers can find and book instantly—payments are secured by smart contracts.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white animate-bounce-in' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {currentStep === 1 && "Enter station details"}
            {currentStep === 2 && "Set pricing & availability"}
            {currentStep === 3 && "Review & submit"}
          </div>
        </div>

        {/* Card */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50 to-white hover-lift card-hover animate-slide-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xl animate-float">🔌</div>
                <h2 className="text-xl font-bold text-indigo-700">Station Details</h2>
                {isValidating && (
                  <div className="ml-auto">
                    <div className="spinner w-5 h-5"></div>
                  </div>
                )}
              </div>
              <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (lat,lng) 
                    {location && !formErrors.location && (
                      <span className="ml-2 text-green-500 text-xs">✓ Valid</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                            formErrors.location 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : location && !formErrors.location
                              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="e.g. 18.5204,73.8567"
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            setCurrentStep(1);
                          }}
                          onFocus={() => setCurrentStep(1)}
                          required
                        />
                        {location && !formErrors.location && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                            ✓
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95"
                      >
                        {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
                      </button>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95 animate-pulse-scale"
                        title="Use current location"
                      >
                        📍
                      </button>
                    </div>
                    
                    {showMap && (
                      <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 animate-slide-up">
                        <LocationPicker
                          center={mapCenter}
                          zoom={13}
                          onLocationSelect={handleMapClick}
                          selectedLocation={selectedLocation}
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-sm z-10">
                          Click on the map to select location
                        </div>
                      </div>
                    )}
                  </div>
                  {formErrors.location ? (
                    <p className="text-xs text-red-500 mt-1 animate-slide-up">{formErrors.location}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Enter coordinates manually or use the map to select your location.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Charger Type</label>
                  <select
                    className="w-full border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 hover:shadow-md focus:shadow-lg"
                    value={chargerType}
                    onChange={(e) => {
                      setChargerType(e.target.value);
                      setCurrentStep(2);
                    }}
                    onFocus={() => setCurrentStep(2)}
                  >
                    <option value="AC">AC (Slow Charging)</option>
                    <option value="DC">DC (Fast Charging)</option>
                    <option value="Type2">Type 2 (European Standard)</option>
                    <option value="CCS">CCS (Combined Charging)</option>
                    <option value="CHAdeMO">CHAdeMO (Japanese Standard)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per kWh (FLOW) 
                    {price && !formErrors.price && (
                      <span className="ml-2 text-green-500 text-xs">✓ Valid</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                        formErrors.price 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : price && !formErrors.price
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="e.g. 0.20"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setCurrentStep(2);
                      }}
                      onFocus={() => setCurrentStep(2)}
                      required
                    />
                    {price && !formErrors.price && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                  {formErrors.price ? (
                    <p className="text-xs text-red-500 mt-1 animate-slide-up">{formErrors.price}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Use decimal format (e.g., 0.2, 1.5). Max 10 FLOW per kWh.</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={available} 
                        onChange={(e) => {
                          setAvailable(e.target.checked);
                          setCurrentStep(3);
                        }}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        available 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500' 
                          : 'bg-white border-gray-300 group-hover:border-indigo-400'
                      }`}>
                        {available && <span className="text-white text-sm">✓</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Available for booking</span>
                      <p className="text-xs text-gray-500">Enable this to start receiving booking requests</p>
                    </div>
                  </label>
                </div>

                {/* Earnings Calculator */}
                {price && !formErrors.price && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200 animate-slide-up">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-600">💰</span>
                      <span className="text-sm font-medium text-emerald-700">Estimated Daily Earnings</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {estimatedEarnings.toFixed(2)} FLOW
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      Based on 8 hours daily usage at {price} FLOW/kWh
                    </p>
                  </div>
                )}

                <button
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg btn-primary hover-lift ${
                    Object.keys(formErrors).length > 0 || !location || !price
                      ? 'opacity-50 cursor-not-allowed'
                      : 'animate-glow'
                  }`}
                  type="submit"
                  disabled={Object.keys(formErrors).length > 0 || !location || !price || isValidating}
                  onClick={() => setCurrentStep(3)}
                >
                  {status === "Submitting..." ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="spinner"></div>
                      Submitting...
                    </div>
                  ) : status === "Registered!" ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>🎉</span>
                      Registered!
                    </div>
                  ) : (
                    "Register Station"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50 to-white hover-lift card-hover animate-slide-right">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-xl animate-float" style={{animationDelay: '1s'}}>📍</div>
                  <h3 className="text-lg font-bold text-emerald-700">Tips for Better Visibility</h3>
                </div>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  {showTips ? '−' : '+'}
                </button>
              </div>
              
              <div className={`transition-all duration-300 ${showTips ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <ul className="list-none text-sm text-gray-700 space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-200">
                    <span className="text-emerald-500 mt-0.5">🎯</span>
                    <div>
                      <strong>Accurate Location:</strong> Use precise coordinates to help drivers find your charger easily.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-200">
                    <span className="text-emerald-500 mt-0.5">💰</span>
                    <div>
                      <strong>Competitive Pricing:</strong> Research local rates to set attractive prices.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-200">
                    <span className="text-emerald-500 mt-0.5">⏰</span>
                    <div>
                      <strong>Keep Updated:</strong> Maintain availability status for maximum bookings.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-200">
                    <span className="text-emerald-500 mt-0.5">🔌</span>
                    <div>
                      <strong>Charger Type:</strong> Choose the right connector type for your area&apos;s vehicles.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 rounded-xl bg-white/70 border p-4 text-sm text-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-600">📍</span>
                  <span className="font-medium">Quick Location Examples:</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-mono">18.5204,73.8567</span>
                    <span className="text-emerald-600">Pune</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">19.0760,72.8777</span>
                    <span className="text-emerald-600">Mumbai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">12.9716,77.5946</span>
                    <span className="text-emerald-600">Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounce-in">
              <div className="text-6xl mb-4 animate-star-twinkle">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Station Registered!</h3>
              <p className="text-gray-600 mb-4">Your charging station is now live and ready to accept bookings.</p>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-sm text-emerald-700">
                  <strong>Next Steps:</strong> Check your dashboard to manage bookings and earnings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Banner */}
        {status && !showSuccess && (
          <div className="mt-8 animate-slide-up">
            <div className={`rounded-2xl p-4 text-center border transition-all duration-300 ${
              status === "Registered!" 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : status === "Submitting..."
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {status === "Submitting..." && <div className="spinner w-4 h-4"></div>}
                {status === "Registered!" && <span className="text-green-500">✓</span>}
                {status.includes("Failed") && <span className="text-red-500">✗</span>}
                <span className={`text-sm font-medium ${
                  status === "Registered!" ? 'text-green-700' : 
                  status === "Submitting..." ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



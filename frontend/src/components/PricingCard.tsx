"use client";
import { useState } from "react";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  gradient: string;
  isPopular?: boolean;
  delay?: number;
}

export default function PricingCard({ 
  title, 
  price, 
  period, 
  features, 
  gradient, 
  isPopular = false,
  delay = 0 
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative rounded-3xl p-8 border-2 shadow-lg hover-lift card-hover animate-slide-up ${
        isPopular 
          ? 'border-indigo-500 scale-105' 
          : 'border-gray-200'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className={`text-4xl font-bold ${gradient} mb-1`}>
          {price}
        </div>
        <p className="text-gray-600">{period}</p>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          isPopular
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
            : 'border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
        }`}
      >
        {isPopular ? 'Get Started' : 'Choose Plan'}
      </button>
    </div>
  );
}

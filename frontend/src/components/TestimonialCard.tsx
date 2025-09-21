"use client";
import { useState } from "react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  delay?: number;
}

export default function TestimonialCard({ 
  name, 
  role, 
  content, 
  avatar, 
  rating, 
  delay = 0 
}: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`testimonial-card relative bg-white rounded-3xl p-8 shadow-xl hover-lift card-hover animate-slide-up overflow-hidden group`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-emerald-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float transition-all duration-500"></div>
        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float transition-all duration-700" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 right-8 w-1 h-1 bg-pink-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float transition-all duration-600" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Quote icon */}
      <div className="absolute top-4 left-4 text-indigo-200 text-4xl opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110">
        "
      </div>

      <div className="relative z-10">
        {/* Header with avatar and info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${isHovered ? 'animate-pulse' : ''}`}>
              {avatar}
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="ml-4 flex-1">
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors duration-300">{name}</h4>
            <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors duration-300">{role}</p>
          </div>
          
          {/* Interactive rating */}
          <div className="flex space-x-1 testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`text-xl transition-all duration-300 ${
                  i < rating 
                    ? 'text-yellow-400 group-hover:text-yellow-500 group-hover:scale-125 group-hover:drop-shadow-lg' 
                    : 'text-gray-300'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial content */}
        <div className="relative">
          <p className="text-gray-700 text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
            "{content}"
          </p>
          
          {/* Animated underline */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Bottom accent */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors duration-300">
            Verified User
          </div>
        </div>
      </div>
    </div>
  );
}

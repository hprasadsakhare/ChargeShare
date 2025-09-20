"use client";
import { useState } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient, 
  delay = 0 
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`text-center p-6 card-hover hover-lift animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
          isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
        }`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

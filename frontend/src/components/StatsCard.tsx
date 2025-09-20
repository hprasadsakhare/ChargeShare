"use client";
import AnimatedCounter from "./AnimatedCounter";

interface StatsCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  gradient: string;
  delay?: number;
}

export default function StatsCard({ 
  value, 
  label, 
  prefix = "", 
  suffix = "", 
  gradient, 
  delay = 0 
}: StatsCardProps) {
  return (
    <div 
      className="text-center animate-fade-in hover-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`text-4xl font-bold ${gradient} mb-2`}>
        <AnimatedCounter 
          end={value} 
          prefix={prefix} 
          suffix={suffix}
          duration={2000}
        />
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

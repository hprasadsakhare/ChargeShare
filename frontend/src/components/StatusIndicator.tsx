"use client";
import { useState, useEffect } from "react";

type StatusIndicatorProps = {
  status: 'online' | 'offline' | 'connecting' | 'error';
  message?: string;
  showPulse?: boolean;
};

export default function StatusIndicator({ status, message, showPulse = true }: StatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show status indicator after a short delay to avoid flash
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          icon: '🟢',
          label: 'Connected',
          message: message || 'Blockchain connection active'
        };
      case 'offline':
        return {
          color: 'bg-gray-400',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: '⚫',
          label: 'Offline',
          message: message || 'No blockchain connection'
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          icon: '🟡',
          label: 'Connecting',
          message: message || 'Establishing connection...'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: '🔴',
          label: 'Error',
          message: message || 'Connection failed'
        };
      default:
        return {
          color: 'bg-gray-400',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: '⚫',
          label: 'Unknown',
          message: 'Unknown status'
        };
    }
  };

  const config = getStatusConfig();

  if (!isVisible) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium transition-all duration-300`}>
      <div className={`w-2 h-2 rounded-full ${config.color} ${showPulse && status === 'online' ? 'animate-pulse' : ''}`}></div>
      <span className="text-xs">{config.icon}</span>
      <span>{config.label}</span>
      {message && (
        <span className="text-xs opacity-75">• {config.message}</span>
      )}
    </div>
  );
}

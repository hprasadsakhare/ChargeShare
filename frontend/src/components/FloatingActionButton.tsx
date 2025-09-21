"use client";
import { useState } from "react";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: "Find Stations",
      icon: "🔍",
      href: "/book",
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      label: "Register Station",
      icon: "🔌",
      href: "/register",
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      label: "Dashboard",
      icon: "📊",
      href: "/dashboard",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <a
            key={action.label}
            href={action.href}
            className={`${action.color} text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3 min-w-[140px]`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </a>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform ${
          isOpen ? 'rotate-45 bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600'
        }`}
      >
        <span className="text-white text-2xl">
          {isOpen ? '×' : '⚡'}
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

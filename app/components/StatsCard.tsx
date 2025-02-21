import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow" | "indigo" | "purple" | "pink"; // Add more colors if needed
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  // Map the color prop to Tailwind CSS classes
  const bgColorClass = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    red: "bg-red-100",
    yellow: "bg-yellow-100",
    indigo: "bg-indigo-100",
    purple: "bg-purple-100",
    pink: "bg-pink-100",
  }[color];

  const textColorClass = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    indigo: "text-indigo-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
  }[color];

  return (
    <div className={`${bgColorClass} p-4 rounded-lg shadow-md flex items-center space-x-4`}>
      <div className={`${textColorClass} text-4xl`}>{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
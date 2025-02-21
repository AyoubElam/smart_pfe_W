"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import StatsCard from "../StatsCard";
import { Group, Folder, CheckCircle } from "@mui/icons-material";

const data = [
  { name: "Jan", users: 2000, income: 2400 },
  { name: "Feb", users: 3000, income: 2200 },
  { name: "Mar", users: 5000, income: 2600 },
];

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="w-full">
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-4">📊 Statistiques</h2>

          {/* Cartes des statistiques */}
          <div className="grid grid-cols-3 gap-6">
            <StatsCard title="Total Étudiants" value="250" icon={<Group />} color="blue" />
            <StatsCard title="Projets en cours" value="35" icon={<Folder />} color="green" />
            <StatsCard title="Projets validés" value="120" icon={<CheckCircle />} color="yellow" />
          </div>

          {/* Graphique */}
          <div className="bg-white p-5 rounded-lg shadow-md mt-5">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
                <Line type="monotone" dataKey="income" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

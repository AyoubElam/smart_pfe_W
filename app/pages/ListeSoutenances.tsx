/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Filters from "../components/ListeSoutenances/Filters";
import SoutenanceTable from "../components/ListeSoutenances/SoutenanceTable";

interface Soutenance {
  id: number;
  date: string;
  time: string;
  location: string;
  groupe: string;
  juryNames: string | string[];
  status: string;
}

export default function ListeSoutenances() {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use `useEffect` to fetch data after the initial render
  useEffect(() => {
    const fetchSoutenances = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/soutenance");
        if (!response.ok) {
          throw new Error("Failed to fetch soutenances");
        }
        const data = await response.json();
        setSoutenances(data);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      } 
    };

    fetchSoutenances();
  }, []); // Empty dependency array to run this only on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const handleFilter = (filters: any) => {
    // Implement filtering logic here based on filters
    console.log("Filters applied: ", filters);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">📋 Liste des Soutenances</h1>
      <Filters onFilter={handleFilter} />
      <SoutenanceTable soutenances={soutenances} />
    </div>
  );
}

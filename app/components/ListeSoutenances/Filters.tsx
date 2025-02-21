/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

interface FiltersProps {
  onFilter: (filters: { date?: string; group?: string; status?: string }) => void;
}

const Filters = ({ onFilter }: FiltersProps) => {
  const [filters, setFilters] = useState({
    date: "",
    group: "",
    status: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    onFilter(filteredData);
  };

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleFilterChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="group"
        placeholder="Groupe"
        value={filters.group}
        onChange={handleFilterChange}
        className="p-2 border rounded"
      />
      <select
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
        className="p-2 border rounded"
      >
        <option value="">Tous les statuts</option>
        <option value="Scheduled">Scheduled</option>
        <option value="En cours">En cours</option>
        <option value="Terminée">Terminée</option>
      </select>
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Appliquer
      </button>
    </div>
  );
};

export default Filters;

"use client";

import { useState } from "react";

interface AddJuryFormProps {
  onAdd: (name: string) => void;
}

export default function AddJuryForm({ onAdd }: AddJuryFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Ajouter un nouveau jury"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}
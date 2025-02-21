"use client";

import { useState } from "react";

interface EditJuryFormProps {
  initialName: string;
  onSave: (updatedName: string) => void;
  onCancel: () => void;
}

export default function EditJuryForm({ initialName, onSave, onCancel }: EditJuryFormProps) {
  const [name, setName] = useState(initialName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
    }
  };

  return (
    <div className="flex gap-4 w-full">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enregistrer
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Annuler
      </button>
    </div>
  );
}
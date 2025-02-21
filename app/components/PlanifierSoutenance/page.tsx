 
"use client";

import { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPlus, FaEdit } from "react-icons/fa";

export default function SoutenancePageContent() {
  const [soutenances, setSoutenances] = useState<
    { id: number; date: string; time: string; location: string; jury: string[]; group: string }[]
  >([]);
  const [newSoutenance, setNewSoutenance] = useState({
    date: "",
    time: "",
    location: "",
    jury: [""],
    group: "", // Select group from a list
  });
  const [jurys, setJurys] = useState<string[]>(["Prof. Ahmed", "Prof. Fatima", "Prof. Karim"]);
  
  // Predefined list of groups
  const groups = ["Groupe 1", "Groupe 2", "Groupe 3", "Groupe 4", "Groupe 5"];

  const addSoutenance = () => {
    if (
      newSoutenance.date &&
      newSoutenance.time &&
      newSoutenance.location &&
      newSoutenance.jury[0] &&
      newSoutenance.group
    ) {
      setSoutenances([
        ...soutenances,
        {
          id: soutenances.length + 1,
          date: newSoutenance.date,
          time: newSoutenance.time,
          location: newSoutenance.location,
          jury: newSoutenance.jury,
          group: newSoutenance.group, // Store selected group
        },
      ]);
      setNewSoutenance({ date: "", time: "", location: "", jury: [""], group: "" });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">📅 Planification des Soutenances</h1>

      {/* Soutenance Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">📝 Définir une nouvelle soutenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Selection */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaUser className="text-gray-600" />
            <select
              value={newSoutenance.group}
              onChange={(e) => setNewSoutenance({ ...newSoutenance, group: e.target.value })}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un groupe</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          {/* Date Input */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaCalendarAlt className="text-gray-600" />
            <input
              type="date"
              value={newSoutenance.date}
              onChange={(e) => setNewSoutenance({ ...newSoutenance, date: e.target.value })}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Time Input */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaClock className="text-gray-600" />
            <input
              type="time"
              value={newSoutenance.time}
              onChange={(e) => setNewSoutenance({ ...newSoutenance, time: e.target.value })}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Location Input */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaMapMarkerAlt className="text-gray-600" />
            <input
              type="text"
              placeholder="Lieu"
              value={newSoutenance.location}
              onChange={(e) => setNewSoutenance({ ...newSoutenance, location: e.target.value })}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Jury Selection */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaUser className="text-gray-600" />
            <select
              value={newSoutenance.jury[0]}
              onChange={(e) => setNewSoutenance({ ...newSoutenance, jury: [e.target.value] })}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un jury</option>
              {jurys.map((jury, index) => (
                <option key={index} value={jury}>
                  {jury}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={addSoutenance}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 w-full"
        >
          <FaPlus /> Ajouter une Soutenance
        </button>
      </div>

      {/* Liste des soutenances */}
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">📌 Liste des Soutenances</h2>
        <div className="space-y-4">
          {soutenances.length > 0 ? (
            soutenances.map((soutenance) => (
              <div key={soutenance.id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-600 font-semibold">📆 Date</p>
                    <p>{soutenance.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">⏰ Heure</p>
                    <p>{soutenance.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">📍 Lieu</p>
                    <p>{soutenance.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">🧑‍🎓 Groupe</p>
                    <p>{soutenance.group}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600 font-semibold">👨‍🏫 Jury</p>
                  <p>{soutenance.jury.join(", ")}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucune soutenance ajoutée.</p>
          )}
        </div>
      </div>

      {/* Gestion des jurys */}
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">👨‍⚖️ Gestion des Jurys</h2>
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <ul className="space-y-3">
            {jurys.map((jury, index) => (
              <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-gray-700">{jury}</span>
                <button
                  onClick={() => {
                    const newMember = prompt(`Remplacer ${jury} par :`);
                    if (newMember) {
                      setJurys(jurys.map((member) => (member === jury ? newMember : member)));
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                >
                  <FaEdit />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const newJury = prompt("Ajouter un nouveau jury :");
              if (newJury) {
                setJurys([...jurys, newJury]);
              }
            }}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
          >
            <FaPlus /> Ajouter un Jury
          </button>
        </div>
      </div>
    </div>
  );
}

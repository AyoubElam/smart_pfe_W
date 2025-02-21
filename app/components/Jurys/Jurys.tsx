"use client";

import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const GestionJurys = () => {
  const [jurys, setJurys] = useState<string[]>(["Prof. Ahmed", "Prof. Fatima", "Prof. Karim"]);

  // Function to add a new jury member
  const addJury = () => {
    const newJury = prompt("Ajouter un nouveau jury :");
    if (newJury && !jurys.includes(newJury)) {
      setJurys([...jurys, newJury]);
    } else if (newJury && jurys.includes(newJury)) {
      alert("Ce jury existe déjà !");
    }
  };

  // Function to edit a jury member
  const editJury = (jury: string) => {
    const newMember = prompt(`Remplacer ${jury} par :`);
    if (newMember && !jurys.includes(newMember)) {
      setJurys(jurys.map((member) => (member === jury ? newMember : member)));
    } else if (newMember && jurys.includes(newMember)) {
      alert("Ce jury existe déjà !");
    }
  };

  // Function to delete a jury member
  const deleteJury = (jury: string) => {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer ${jury} ?`);
    if (confirmDelete) {
      setJurys(jurys.filter((member) => member !== jury));
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">👨‍⚖️ Gestion des Jurys</h2>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        {/* List of Jurys */}
        <ul className="space-y-3">
          {jurys.map((jury, index) => (
            <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="text-gray-700">{jury}</span>
              <div className="flex items-center gap-4">
                {/* Edit Button */}
                <button
                  onClick={() => editJury(jury)}
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                >
                  <FaEdit />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => deleteJury(jury)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Add Jury Button */}
        <button
          onClick={addJury}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
        >
          <FaPlus /> Ajouter un Jury
        </button>
      </div>
    </div>
  );
};

export default GestionJurys;
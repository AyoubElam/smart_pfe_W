/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import JuryList from "../components/GestionJurys/JuryList";
import AddJuryForm from "../components/GestionJurys/AddJuryForm";

export default function GestionJurys() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">👨‍⚖️ Gestion des Jurys</h1>
      <AddJuryForm onAdd={function (name: string): void {
              throw new Error("Function not implemented.");
          } } />
      <JuryList />
    </div>
  );
}
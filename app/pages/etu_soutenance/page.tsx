/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Filters from "../../components/ListeSoutenances/Filters"
import SoutenanceTable1 from "../../components/etu_soutenance/table_sout"

interface Soutenance1 {
  id: number
  date: string
  time: string
  location: string
  groupe: string
  juryNames: string | string[]
  status: string
}

export default function ListeSoutenances() {
  const router = useRouter()
  
  // Static data for soutenances
  const soutenancess: Soutenance1[] = [
    {
      id: 1,
      date: "2025-02-28",
      time: "10:00",
      location: "Room 101",
      groupe: "Groupe A",
      juryNames: "Dr. John Doe, Prof. Jane Smith",
      status: "Scheduled",
    },
    {
      id: 2,
      date: "2025-03-01",
      time: "14:00",
      location: "Room 102",
      groupe: "Groupe B",
      juryNames: "Prof. Alan Brown, Dr. Emma Wilson",
      status: "Scheduled",
    },
    // Add more static soutenances as needed
  ]

  const [filters, setFilters] = useState<any>(null)  // This will store the applied filters if need

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">📋 Liste des Soutenances </h1>
      <SoutenanceTable1 soutenances={soutenancess}  />
    </div>
  )
}

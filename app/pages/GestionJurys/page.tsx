/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import JuryList from "../../components/GestionJurys/JuryList"
import AddJuryForm from "../../components/GestionJurys/AddJuryForm"

interface Jury {
  idJury: number
  nom: string
  valideDeliberation: boolean
}

interface Toast {
  message: string
  type: "success" | "error"
}

export default function GestionJurys() {
  const [jurys, setJurys] = useState<Jury[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  // Fetch initial jury data
  useEffect(() => {
    const fetchJurys = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/api/jurys")
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des jurys")
        }

        const data = await response.json()
        setJurys(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue")
        console.error("Error fetching jurys:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJurys()
  }, [])

  // Handle toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const addJury = async (name: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/jurys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: name }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du jury")
      }

      const newJury = await response.json()
      setJurys((prev) => [...prev, newJury])
      setToast({
        message: "Jury ajouté avec succès",
        type: "success"
      })
          // After successful add, refresh the page
    window.location.reload()
    } catch (error) {
      console.error("Error adding jury:", error)
      setToast({
        message: error instanceof Error ? error.message : "Erreur lors de l'ajout du jury",
        type: "error"
      })
    }
  }

  const deleteJury = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jurys/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du jury")
      }

      setJurys((prev) => prev.filter(jury => jury.idJury !== id))
      setToast({
        message: "Jury supprimé avec succès",
        type: "success"
      })
    } catch (error) {
      console.error("Error deleting jury:", error)
      setToast({
        message: error instanceof Error ? error.message : "Erreur lors de la suppression du jury",
        type: "error"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-300">
          <Alert
            variant={toast.type === "error" ? "destructive" : "default"}
            className={`flex items-center justify-between p-4 text-lg rounded-lg ${
              toast.type === "success" 
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <AlertDescription className="font-semibold">
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">👨‍⚖️ Gestion des Jurys</h1>
      <AddJuryForm onAdd={addJury} />
      <JuryList />
    </div>
    </div>
  )
}

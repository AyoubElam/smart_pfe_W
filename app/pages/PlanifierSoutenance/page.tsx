/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, Home, User, Loader2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SubmitButton from "../../components/PlanifierSoutenance/SubmitButton"

interface Group {
  idGroupe: string
  nomGroupe: string
  nbEtudiants: number
}

interface Jury {
  idJury: number
  nom: string
  valideDeliberation: number
}

interface Room {
  id: string
  name: string
}

interface FormData {
  date: string
  time: string
  location: string
  jury: string[]  // Changed to string[] to match the component logic
  group: string
}

interface Toast {
  message: string
  type: "success" | "error"
}

const INITIAL_FORM_STATE: FormData = {
  date: "",
  time: "",
  location: "",
  jury: [],  // Initialize as empty array
  group: "",
}

const rooms: Room[] = [
  { id: "Salle 1", name: "Salle 1" },
  { id: "Salle 2", name: "Salle 2" },
  { id: "Salle 3", name: "Salle 3" },
  { id: "Salle 4", name: "Salle 4" },
  { id: "Salle 5", name: "Salle 5" },
  { id: "Salle 6", name: "Salle 6" },
  { id: "Salle 7", name: "Salle 7" },
  { id: "Salle 8", name: "Salle 8" },
  { id: "Salle 9", name: "Salle 9" },
]

export default function PlanifierSoutenance() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE)
  const [groups, setGroups] = useState<Group[]>([])
  const [jurys, setJurys] = useState<Jury[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [groupsResponse, jurysResponse] = await Promise.all([
          fetch("http://localhost:5000/api/groups"),
          fetch("http://localhost:5000/api/jurys"),
        ])

        if (!groupsResponse.ok || !jurysResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [groupsData, jurysData] = await Promise.all([
          groupsResponse.json(),
          jurysResponse.json(),
        ])

        setGroups(groupsData)
        setJurys(jurysData)
      } catch (error) {
        setError("Erreur lors du chargement des données. Veuillez réessayer.")
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const onAddSoutenance = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/soutenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(formData.date).toISOString(),
          time: formData.time,
          location: formData.location,
          juryIds: formData.jury.map(id => parseInt(id, 10)),
          group: parseInt(formData.group, 10),
          status: "Pending",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "An error occurred")
      }

      const data = await response.json()
      setToast({
        type: "success",
        message: "Soutenance added successfully!",
      })
      
      // Reset form after successful submission
      setFormData(INITIAL_FORM_STATE)
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add soutenance",
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
    <div className="p-12 bg-gray-50 min-h-screen relative">
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
            <AlertDescription className="font-semibold">{toast.message}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-transparent"
              onClick={() => setToast(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center">
          Planification des Soutenances
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl justify-center">
                <Users className="h-6 w-6" />
                Groupes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.group}
                onValueChange={(value) =>
                  setFormData({ ...formData, group: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un groupe" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.idGroupe} value={group.idGroupe}>
                      {group.nomGroupe} ({group.nbEtudiants} étudiants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl justify-center">
                <Calendar className="h-6 w-6" />
                Date et Heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="text-lg p-3"
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="text-lg p-3"
              />
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl justify-center">
                <Home className="h-6 w-6" />
                Salle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une salle" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl justify-center">
                <User className="h-6 w-6" />
                Jury
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {jurys.map((jury) => (
                  <div key={jury.idJury} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`jury-${jury.idJury}`}
                      value={jury.idJury}
                      checked={formData.jury.includes(jury.idJury.toString())}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        const juryId = jury.idJury.toString()
                        
                        if (isChecked && formData.jury.length < 2) {
                          setFormData({
                            ...formData,
                            jury: [...formData.jury, juryId]
                          })
                        } else if (!isChecked) {
                          setFormData({
                            ...formData,
                            jury: formData.jury.filter(id => id !== juryId)
                          })
                        } else {
                          alert("Vous ne pouvez sélectionner que 2 jurys maximum.")
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`jury-${jury.idJury}`} className="text-lg">
                      {jury.nom}
                    </label>
                  </div>
                ))}
              </div>

              {formData.jury.length > 0 && (
                <div className="mt-4">
                  <strong>Jurys sélectionnés:</strong>{" "}
                  {formData.jury
                    .map(id => jurys.find(jury => jury.idJury.toString() === id)?.nom)
                    .join(", ")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <SubmitButton onAddSoutenance={onAddSoutenance} />
        </div>
      </div>
    </div>
  )
}
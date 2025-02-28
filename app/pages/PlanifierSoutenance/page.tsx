/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, Calendar, Home, User, Loader2, X, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

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
  date: Date | undefined
  time: string
  location: string
  jury: string[]
  group: string
}

interface Toast {
  message: string
  type: "success" | "error"
}

const INITIAL_FORM_STATE: FormData = {
  date: undefined,
  time: "",
  location: "",
  jury: [],
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

// Time slots for the time picker
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

export default function PlanifierSoutenance() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE)
  const [groups, setGroups] = useState<Group[]>([])
  const [jurys, setJurys] = useState<Jury[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [openTimePopover, setOpenTimePopover] = useState(false)

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

        const [groupsData, jurysData] = await Promise.all([groupsResponse.json(), jurysResponse.json()])

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
    if (!formData.date || !formData.time || !formData.location || !formData.group || formData.jury.length === 0) {
      setToast({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/soutenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date.toISOString(),
          time: formData.time,
          location: formData.location,
          juryIds: formData.jury.map((id) => Number.parseInt(id, 10)),
          group: Number.parseInt(formData.group, 10),
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
        message: "Soutenance planifiée avec succès !",
      })

      // Reset form after successful submission
      setFormData(INITIAL_FORM_STATE)
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Échec de l'ajout de la soutenance",
      })
    }
  }

  const handleJuryChange = (juryId: string, checked: boolean) => {
    if (checked) {
      if (formData.jury.length < 2) {
        setFormData({
          ...formData,
          jury: [...formData.jury, juryId],
        })
      } else {
        setToast({
          type: "error",
          message: "Vous ne pouvez sélectionner que 2 jurys maximum.",
        })
      }
    } else {
      setFormData({
        ...formData,
        jury: formData.jury.filter((id) => id !== juryId),
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-b from-background to-muted/20">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription className="text-center">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 relative">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300 w-full max-w-md">
          <Alert
            variant={toast.type === "error" ? "destructive" : "default"}
            className={`flex items-center justify-between p-4 text-lg rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                  ? "bg-destructive text-destructive-foreground"
                  : ""
            }`}
          >
            <AlertDescription className="font-medium">{toast.message}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-transparent text-current opacity-70 hover:opacity-100"
              onClick={() => setToast(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </Alert>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Planification des Soutenances
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Organisez les soutenances en sélectionnant un groupe, une date, une salle et un jury
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="flex items-center gap-3 text-xl justify-center text-primary">
                <Users className="h-6 w-6" />
                Groupe d'étudiants
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between h-12 text-base">
                    {formData.group
                      ? groups.find((group) => group.idGroupe === formData.group)?.nomGroupe
                      : "Sélectionner un groupe"}
                    <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher un groupe..." />
                    <CommandList>
                      <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {groups.map((group) => (
                          <CommandItem
                            key={group.idGroupe}
                            value={group.nomGroupe}
                            onSelect={() => {
                              setFormData({ ...formData, group: group.idGroupe })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.group === group.idGroupe ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {group.nomGroupe} ({group.nbEtudiants} étudiants)
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="flex items-center gap-3 text-xl justify-center text-primary">
                <Calendar className="h-6 w-6" />
                Date de soutenance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover open={openTimePopover} onOpenChange={setOpenTimePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !formData.time && "text-muted-foreground",
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.time ? formData.time : "Sélectionner une heure"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher une heure..." />
                      <CommandList>
                        <CommandEmpty>Aucune heure trouvée.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {timeSlots.map((time) => (
                            <CommandItem
                              key={time}
                              value={time}
                              onSelect={() => {
                                setFormData({ ...formData, time })
                                setOpenTimePopover(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", formData.time === time ? "opacity-100" : "opacity-0")}
                              />
                              {time}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="flex items-center gap-3 text-xl justify-center text-primary">
                <Home className="h-6 w-6" />
                Salle
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between h-12 text-base">
                    {formData.location
                      ? rooms.find((room) => room.id === formData.location)?.name
                      : "Sélectionner une salle"}
                    <Home className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher une salle..." />
                    <CommandList>
                      <CommandEmpty>Aucune salle trouvée.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {rooms.map((room) => (
                          <CommandItem
                            key={room.id}
                            value={room.name}
                            onSelect={() => {
                              setFormData({ ...formData, location: room.id })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.location === room.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {room.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="flex items-center gap-3 text-xl justify-center text-primary">
                <User className="h-6 w-6" />
                Jury (max. 2)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {jurys.map((jury) => (
                    <div
                      key={jury.idJury}
                      className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`jury-${jury.idJury}`}
                        checked={formData.jury.includes(jury.idJury.toString())}
                        onCheckedChange={(checked) => handleJuryChange(jury.idJury.toString(), checked === true)}
                      />
                      <Label htmlFor={`jury-${jury.idJury}`} className="flex-1 cursor-pointer text-base">
                        {jury.nom}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.jury.length > 0 && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-md">
                    <p className="font-medium text-sm">Jurys sélectionnés:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.jury.map((id) => {
                        const juryName = jurys.find((jury) => jury.idJury.toString() === id)?.nom
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                          >
                            <User className="h-3 w-3" />
                            {juryName}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            onClick={onAddSoutenance}
            className="h-12 px-8 text-lg font-medium rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            Planifier la soutenance
          </Button>
        </div>
      </div>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, use, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar, Clock, Users, MapPin, Activity, ArrowLeft, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Soutenance {
  idSoutenance: number
  date: string
  time: string
  location: string
  nomGroupe: string
  idGroupe: string
  juryNames: string
  status: string
}

interface Group {
  idGroupe: string
  nomGroupe: string
  nbEtudiants: number
}

interface Jury {
  idJury: number
  nom: string
}

interface StatusConfig {
  label: string
  color: string
  bgColor: string
  icon: JSX.Element
}

const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "Scheduled":
      return {
        label: "Planifié",
        color: "text-blue-700 dark:text-blue-300",
        bgColor: "bg-blue-100 dark:bg-blue-900/50",
        icon: <Calendar className="h-4 w-4" />,
      }
    case "Completed":
      return {
        label: "Terminé",
        color: "text-green-700 dark:text-green-300",
        bgColor: "bg-green-100 dark:bg-green-900/50",
        icon: <Activity className="h-4 w-4" />,
      }
    case "Pending":
      return {
        label: "En attente",
        color: "text-yellow-700 dark:text-yellow-300",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
        icon: <Clock className="h-4 w-4" />,
      }
    case "Cancelled":
      return {
        label: "Annulé",
        color: "text-red-700 dark:text-red-300",
        bgColor: "bg-red-100 dark:bg-red-900/50",
        icon: <AlertCircle className="h-4 w-4" />,
      }
    default:
      return {
        label: "Inconnu",
        color: "text-gray-700 dark:text-gray-300",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        icon: <AlertCircle className="h-4 w-4" />,
      }
  }
}

export default function EditSoutenancePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [soutenance, setSoutenance] = useState<Soutenance | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [juryList, setJuryList] = useState<Jury[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [selectedJuryIds, setSelectedJuryIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [openTimePopover, setOpenTimePopover] = useState(false)

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

  // Fetch all necessary data
  useEffect(() => {
    if (!id) {
      setError("ID manquant dans l'URL")
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch soutenance data
        const soutenanceResponse = await fetch(`http://localhost:5000/api/soutenance/${id}`)
        if (!soutenanceResponse.ok) {
          throw new Error("Échec du chargement de la soutenance")
        }
        const soutenanceData = await soutenanceResponse.json()

        // Format date
        const formattedDate = soutenanceData.date ? new Date(soutenanceData.date) : undefined
        setDate(formattedDate)

        setSoutenance({
          ...soutenanceData,
          date: formattedDate?.toISOString().split("T")[0] || "",
        })

        // Set initial selected group ID
        setSelectedGroupId(soutenanceData.idGroupe)

        // Fetch groups
        const groupsResponse = await fetch("http://localhost:5000/api/groups")
        if (!groupsResponse.ok) {
          throw new Error("Échec du chargement des groupes")
        }
        const groupsData = await groupsResponse.json()
        setGroups(groupsData)

        // Fetch jury list
        const juryResponse = await fetch("http://localhost:5000/api/jurys")
        if (!juryResponse.ok) {
          throw new Error("Échec du chargement du jury")
        }
        const juryData = await juryResponse.json()
        setJuryList(juryData)

        // Parse existing jury IDs from juryNames string
        if (soutenanceData.juryNames) {
          const existingJuryNames = soutenanceData.juryNames.split(" | ")
          const existingJuryIds = juryData
            .filter((jury: { nom: any }) => existingJuryNames.includes(jury.nom))
            .map((jury: { idJury: any }) => jury.idJury)
          setSelectedJuryIds(existingJuryIds)
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données")
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleJuryChange = (juryId: number) => {
    setSelectedJuryIds((current) => {
      if (current.includes(juryId)) {
        // Remove jury member
        const newSelection = current.filter((id) => id !== juryId)
        updateJuryNames(newSelection)
        return newSelection
      } else if (current.length < 2) {
        // Add jury member if less than 2 selected
        const newSelection = [...current, juryId]
        updateJuryNames(newSelection)
        return newSelection
      }
      return current
    })
  }

  const updateJuryNames = (juryIds: number[]) => {
    const juryNames = juryIds
      .map((id) => juryList.find((j) => j.idJury === id)?.nom)
      .filter(Boolean)
      .join(" | ")

    setSoutenance((prev) => (prev ? { ...prev, juryNames } : null))
  }

  const handleSave = async () => {
    if (!soutenance || !soutenance.idSoutenance) {
      setError("Données de soutenance manquantes")
      return
    }

    // Validate jury selection
    if (selectedJuryIds.length < 2) {
      setError("Veuillez sélectionner au moins 2 membres du jury")
      return
    }

    const updateData = {
      date: soutenance.date,
      time: soutenance.time,
      location: soutenance.location,
      status: soutenance.status,
      group: selectedGroupId,
      juryIds: selectedJuryIds,
    }

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`http://localhost:5000/api/soutenance/${soutenance.idSoutenance}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Erreur serveur: ${errorData}`)
      }

      console.log("✅ Soutenance mise à jour avec succès!")
      router.push("/pages/ListeSoutenances")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue"
      console.error("❌ Erreur de mise à jour:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !soutenance) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive" className="animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error || "Soutenance non trouvée"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(soutenance.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/pages/ListeSoutenances")}
            className="mb-4 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Modifier la Soutenance
          </h1>
          <p className="mt-3 text-muted-foreground">
            Modifiez les détails de la soutenance pour le groupe {soutenance.nomGroupe}
          </p>
        </div>

        <Card className="border-primary/10 shadow-md">
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate)
                          if (newDate) {
                            setSoutenance((prev) =>
                              prev ? { ...prev, date: newDate.toISOString().split("T")[0] } : null,
                            )
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Heure
                  </Label>
                  <Popover open={openTimePopover} onOpenChange={setOpenTimePopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !soutenance.time && "text-muted-foreground",
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {soutenance.time || "Sélectionner une heure"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une heure..." />
                        <CommandList>
                          <CommandEmpty>Aucune heure trouvée.</CommandEmpty>
                          <CommandGroup>
                            {timeSlots.map((time) => (
                              <CommandItem
                                key={time}
                                value={time}
                                onSelect={() => {
                                  setSoutenance((prev) => (prev ? { ...prev, time } : null))
                                  setOpenTimePopover(false)
                                }}
                              >
                                <Clock
                                  className={cn("mr-2 h-4 w-4", soutenance.time === time ? "opacity-100" : "opacity-0")}
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
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Groupe
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between", !selectedGroupId && "text-muted-foreground")}
                    >
                      {selectedGroupId
                        ? groups.find((group) => group.idGroupe === selectedGroupId)?.nomGroupe
                        : "Sélectionner un groupe"}
                      <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher un groupe..." />
                      <CommandList>
                        <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
                        <CommandGroup>
                          {groups.map((group) => (
                            <CommandItem
                              key={group.idGroupe}
                              value={group.nomGroupe}
                              onSelect={() => {
                                setSelectedGroupId(group.idGroupe)
                                setSoutenance((prev) => (prev ? { ...prev, nomGroupe: group.nomGroupe } : null))
                              }}
                            >
                              <Users
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedGroupId === group.idGroupe ? "opacity-100" : "opacity-0",
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
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Jury
                  </Label>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      selectedJuryIds.length < 2
                        ? "text-destructive border-destructive"
                        : "text-primary border-primary",
                    )}
                  >
                    {selectedJuryIds.length}/2 sélectionnés
                  </Badge>
                </div>
                <Card className="border-primary/10">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {juryList.map((jury) => (
                        <div
                          key={jury.idJury}
                          className={cn(
                            "flex items-center space-x-2 rounded-lg border p-3 transition-colors",
                            selectedJuryIds.includes(jury.idJury) ? "bg-primary/5 border-primary" : "hover:bg-muted/50",
                          )}
                        >
                          <Checkbox
                            id={`jury-${jury.idJury}`}
                            checked={selectedJuryIds.includes(jury.idJury)}
                            onCheckedChange={() => handleJuryChange(jury.idJury)}
                            disabled={!selectedJuryIds.includes(jury.idJury) && selectedJuryIds.length >= 2}
                          />
                          <Label htmlFor={`jury-${jury.idJury}`} className="flex-1 cursor-pointer text-sm">
                            {jury.nom}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {selectedJuryIds.length < 2 && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Veuillez sélectionner exactement 2 membres du jury
                  </p>
                )}
              </div>

              <Separator className="my-8" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Salle
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !soutenance.location && "text-muted-foreground")}
                      >
                        {soutenance.location || "Sélectionner une salle"}
                        <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une salle..." />
                        <CommandList>
                          <CommandEmpty>Aucune salle trouvée.</CommandEmpty>
                          <CommandGroup>
                            {Array.from({ length: 12 }, (_, i) => `Salle ${i + 1}`).map((salle) => (
                              <CommandItem
                                key={salle}
                                value={salle}
                                onSelect={() => {
                                  setSoutenance((prev) => (prev ? { ...prev, location: salle } : null))
                                }}
                              >
                                <MapPin
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    soutenance.location === salle ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {salle}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Statut
                  </Label>
                  <Select
                    value={soutenance.status}
                    onValueChange={(value) => setSoutenance((prev) => (prev ? { ...prev, status: value } : null))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {soutenance.status && (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-medium gap-1.5 pl-1 pr-2",
                                statusConfig.color,
                                statusConfig.bgColor,
                                "border-0",
                              )}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-medium gap-1.5 pl-1 pr-2 text-blue-700 bg-blue-100 border-0"
                          >
                            <Calendar className="h-4 w-4" />
                            Planifié
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="Completed">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-medium gap-1.5 pl-1 pr-2 text-green-700 bg-green-100 border-0"
                          >
                            <Activity className="h-4 w-4" />
                            Terminé
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="Pending">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-medium gap-1.5 pl-1 pr-2 text-yellow-700 bg-yellow-100 border-0"
                          >
                            <Clock className="h-4 w-4" />
                            En attente
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="Cancelled">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-medium gap-1.5 pl-1 pr-2 text-red-700 bg-red-100 border-0"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Annulé
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/pages/ListeSoutenances")}
                  className="transition-all hover:bg-destructive hover:text-destructive-foreground"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedJuryIds.length < 2 || isSaving}
                  className="transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar, Clock, Users, MapPin, Activity } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

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
  const [error, setError] = useState<string | null>(null)

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
        const formattedDate = soutenanceData.date ? new Date(soutenanceData.date).toISOString().split("T")[0] : ""

        setSoutenance({
          ...soutenanceData,
          date: formattedDate,
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
      const newSelection = current.includes(juryId) ? current.filter((id) => id !== juryId) : [...current, juryId]

      // Update soutenance jury names
      const juryNames = newSelection
        .map((id) => juryList.find((j) => j.idJury === id)?.nom)
        .filter(Boolean)
        .join(" | ")

      setSoutenance((prev) => (prev ? { ...prev, juryNames } : null))

      return newSelection
    })
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
      router.push("/ListeSoutenances")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue"
      console.error("❌ Erreur de mise à jour:", errorMessage)
      setError(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground animate-pulse">Chargement des données...</p>
      </div>
    )
  }

  if (error || !soutenance) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Soutenance non trouvée"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">Modifier la Soutenance</CardTitle>
          <CardDescription>Modifiez les détails de la soutenance pour le groupe {soutenance.nomGroupe}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6  ">
            <div className="space-y-2 text-center  justify-center">
              <Label htmlFor="date" className="flex items-center gap-2  justify-center">
                <Calendar className="h-4 w-4 text-center " />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={soutenance.date}
                onChange={(e) => setSoutenance((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                className="transition-all hover:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2  justify-center">
                <Clock className="h-4 w-4" />
                Heure
              </Label>
              <Input
                id="time"
                type="time"
                value={soutenance.time}
                onChange={(e) => setSoutenance((prev) => (prev ? { ...prev, time: e.target.value } : null))}
                className="transition-all hover:border-primary"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="flex items-center gap-2  justify-center">
              <Users className="h-4 w-4" />
              Groupe
            </Label>
            <Select
              value={selectedGroupId}
              onValueChange={(groupId) => {
                setSelectedGroupId(groupId)
                const selectedGroup = groups.find((g) => g.idGroupe === groupId)
                if (selectedGroup) {
                  setSoutenance((prev) => (prev ? { ...prev, nomGroupe: selectedGroup.nomGroupe } : null))
                }
              }}
            >
              <SelectTrigger className="w-full transition-all hover:border-primary">
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
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="flex items-center gap-2  justify-center">
              <Users className="h-4 w-4" />
              Jury
            </Label>
            <Card className="border-2 border-muted">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  {juryList.map((jury) => (
                    <div
                      key={jury.idJury}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        id={`jury-${jury.idJury}`}
                        checked={selectedJuryIds.includes(jury.idJury)}
                        onCheckedChange={() => handleJuryChange(jury.idJury)}
                      />
                      <Label htmlFor={`jury-${jury.idJury}`} className="cursor-pointer flex-1">
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
                Veuillez sélectionner au moins 2 membres du jury
              </p>
            )}
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salle" className="flex items-center  justify-center gap-2">
                <MapPin className="h-4 w-4 te" />
                Salle
              </Label>
              <Select
                value={soutenance.location}
                onValueChange={(value) => setSoutenance((prev) => (prev ? { ...prev, location: value } : null))}
              >
                <SelectTrigger id="salle" className="transition-all hover:border-primary">
                  <SelectValue placeholder="Sélectionner une salle" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Salle ${i + 1}`}>
                      Salle {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center  justify-center gap-2">
                <Activity className="h-4 w-4" />
                Statut
              </Label>
              <Select
                value={soutenance.status}
                onValueChange={(value) => setSoutenance((prev) => (prev ? { ...prev, status: value } : null))}
              >
                <SelectTrigger id="status" className="transition-all hover:border-primary">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Planifié</SelectItem>
                  <SelectItem value="Completed">Terminé</SelectItem>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/ListeSoutenances")}
              className="transition-all hover:bg-secondary text-center"
            >
              Annuler
            </Button>
            <Button onClick={handleSave} className="transition-all" disabled={selectedJuryIds.length < 2}>
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


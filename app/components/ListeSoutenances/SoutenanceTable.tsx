/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Edit2,
  Users,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarClock,
  Trash2,
  Calendar,
  MapPin,
  Plus,
  X,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface Soutenance {
  idSoutenance: number
  date: string
  time: string
  location: string
  nomGroupe: string
  juryNames: string[] | string | null
  status: string
}

interface StatusConfig {
  color: string
  bg: string
  hoverBg: string
  icon: React.ReactNode
  text: string
}

interface Salle {
  idSalle: string
  nomSalle: string
}

interface Group {
  idGroupe: string
  nomGroupe: string
  nbEtudiants: number
}

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "Scheduled":
      return {
        color: "text-blue-700 dark:text-blue-300",
        bg: "bg-blue-100 dark:bg-blue-900/50",
        hoverBg: "hover:bg-blue-200 dark:hover:bg-blue-900/70",
        icon: <CalendarClock className="w-3.5 h-3.5" />,
        text: "Planifié",
      }
    case "Completed":
      return {
        color: "text-green-700 dark:text-green-300",
        bg: "bg-green-100 dark:bg-green-900/50",
        hoverBg: "hover:bg-green-200 dark:hover:bg-green-900/70",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        text: "Terminé",
      }
    case "Pending":
      return {
        color: "text-yellow-700 dark:text-yellow-300",
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-900/70",
        icon: <Clock className="w-3.5 h-3.5" />,
        text: "En attente",
      }
    case "Cancelled":
      return {
        color: "text-red-700 dark:text-red-300",
        bg: "bg-red-100 dark:bg-red-900/50",
        hoverBg: "hover:bg-red-200 dark:hover:bg-red-900/70",
        icon: <XCircle className="w-3.5 h-3.5" />,
        text: "Annulé",
      }
    default:
      return {
        color: "text-gray-700 dark:text-gray-300",
        bg: "bg-gray-100 dark:bg-gray-800",
        hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-800/70",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        text: "Inconnu",
      }
  }
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status)

  return (
    <Badge
      variant="outline"
      className={`
        ${config.bg} 
        ${config.color} 
        ${config.hoverBg}
        border-0 
        font-medium 
        gap-1.5
        px-2.5 
        py-0.5 
        transition-colors
        duration-200
        inline-flex
        items-center
        cursor-default
        select-none
        shadow-sm
      `}
    >
      {config.icon}
      {config.text}
    </Badge>
  )
}

function DeleteDialog({
  onDelete,
  Idsoutenance,
}: {
  onDelete: () => void
  Idsoutenance: number
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer la soutenance</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette soutenance ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 dark:hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function SoutenancesPage() {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([])
  const [filteredSoutenances, setFilteredSoutenances] = useState<Soutenance[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [groups, setGroups] = useState<Group[]>([])
  const [salles, setSalles] = useState<Salle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const rooms: Salle[] = [
    { idSalle: "1", nomSalle: "Salle 1" },
    { idSalle: "2", nomSalle: "Salle 2" },
    { idSalle: "3", nomSalle: "Salle 3" },
    { idSalle: "4", nomSalle: "Salle 4" },
    { idSalle: "5", nomSalle: "Salle 5" },
    { idSalle: "6", nomSalle: "Salle 6" },
    { idSalle: "7", nomSalle: "Salle 7" },
    { idSalle: "8", nomSalle: "Salle 8" },
    { idSalle: "9", nomSalle: "Salle 9" },
    { idSalle: "10", nomSalle: "Salle 10" },
    { idSalle: "11", nomSalle: "Salle 11" },
    { idSalle: "12", nomSalle: "Salle 12" },
  ]

  const router = useRouter()

  const fetchSoutenances = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:5000/api/soutenance")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des soutenances")
      }

      const data = await response.json()
      setSoutenances(data)
      applyFilters(data, searchTerm, statusFilter)
    } catch (error) {
      console.error("Error fetching soutenances:", error)
      setError("Impossible de charger les soutenances. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, statusFilter])

  const fetchGroupsAndSalles = useCallback(async () => {
    try {
      const groupsResponse = await fetch("http://localhost:5000/api/groups")

      if (!groupsResponse.ok) {
        throw new Error("Failed to fetch groups")
      }

      const groupsData = await groupsResponse.json()
      setGroups(groupsData)
      setSalles(rooms)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [])

  useEffect(() => {
    fetchSoutenances()
    fetchGroupsAndSalles()
  }, [fetchSoutenances, fetchGroupsAndSalles])

  useEffect(() => {
    applyFilters(soutenances, searchTerm, statusFilter)
  }, [searchTerm, statusFilter, soutenances])

  const applyFilters = (data: Soutenance[], search: string, status: string) => {
    let filtered = [...data]

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.nomGroupe.toLowerCase().includes(search.toLowerCase()) ||
          (Array.isArray(s.juryNames)
            ? s.juryNames.some((jury) => jury.toLowerCase().includes(search.toLowerCase()))
            : s.juryNames?.toLowerCase().includes(search.toLowerCase())) ||
          s.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((s) => s.status === status)
    }

    setFilteredSoutenances(filtered)
  }

  const handleEdit = (soutenance: Soutenance) => {
    console.log("Soutenance to edit:", soutenance)
    router.push(`/pages/edit_soutenance/${soutenance.idSoutenance}`)
  }

  const handleDelete = async (id: number) => {
    if (!id) {
      setError("Données de soutenance manquantes")
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/soutenance/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Erreur serveur: ${errorData}`)
      }
      // Rafraîchir la liste
      await fetchSoutenances()
      console.log("✅ Soutenance supprimée avec succès!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue"
      console.error("❌ Erreur de suppression:", errorMessage)
      setError(errorMessage)
    }
  }

  const handleAddNew = () => {
    router.push("/pages/PlanifierSoutenance")
  }

  const getTabCount = (status: string) => {
    if (status === "all") return soutenances.length
    return soutenances.filter((s) => s.status === status).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Soutenances
              </h1>
              <p className="text-muted-foreground mt-2">Gestion des sessions de soutenance</p>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <Card className="w-full border-primary/10 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-full sm:w-96" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-8 w-full mb-4" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full mb-2" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full border-primary/10 shadow-md">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Soutenances
            </h1>
            <p className="text-muted-foreground mt-2">Gestion des sessions de soutenance</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nouvelle soutenance
          </Button>
        </div>

        {soutenances.length === 0 ? (
          <Card className="w-full border-primary/10 shadow-md">
            <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucune soutenance disponible</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Il n'y a actuellement aucune soutenance planifiée. Commencez par en créer une nouvelle.
              </p>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Planifier une soutenance
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full border-primary/10 shadow-md">
            <CardHeader className="pb-2 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value)
                    setStatusFilter(value === "all" ? "all" : value)
                  }}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                    <TabsTrigger value="all" className="text-sm">
                      Toutes ({getTabCount("all")})
                    </TabsTrigger>
                    <TabsTrigger value="Pending" className="text-sm">
                      En attente ({getTabCount("Pending")})
                    </TabsTrigger>
                    <TabsTrigger value="Scheduled" className="text-sm">
                      Planifiées ({getTabCount("Scheduled")})
                    </TabsTrigger>
                    <TabsTrigger value="Completed" className="text-sm">
                      Terminées ({getTabCount("Completed")})
                    </TabsTrigger>
                    <TabsTrigger value="Cancelled" className="text-sm">
                       Annulé ({getTabCount("Cancelled")})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par groupe, jury ou salle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 text-base rounded-full border-primary/20 focus-visible:ring-primary"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Effacer la recherche</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[200px] font-semibold">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px] font-semibold">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          Heure
                        </div>
                      </TableHead>
                      <TableHead className="w-[150px] font-semibold">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          Lieu
                        </div>
                      </TableHead>
                      <TableHead className="w-[150px] font-semibold">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" />
                          Groupe
                        </div>
                      </TableHead>
                      <TableHead className="w-[250px] font-semibold">Jury</TableHead>
                      <TableHead className="w-[120px] font-semibold">Statut</TableHead>
                      <TableHead className="w-[100px] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSoutenances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Search className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Aucun résultat trouvé</p>
                            {searchTerm && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Essayez de modifier vos critères de recherche
                              </p>
                            )}
                            <Button
                              variant="link"
                              onClick={() => {
                                setSearchTerm("")
                                setStatusFilter("all")
                                setActiveTab("all")
                              }}
                              className="mt-2"
                            >
                              Réinitialiser les filtres
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSoutenances.map((soutenance, index) => (
                        <TableRow
                          key={soutenance.idSoutenance ?? `soutenance-${index}`}
                          className="transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {new Date(soutenance.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>{soutenance.time}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {soutenance.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-medium bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {soutenance.nomGroupe}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-pointer">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate max-w-[200px]">
                                      {Array.isArray(soutenance.juryNames)
                                        ? soutenance.juryNames.join(", ")
                                        : soutenance.juryNames}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {Array.isArray(soutenance.juryNames)
                                      ? soutenance.juryNames.join(", ")
                                      : soutenance.juryNames}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={soutenance.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                      onClick={() => handleEdit(soutenance)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                      <span className="sr-only">Modifier la soutenance</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Modifier la soutenance</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DeleteDialog
                                      onDelete={() => handleDelete(soutenance.idSoutenance)}
                                      Idsoutenance={soutenance.idSoutenance}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Supprimer la soutenance</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


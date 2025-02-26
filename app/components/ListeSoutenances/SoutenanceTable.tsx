/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import soutenance from "@/app/pages/api/soutenance";

interface Soutenance {
  idSoutenance: number;
  date: string;
  time: string;
  location: string;
  nomGroupe: string;
  juryNames: string[] | string | null;
  status: string;
}

interface StatusConfig {
  color: string;
  bg: string;
  hoverBg: string;
  icon: React.ReactNode;
  text: string;
}

interface Salle {
  idSalle: string;
  nomSalle: string;
}

interface Group {
  idGroupe: string;
  nomGroupe: string;
  nbEtudiants: number;
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
      };
    case "Completed":
      return {
        color: "text-green-700 dark:text-green-300",
        bg: "bg-green-100 dark:bg-green-900/50",
        hoverBg: "hover:bg-green-200 dark:hover:bg-green-900/70",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        text: "Terminé",
      };
    case "Pending":
      return {
        color: "text-yellow-700 dark:text-yellow-300",
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-900/70",
        icon: <Clock className="w-3.5 h-3.5" />,
        text: "En attente",
      };
    case "Cancelled":
      return {
        color: "text-red-700 dark:text-red-300",
        bg: "bg-red-100 dark:bg-red-900/50",
        hoverBg: "hover:bg-red-200 dark:hover:bg-red-900/70",
        icon: <XCircle className="w-3.5 h-3.5" />,
        text: "Annulé",
      };
    default:
      return {
        color: "text-gray-700 dark:text-gray-300",
        bg: "bg-gray-100 dark:bg-gray-800",
        hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-800/70",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        text: "Inconnu",
      };
  }
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);

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
  );
}

function DeleteDialog({
  onDelete,
  Idsoutenance,
}: {
  onDelete: () => void;
  Idsoutenance: number;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer la soutenance</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette soutenance ? Cette action
            est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 dark:hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SoutenancesPage() {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  ];

  const fetchSoutenances = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/soutenance");
      const data = await response.json();
      setSoutenances(data);
    } catch (error) {
      console.error("Error fetching soutenances:", error);
    }
  };

  useEffect(() => {
    fetchSoutenances();
  }, [fetchSoutenances]);

  const fetchGroupsAndSalles = async () => {
    try {
      setIsLoading(true);
      const groupsResponse = await fetch("http://localhost:5000/api/groups");

      if (!groupsResponse.ok) {
        throw new Error("Failed to fetch groups");
      }

      const groupsData = await groupsResponse.json();
      setGroups(groupsData);
      setSalles(rooms);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  const handleEdit = (soutenance: Soutenance) => {
    console.log("Soutenance to edit:", soutenance);
    router.push(`/edit_soutenance/${soutenance.idSoutenance}`);
  };

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!id) {
      setError("Données de soutenance manquantes");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/soutenance/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erreur serveur: ${errorData}`);
      }
      // Rafraîchir la liste
      await fetchSoutenances();
      console.log("✅ Soutenance supprimée avec succès!");
      router.push("/ListeSoutenances"); // Redirect to list page after successful deletion
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      console.error("❌ Erreur de suppression:", errorMessage);
      setError(errorMessage); // Show error message
    }
  };

  if (!soutenances || soutenances.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucune soutenance disponible pour le moment
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Soutenances</CardTitle>
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px] font-semibold text-lg">
                  Date
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">
                  Heure
                </TableHead>
                <TableHead className="w-[200px] font-semibold text-lg">
                  Lieu
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">
                  Groupe
                </TableHead>
                <TableHead className="w-[300px] font-semibold text-lg">
                  Jury
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">
                  Statut
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soutenances
                .filter((s) =>
                  s.nomGroupe.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((soutenance, index) => (
                  <TableRow
                    key={soutenance.idSoutenance ?? `soutenance-${index}`}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium text-lg">
                      {new Date(soutenance.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-lg">{soutenance.time}</TableCell>
                    <TableCell className="text-lg">
                      {soutenance.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-medium text-lg"
                      >
                        {soutenance.nomGroupe}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <span className="truncate max-w-[250px] text-lg">
                                {Array.isArray(soutenance.juryNames)
                                  ? soutenance.juryNames.join(", ")
                                  : soutenance.juryNames}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-lg">
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-muted"
                                onClick={() => handleEdit(soutenance)}
                              >
                                <Edit2 className="h-5 w-5" />
                                <span className="sr-only">
                                  Modifier la soutenance
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-lg">Modifier la soutenance</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DeleteDialog
                                onDelete={() =>
                                  handleDelete(soutenance.idSoutenance)
                                }
                                Idsoutenance={soutenance.idSoutenance}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-lg">Supprimer la soutenance</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

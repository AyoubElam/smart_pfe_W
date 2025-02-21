"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

interface Soutenance {
  id: number;
  date: string;
  time: string;
  location: string;
  nomGroupe: string;
  juryNames: string[] | string | null;  // Allowing null in case no jury is assigned
  status: string;
}


interface SoutenanceTableProps {
  soutenances?: Soutenance[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

interface StatusConfig {
  color: string;
  bg: string;
  hoverBg: string;
  icon: React.ReactNode;
  text: string;
}

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "Scheduled":
      return {
        color: "text-blue-700 dark:text-blue-300",
        bg: "bg-blue-100 dark:bg-blue-900/50",
        hoverBg: "hover:bg-blue-200 dark:hover:bg-blue-900/70",
        icon: <CalendarClock className="w-3.5 h-3.5" />,
        text: "Scheduled",
      };
    case "Completed":
      return {
        color: "text-green-700 dark:text-green-300",
        bg: "bg-green-100 dark:bg-green-900/50",
        hoverBg: "hover:bg-green-200 dark:hover:bg-green-900/70",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        text: "Completed",
      };
    case "Pending":
      return {
        color: "text-yellow-700 dark:text-yellow-300",
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-900/70",
        icon: <Clock className="w-3.5 h-3.5" />,
        text: "Pending",
      };
    case "Cancelled":
      return {
        color: "text-red-700 dark:text-red-300",
        bg: "bg-red-100 dark:bg-red-900/50",
        hoverBg: "hover:bg-red-200 dark:hover:bg-red-900/70",
        icon: <XCircle className="w-3.5 h-3.5" />,
        text: "Cancelled",
      };
    default:
      return {
        color: "text-gray-700 dark:text-gray-300",
        bg: "bg-gray-100 dark:bg-gray-800",
        hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-800/70",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        text: "Unknown",
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

function DeleteDialog({ onDelete, soutenanceId }: { onDelete: () => void, soutenanceId: number }) {
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
            Êtes-vous sûr de vouloir supprimer cette soutenance ? Cette action est irréversible.
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

export default function SoutenanceTable({
  onEdit = (id) => console.log(`Edit soutenance ${id}`),
  onDelete = (id) => console.log(`Delete soutenance ${id}`),
}: SoutenanceTableProps) {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from the local API
    async function fetchSoutenances() {
      try {
        const response = await fetch("http://localhost:5000/api/soutenance"); // Updated endpoint
        const data = await response.json();
        
        // Log the fetched data to verify it's correct
        console.log("Fetched soutenances data:", data);

        setSoutenances(data);
      } catch (error) {
        console.error("Error fetching soutenances:", error);
      }
    }

    fetchSoutenances();
  }, []);

  const filteredSoutenances = soutenances.filter((soutenance) =>
    soutenance.nomGroupe.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <TableHead className="w-[250px] font-semibold text-lg">Date</TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">Heure</TableHead>
                <TableHead className="w-[200px] font-semibold text-lg">Lieu</TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">Groupe</TableHead>
                <TableHead className="w-[300px] font-semibold text-lg">Jury</TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">Statut</TableHead>
                <TableHead className="w-[150px] font-semibold text-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSoutenances.map((soutenance) => (
                <TableRow key={soutenance.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium text-lg">
                    {new Date(soutenance.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-lg">{soutenance.time}</TableCell>
                  <TableCell className="text-lg">{soutenance.location}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium text-lg">
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
            {soutenance.juryNames}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-lg">
          {soutenance.juryNames}
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
                              onClick={() => onEdit(soutenance.id)}
                            >
                              <Edit2 className="h-5 w-5" />
                              <span className="sr-only">Modifier la soutenance</span>
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
                              onDelete={() => onDelete(soutenance.id)}
                              soutenanceId={soutenance.id}
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

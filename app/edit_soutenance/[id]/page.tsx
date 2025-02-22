/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useRouter } from "next/navigation"; // Still use next/navigation for navigation
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Soutenance {
  idSoutenance: number;
  date: string;
  time: string;
  location: string;
  nomGroupe: string;
  juryNames: string[] | string | null;
  status: string;
}


interface Group {
  idGroupe: string;
  nomGroupe: string;
  nbEtudiants: number;
}

export default function EditSoutenancePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [soutenance, setSoutenance] = useState<Soutenance | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleSave = async () => {
    console.log("Soutenance before save:", soutenance);
  
    if (!soutenance || !soutenance.idSoutenance) {
      setError("ID is missing or soutenance is not loaded.");
      return;
    }
  
    try {
      console.log("Sending PUT request...");
      const response = await fetch(`http://localhost:5000/api/soutenance/${soutenance.idSoutenance}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(soutenance),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update soutenance");
      }
  
      console.log("Soutenance updated successfully!");
      await router.push("/"); // Ensure this runs after the successful request
    } catch (error) {
      console.error("Error updating soutenance:", error);
      setError("Une erreur est survenue lors de la mise à jour");
    }
  };
  
  
  // Inside the useEffect where you fetch data, log soutenanceData
  useEffect(() => {
    if (!params.id) {
      setError("ID is missing in the URL");
      return;
    }
  
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        const soutenanceResponse = await fetch(`http://localhost:5000/api/soutenance/${params.id}`);
        if (!soutenanceResponse.ok) {
          throw new Error("Failed to fetch soutenance");
        }
        const soutenanceData = await soutenanceResponse.json();
        console.log("Fetched soutenance data:", soutenanceData);
  
        const formattedDate = new Date(soutenanceData.date).toISOString().split("T")[0];
        setSoutenance({
          ...soutenanceData,
          date: formattedDate,
        });
  
        const groupsResponse = await fetch("http://localhost:5000/api/groups");
        if (!groupsResponse.ok) {
          throw new Error("Failed to fetch groups");
        }
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [params.id]);
  
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !soutenance) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Soutenance non trouvée"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl">Modifier la Soutenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={soutenance.date}
              onChange={(e) => setSoutenance((prev) => (prev ? { ...prev, date: e.target.value } : null))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={soutenance.time}
              onChange={(e) => setSoutenance((prev) => (prev ? { ...prev, time: e.target.value } : null))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="group">Groupe</Label>
            <Select
              value={soutenance.nomGroupe}
              onValueChange={(groupId) => {
                const selectedGroup = groups.find((g) => g.idGroupe === groupId)
                if (selectedGroup) {
                  setSoutenance((prev) => (prev ? { ...prev, nomGroupe: selectedGroup.nomGroupe } : null))
                }
              }}
            >
              <SelectTrigger id="group">
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

          <div className="grid gap-2">
            <Label htmlFor="jury">Jury</Label>
            <Input
              id="jury"
              type="text"
              value={soutenance.juryNames || ""}
              onChange={(e) => setSoutenance((prev) => (prev ? { ...prev, juryNames: e.target.value } : null))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="salle">Salle</Label>
            <Select
              value={soutenance.location}
              onValueChange={(value) => setSoutenance((prev) => (prev ? { ...prev, location: value } : null))}
            >
              <SelectTrigger id="salle">
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

          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={soutenance.status}
              onValueChange={(value) => setSoutenance((prev) => (prev ? { ...prev, status: value } : null))}
            >
              <SelectTrigger id="status">
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


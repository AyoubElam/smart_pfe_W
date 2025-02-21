"use client"

import { useState, useEffect } from "react";
import { Users, Calendar, Home, User, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "../components/PlanifierSoutenance/SubmitButton"; // Import your SubmitButton component

interface Group {
  idGroupe: string;
  nomGroupe: string;
  nbEtudiants: number;
}

interface Jury {
  idJury: number;
  nom: string;
  valideDeliberation: number;
}

interface Room {
  id: string;
  name: string;
}

interface FormData {
  date: string;
  time: string;
  location: string;
  jury: string;
  group: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const INITIAL_FORM_STATE: FormData = {
  date: "",
  time: "",
  location: "",
  jury: "",
  group: "",
};

export default function PlanifierSoutenance() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [groups, setGroups] = useState<Group[]>([]);
  const [jurys, setJurys] = useState<Jury[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const rooms: Room[] = [
    { id: "1", name: "Salle 12" },
    { id: "2", name: "Salle 42" },
    { id: "3", name: "Salle 21" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupsResponse, jurysResponse] = await Promise.all([
          fetch("http://localhost:5000/api/groups"),
          fetch("http://localhost:5000/api/jurys"),
        ]);

        if (!groupsResponse.ok || !jurysResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [groupsData, jurysData] = await Promise.all([
          groupsResponse.json(),
          jurysResponse.json(),
        ]);

        setGroups(groupsData);
        setJurys(jurysData);
      } catch (error) {
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const onAddSoutenance = async () => {
    const isFormValid = Object.values(formData).every((value) =>
      typeof value === "string" ? value.trim() !== "" : value !== "" && value !== null
    );
  
    if (!isFormValid) {
      showToast("Veuillez remplir tous les champs", "error");
      return;
    }
  
    console.log("Form data before submission:", formData); // Debug log
  
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/soutenances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          location: formData.location,
          jury: formData.jury, // Jury is passed as a string (idJury is varchar)
          group: parseInt(formData.group), // Group is passed as an integer (idGroupe is int)
          status: "pending", // Assuming the status is "pending"
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la planification de la soutenance");
      }
  
      const data = await response.json();
      showToast(data.message, "success");
      setFormData(INITIAL_FORM_STATE); // Reset form after submission
    } catch (error) {
      showToast("Erreur lors de la planification", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-12 bg-gray-50 min-h-screen relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Alert
            variant={toast.type === "error" ? "destructive" : "default"}
            className="flex items-center justify-between p-4 text-lg"
          >
            <AlertDescription>{toast.message}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center">
          {/* Group Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-center flex justify-center">
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
                className="text-lg"
              >
                <SelectTrigger>
                  <SelectValue
                    className="text-center"
                    placeholder="Sélectionner un groupe"
                  />
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

          {/* Date and Time Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl flex justify-center">
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

          {/* Room Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl flex justify-center">
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
                className="text-lg"
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

          {/* Jury Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl justify-center">
                <User className="h-6 w-6" />
                Jury
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.jury}
                onValueChange={(value) =>
                  setFormData({ ...formData, jury: value })
                }
                className="text-lg"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un jury" />
                </SelectTrigger>
                <SelectContent>
                  {jurys.map((jury) => (
                    <SelectItem key={jury.idJury} value={jury.idJury.toString()}>
                      {jury.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <SubmitButton onAddSoutenance={onAddSoutenance} />
      </div>
    </div>
  );
}

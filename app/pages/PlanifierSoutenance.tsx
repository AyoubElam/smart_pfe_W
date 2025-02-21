/* eslint-disable @typescript-eslint/no-unused-vars */
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
    { id: "Salle 1", name: "Salle 1" },
    { id: "Salle 2", name: "Salle 2" },
    { id: "Salle 3", name: "Salle 3" },
    { id: "Salle 4", name: "Salle 4" },
    { id: "Salle 5", name: "Salle 5" },
    { id: "Salle 6", name: "Salle 6" },
    { id: "Salle 7", name: "Salle 7" },
    { id: "Salle 8", name: "Salle 8" },
    { id: "Salle 9", name: "Salle 9" },
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
    console.log(formData); // Inspect formData before sending
// Ensure juryIds is an array of numbers
const juryIds = formData.jury.map((juryId: string) => parseInt(juryId, 10)); 


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
      juryIds: juryIds, // Send as an array of IDs
      group: parseInt(formData.group, 10),
      status: "Pending",
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error:", error);
    setToast({
      type: "error",
      message: error.message || "An error occurred.",
    });
  } else {
    const data = await response.json();
    console.log("Soutenance Added:", data);
    setToast({
      type: "success",
      message: "Soutenance added successfully!",
    });
  }
} catch (error) {
  console.error("Request failed:", error);
  setToast({
    type: "error",
    message: "Failed to add soutenance. Please try again later.",
  });
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
      className={`flex items-center justify-between p-4 text-lg rounded-lg ${
        toast.type === "success" 
          ? "bg-green-500 text-white" // Green background for success
          : "bg-red-500 text-white"    // Red background for errors
      }`}
    >
      <AlertDescription className="font-semibold">{toast.message}</AlertDescription>
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
              <CardTitle className="flex items-center gap-3 text-xl text-center justify-center">
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
              const isChecked = e.target.checked;
              let newSelectedJuries: string[];

              if (isChecked) {
                // Add selected jury to array if it's not already selected
                newSelectedJuries = [...formData.jury, jury.idJury.toString()];
              } else {
                // Remove the unselected jury from array
                newSelectedJuries = formData.jury.filter(
                  (id: string) => id !== jury.idJury.toString()
                );
              }

              // Only allow up to 2 juries to be selected
              if (newSelectedJuries.length <= 2) {
                setFormData({ ...formData, jury: newSelectedJuries });
              } else {
                alert("You can only select up to 2 juries.");
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

    {/* Display selected juries */}
    {formData.jury.length > 0 && (
      <div className="mt-4">
        <strong>Selected Juries:</strong>{" "}
        {formData.jury
          .map((id: string) => jurys.find((jury) => jury.idJury.toString() === id)?.nom)
          .join(", ")}
      </div>
    )}
  </CardContent>
</Card>


        </div>

        <SubmitButton onAddSoutenance={onAddSoutenance} />
      </div>
    </div>
  );
}

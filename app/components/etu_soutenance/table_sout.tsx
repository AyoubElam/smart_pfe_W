"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Add this import
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, CalendarClock, CheckCircle2, XCircle, AlertCircle, FileUp } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

interface Soutenance {
  idSoutenance: number
  date: string
  time: string
  location: string
  nomGroupe: string
  juryNames: string[] | string | null
  status: string
  idGroupe: number 
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

const formatJuryNames = (juryNames: string[] | string | null) => {
  if (Array.isArray(juryNames)) {
    return juryNames.join(", ");
  } else if (typeof juryNames === "string") {
    return juryNames;
  } else {
    return "No jury assigned";
  }
}

export default function SoutenancesPage() {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // Add router hook

  const studentGroupId = 2 // Replace with dynamic logic later

  useEffect(() => {
    const fetchSoutenances = async () => {
      try {
        console.log("Fetching from:", `/api/etu_sout/group-only/${studentGroupId}`);
        const response = await fetch(`http://localhost:5000/api/etu_sout/group-only/${studentGroupId}`);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch soutenances");
        }
        const data = await response.json();
        console.log("Data received:", data);
        setSoutenances(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchSoutenances();
  }, [studentGroupId]);

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  const groupName = soutenances.length > 0 ? soutenances[0].nomGroupe : "Unknown"

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4 border-b justify-center">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold justify-center">
            Soutenances de votre groupe: <span className="text-primary">{groupName}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6"> 
          {soutenances.map((soutenance) => (
            <div
              key={soutenance.idSoutenance}
              className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow relative"
            >
              {/* Buttons positioned at top right */}
              <div className="absolute top-4 right-4 flex gap-3 items-center">
                <Button
                variant="outline"
                  className="rounded-md h-12 px-4 flex items-center gap-2"
                  onClick={() => router.push("/soumettre")}
                >
                  <FileUp className="h-8 w-8 text-black" />
                  <span className="text-base font-medium">Soumettre des documents</span>
                </Button>
              </div>

              {/* Centered content */}
              <div className="flex flex-col items-center text-center max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {soutenance.nomGroupe}
                  </Badge>
                  <StatusBadge status={soutenance.status} />
                </div>

                <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {format(parseISO(soutenance.date), "d MMMM yyyy", { locale: fr })}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{soutenance.time}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{soutenance.location}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{formatJuryNames(soutenance.juryNames)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
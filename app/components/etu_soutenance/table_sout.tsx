"use client"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Edit } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

interface Soutenance {
  idSoutenance: number
  date: string
  time: string
  location: string
  nomGroupe: string
  juryNames: string[]
  status: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "outline"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Badge variant={getVariant()} className="text-xs font-medium px-2.5 py-1">
      {status}
    </Badge>
  )
}

export default function SoutenancesPage() {
  // Static soutenances data
  const soutenances: Soutenance[] = [
    {
      idSoutenance: 1,
      date: "2025-03-10",
      time: "10:00",
      location: "Salle 1",
      nomGroupe: "Groupe A",
      juryNames: ["Dr. Smith", "Dr. John"],
      status: "cancelled",
    },
  ]

  // Assume this is the group the student belongs to
  const studentGroup = "Groupe A"

  // Filter soutenances to show only those for the student's group
  const studentSoutenances = soutenances.filter((soutenance) => soutenance.nomGroupe === studentGroup)

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4 border-b justify-center">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold justify-center">
            Soutenances de votre groupe: <span className="text-primary">{studentGroup}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6"> 
          {studentSoutenances.map((soutenance) => (
            <div
              key={soutenance.idSoutenance}
              className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow relative"
            >
              {/* Edit button positioned at top right */}
              <div className="absolute top-4 right-4">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <Edit className="h-4 w-4" />      
                  <span className="sr-only">Edit</span>
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
                    <span className="font-medium">{soutenance.juryNames.join(", ")}</span>
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


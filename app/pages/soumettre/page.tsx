"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SoumettrePage from '../../components/etu_soutenance/soumettre'

export default function SoutenancePage() {
  const [showSubmission, setShowSubmission] = useState(false)
  const idEtudiant = "4" // Replace with actual student ID or fetch dynamically

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>Soutenance</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Voici les détails de votre soutenance.</p>
        {!showSubmission ? (
          <Button onClick={() => setShowSubmission(true)} className="w-full">
            Soumettre des documents
          </Button>
        ) : (
          <SoumettrePage idEtudiant={idEtudiant} />
        )}
      </CardContent>
    </Card>
  )
}
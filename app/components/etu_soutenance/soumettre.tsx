/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileUp,
  Loader,
  FileText,
  FileIcon as FilePresentation,
  Download,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SubmittedDocument {
  idPFE: number
  idLivrable: 1 | 2
  fichier: string
}

interface LivrableNames {
  [key: number]: string
}

export default function SoumettrePage() {
  const searchParams = useSearchParams()
  const idEtudiant = searchParams.get("idEtudiant") || "4"
  const idGroupe = searchParams.get("idGroupe") || "2"

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [presentationFile, setPresentationFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedDocuments, setSubmittedDocuments] = useState<SubmittedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const livrableNames: LivrableNames = {
    1: "Document PDF",
    2: "Présentation",
  }

  const livrableIcons = {
    1: <FileText className="h-4 w-4" />,
    2: <FilePresentation className="h-4 w-4" />,
  }

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/livrable/documents?idEtudiant=${idEtudiant}`)
      if (response.ok) {
        const data = (await response.json()) as SubmittedDocument[]
        setSubmittedDocuments(data)
      } else {
        setFetchError("Impossible de récupérer les documents")
      }
    } catch (error) {
      setFetchError("Erreur lors de la récupération des documents")
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [idEtudiant])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      // Simulate progress for better UX
      setUploadProgress(0)
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 10
        })
      }, 100)
    }
  }

  const resetForm = () => {
    setPdfFile(null)
    setPresentationFile(null)
    setUploadProgress(0)
    const pdfInput = document.getElementById("pdf") as HTMLInputElement
    const presentationInput = document.getElementById("presentation") as HTMLInputElement
    if (pdfInput) pdfInput.value = ""
    if (presentationInput) presentationInput.value = ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitSuccess(false)
    setSubmitError(null)
    setIsSubmitting(true)
    setUploadProgress(0)

    if (!pdfFile || !presentationFile) {
      setSubmitError("Veuillez sélectionner les deux fichiers.")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append("files", pdfFile)
    formData.append("files", presentationFile)
    formData.append("idEtudiant", idEtudiant)
    formData.append("idGroupe", idGroupe)
    formData.append("livrables", JSON.stringify([1, 2]))

    try {
      const response = await fetch("http://localhost:5000/api/livrable/submit-documents", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setSubmitSuccess(true)
        resetForm()
        fetchDocuments()
      } else {
        const errorText = await response.text()
        setSubmitError(`Erreur lors de la soumission: ${errorText}`)
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setSubmitError("Erreur de connexion au serveur")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <CardHeader className="pb-6 border-b border-border/40">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Soumettre des documents
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Soumettez vos documents de projet pour évaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {submitSuccess && (
            <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle className="font-medium">Succès</AlertTitle>
              <AlertDescription>Documents soumis avec succès!</AlertDescription>
            </Alert>
          )}

          {submitError && (
            <Alert className="bg-destructive/10 text-destructive border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-medium">Erreur</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Documents Soumis</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDocuments}
                disabled={isLoading}
                className="h-8 hover:bg-primary/5 hover:text-primary"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-8 bg-muted/10 rounded-xl border border-border/40">
                <Loader className="h-5 w-5 animate-spin mr-2 text-primary" />
                <p className="text-muted-foreground">Chargement des documents...</p>
              </div>
            ) : fetchError ? (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            ) : submittedDocuments.length > 0 ? (
              <div className="space-y-3">
                {submittedDocuments.map((doc) => (
                  <div
                    key={`${doc.idPFE}-${doc.idLivrable}`}
                    className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/40 hover:shadow-md transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {doc.idLivrable in livrableIcons && livrableIcons[doc.idLivrable as keyof typeof livrableIcons]}
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium">{livrableNames[doc.idLivrable]}</span>
                        <Badge variant="secondary" className="ml-2">
                          Soumis
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <a href={`http://localhost:5000${doc.fichier}`} download>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-muted/10 rounded-xl border border-border/40">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">Aucun document soumis pour le moment.</p>
              </div>
            )}
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Soumettre de nouveaux documents</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {["pdf", "presentation"].map((type) => (
                <div key={type} className="space-y-2">
                  <Label htmlFor={type} className="flex items-center gap-2">
                    {type === "pdf" ? <FileText className="h-4 w-4" /> : <FilePresentation className="h-4 w-4" />}
                    {type === "pdf" ? "Document PDF" : "Présentation"}
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      id={type}
                      accept={type === "pdf" ? ".pdf" : ".ppt,.pptx,.key,.pdf"}
                      onChange={(e) => handleFileChange(e, type === "pdf" ? setPdfFile : setPresentationFile)}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90 cursor-pointer
                        border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    {((type === "pdf" && pdfFile) || (type === "presentation" && presentationFile)) && (
                      <>
                        <Badge className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary/10 text-primary border-primary/20 px-2">
                          {type === "pdf"
                            ? pdfFile?.name.length! > 20
                              ? `${pdfFile?.name.substring(0, 20)}...`
                              : pdfFile?.name
                            : presentationFile?.name.length! > 20
                              ? `${presentationFile?.name.substring(0, 20)}...`
                              : presentationFile?.name}
                        </Badge>
                        <Progress value={uploadProgress} className="h-1 absolute bottom-0 left-0 right-0" />
                      </>
                    )}
                  </div>
                </div>
              ))}

              <Button type="submit" className="w-full relative overflow-hidden group" disabled={isSubmitting} size="lg">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 
                  animate-shimmer -translate-x-full group-hover:translate-x-full transition-all duration-1000"
                />
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-5 w-5" />
                    Soumettre les documents
                  </>
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


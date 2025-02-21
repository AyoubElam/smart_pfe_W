/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Jury {
  idJury: number;
  nom: string;
  valideDeliberation: boolean;
}

export default function JuryList() {
  const [jurys, setJurys] = useState<Jury[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJury, setEditingJury] = useState<number | null>(null);
  const [deleteJuryId, setDeleteJuryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJurys = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/jurys");
        if (!response.ok) throw new Error("Failed to fetch jurys");
        const data = await response.json();
        setJurys(data);
      } catch (error) {
        setError("Failed to load jury list. Please try again later.");
        console.error("Error fetching jurors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJurys();
  }, []);

  const filteredJurys = jurys.filter((jury) =>
    jury.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteJuryId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/jurys/${deleteJuryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete jury");

      setJurys(jurys.filter((jury) => jury.idJury !== deleteJuryId));
      setDeleteJuryId(null);
    } catch (error) {
      console.error("Error deleting jury:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8 p-8 text-lg flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 p-8 text-lg text-center text-red-500">
        {error}
      </Card>
    );
  }

  return (
    <Card className="mt-8 p-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Liste des Jurys</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-6 w-6 text-gray-500" />
          <Input
            placeholder="Rechercher un jury..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table className="text-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl">Nom</TableHead>
              <TableHead className="text-xl w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJurys.map((jury) => (
              <TableRow key={jury.idJury}>
                <TableCell className="font-semibold text-lg">{jury.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="p-3"
                      onClick={() => setEditingJury(jury.idJury)}
                    >
                      <Edit className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="p-3"
                      onClick={() => setDeleteJuryId(jury.idJury)}
                    >
                      <Trash2 className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={deleteJuryId !== null} onOpenChange={() => setDeleteJuryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Êtes-vous sûr de vouloir supprimer ce jury ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-lg px-6 py-3">Annuler</AlertDialogCancel>
            <AlertDialogAction className="text-lg px-6 py-3 bg-red-500 hover:bg-red-600" onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

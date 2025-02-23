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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface JuryListProps {
  onDelete?: (id: number) => Promise<void>;
}

export default function JuryList({ onDelete }: JuryListProps) {
  const [jurys, setJurys] = useState<Jury[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteJuryId, setDeleteJuryId] = useState<number | null>(null);
  const [editJuryId, setEditJuryId] = useState<number | null>(null);
  const [editJuryData, setEditJuryData] = useState<{ nom: string } | null>(
    null
  );

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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load jury list."
        );
        console.error("Error fetching jurors:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJurys();
  }, []);

  const filteredJurys = jurys.filter((jury) =>
    jury.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (jury: Jury) => {
    setEditJuryId(jury.idJury);
    setEditJuryData({ nom: jury.nom });
  };

  const handleUpdateJury = async () => {
    if (!editJuryId || !editJuryData) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/jurys/${editJuryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: editJuryData.nom,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update jury");
      }

      setJurys((prevJurys) =>
        prevJurys.map((jury) =>
          jury.idJury === editJuryId ? { ...jury, nom: editJuryData.nom } : jury
        )
      );

      setEditJuryId(null);
      setEditJuryData(null);
    } catch (err) {
      console.error("Error updating jury:", err);
      alert(err instanceof Error ? err.message : "Une erreur s'est produite.");
    }
  };

  const handleDelete = async () => {
    if (!deleteJuryId) return;

    try {
      if (onDelete) {
        await onDelete(deleteJuryId);
      } else {
        const response = await fetch(
          `http://localhost:5000/api/jurys/${deleteJuryId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete jury");
        }
      }

      setJurys((prevJurys) =>
        prevJurys.filter((jury) => jury.idJury !== deleteJuryId)
      );
    } catch (err) {
      console.error("Error deleting jury:", err);
      alert(err instanceof Error ? err.message : "Une erreur s'est produite.");
    } finally {
      setDeleteJuryId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="flex justify-center items-center h-96">
          <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardContent className="p-8 text-2xl text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Liste des Jurys</CardTitle>
        <div className="relative mt-6">
          <Search className="absolute left-3 top-3 h-6 w-6 text-gray-500" />
          <Input
            placeholder="Rechercher un jury..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-xl"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg">Nom</TableHead>
              <TableHead className="w-48 text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJurys.map((jury) => (
              <TableRow key={jury.idJury}>
                <TableCell className="font-medium text-lg">
                  {jury.nom}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleEdit(jury)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setDeleteJuryId(jury.idJury)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editJuryId !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4 text-center">Edit Jury</h2>
              <div className="mb-4">
                <Input
                  type="text"
                  value={editJuryData?.nom || ""}
                  onChange={(e) => setEditJuryData({ nom: e.target.value })}
                  placeholder="Enter jury name"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  className="bg-blue-600 text-white w-28 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleUpdateJury}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="w-28 text-gray-600 hover:bg-gray-100"
                  onClick={() => setEditJuryId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <AlertDialog
          open={deleteJuryId !== null}
          onOpenChange={() => setDeleteJuryId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg">
                Êtes-vous sûr de vouloir supprimer ce jury ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-lg">Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-lg"
                onClick={handleDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

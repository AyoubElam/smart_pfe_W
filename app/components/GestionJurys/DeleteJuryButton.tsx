"use client";

interface DeleteJuryButtonProps {
  onDelete: () => void;
}

export default function DeleteJuryButton({ onDelete }: DeleteJuryButtonProps) {
  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce jury ?")) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700"
    >
      Supprimer
    </button>
  );
}
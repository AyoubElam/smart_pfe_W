"use client";

interface EditButtonProps {
  soutenanceId: number;
}

const EditButton = ({ soutenanceId }: EditButtonProps) => {
  const handleEdit = () => {
    // Add edit functionality here
    console.log(`Editing soutenance with ID: ${soutenanceId}`);
  };

  return (
    <button
      onClick={handleEdit}
      className="text-blue-500 hover:text-blue-700"
    >
      Modifier
    </button>
  );
};

export default EditButton;  
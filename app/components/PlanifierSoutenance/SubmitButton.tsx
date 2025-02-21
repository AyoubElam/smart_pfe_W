import { FaPlus } from "react-icons/fa";

interface SubmitButtonProps {
  onAddSoutenance: () => void;
}

const SubmitButton = ({ onAddSoutenance }: SubmitButtonProps) => {
  return (
    <button
      onClick={onAddSoutenance}
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 w-full"
    >
      <FaPlus /> Ajouter une Soutenance
    </button>
  );
};

export default SubmitButton;

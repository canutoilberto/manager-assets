import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
  onClick: () => void; // Função para abrir o modal
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="flex items-center">
      <Plus className="h-5 w-5" />
      Adicionar Item
    </Button>
  );
};

export default AddButton;

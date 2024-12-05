import { useState } from "react";
//import Header from "./components/Header";
import ResponsiveTable from "./components/ResponsiveTable";
import AddButton from "./components/AddButton";
import ItemModal from "./components/ItemModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  valor: number;
  dataAquisicao: string;
  vidaUtil: number;
  localizacao: string;
  estado: string;
  responsavel: string;
  status: string;
}

const initialItems: Item[] = [
  {
    id: "1",
    codigo: "PAT001",
    nome: "Laptop Dell XPS",
    categoria: "Equipamento de TI",
    valor: 5000,
    dataAquisicao: "2023-01-15",
    vidaUtil: 5,
    localizacao: "Escritório Principal",
    estado: "Bom",
    responsavel: "João Silva",
    status: "Ativo",
  },
  {
    id: "2",
    codigo: "PAT002",
    nome: "Mesa de Escritório",
    categoria: "Mobiliário",
    valor: 800,
    dataAquisicao: "2022-11-20",
    vidaUtil: 10,
    localizacao: "Sala de Reuniões",
    estado: "Excelente",
    responsavel: "Maria Santos",
    status: "Ativo",
  },
];

export default function App() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  const handleAddItem = (data: Omit<Item, "id">) => {
    const newItem = { ...data, id: uuidv4() };
    setItems([...items, newItem]);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (data: Item) => {
    setItems(items.map((item) => (item.id === data.id ? data : item)));
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = () => {
    if (currentItem) {
      setItems(items.filter((item) => item.id !== currentItem.id));
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Lista de Itens
            </h2>
            <AddButton onClick={() => setIsAddModalOpen(true)} />
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ResponsiveTable
              items={items}
              onEdit={(id) => {
                const itemToEdit = items.find((item) => item.id === id);
                if (itemToEdit) {
                  setCurrentItem(itemToEdit);
                  setIsEditModalOpen(true);
                }
              }}
              onDelete={(id) => {
                const itemToDelete = items.find((item) => item.id === id);
                if (itemToDelete) {
                  setCurrentItem(itemToDelete);
                  setIsDeleteDialogOpen(true);
                }
              }}
            />
          </div>
        </div>
      </main>

      <ItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
        title="Adicionar Item"
      />

      <ItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditItem}
        title="Editar Item"
        initialData={currentItem}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteItem}
        itemName={currentItem?.nome || ""}
      />
    </div>
  );
}

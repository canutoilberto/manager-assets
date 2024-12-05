import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/lib/assetStore";
import { useState } from "react";
import { Item } from "@/types/assetTypes";

interface AddButtonProps {
  defaultData?: Partial<Omit<Item, "id" | "codigo">>;
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ defaultData }) => {
  const { assets, fetchAssets, addAsset } = useAssetStore(); // Obtém os ativos, fetchAssets e addAsset do Zustand
  const [loading, setLoading] = useState(false);

  const handleAddItem = async () => {
    setLoading(true);

    try {
      // Garante que os itens estejam atualizados antes de calcular o próximo código
      await fetchAssets();

      // Calcula o próximo código no formato PATXXX
      const nextCodeNumber = assets.length + 1;
      const nextCode = `PAT${String(nextCodeNumber).padStart(3, "0")}`;

      // Adiciona o novo item ao banco
      await addAsset({
        codigo: nextCode,
        nome: defaultData?.nome || "Novo Item",
        categoria: defaultData?.categoria || "Categoria Padrão",
        valor: defaultData?.valor || 0,
        dataAquisicao: defaultData?.dataAquisicao || new Date().toISOString(),
        vidaUtil: defaultData?.vidaUtil || 1,
        localizacao: defaultData?.localizacao || "Localização Padrão",
        estado: defaultData?.estado || "Novo",
        responsavel: defaultData?.responsavel || "Responsável Padrão",
        status: defaultData?.status || "Ativo",
      });

      console.log("Item adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddItem}
      className="flex items-center"
      disabled={loading}
    >
      {loading ? (
        <span>Adicionando...</span>
      ) : (
        <>
          <Plus className="h-5 w-5" />
          Adicionar Item
        </>
      )}
    </Button>
  );
};

export default AddButton;

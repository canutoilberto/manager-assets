import React, { useEffect } from "react";
import { useAssetStore } from "@/lib/assetStore"; // Importa o store Zustand
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface ResponsiveTableProps {
  items: Item[]; // Adiciona 'items' como propriedade esperada
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Ativo":
      return <Badge className="bg-green-500 rounded-full">Ativo</Badge>;
    case "Em manutenção":
      return (
        <Badge className="bg-yellow-500 rounded-full">Em manutenção</Badge>
      );
    case "Inativo":
      return <Badge className="bg-red-500 rounded-full">Inativo</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  onEdit,
  onDelete,
}) => {
  const { assets, fetchAssets, loading, error } = useAssetStore();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Código",
              "Nome",
              "Categoria",
              "Valor",
              "Data Aquisição",
              "Vida Útil",
              "Localização",
              "Estado",
              "Responsável",
              "Status",
              "Ações",
            ].map((header) => (
              <TableHead
                key={header}
                className="px-6 py-3 text-center text-xs font-medium bg-gray-50 text-gray-900 uppercase tracking-wider"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.codigo}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.nome}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.categoria}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.dataAquisicao}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.vidaUtil} anos
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.localizacao}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.estado}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.responsavel}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {getStatusBadge(item.status)}
              </TableCell>
              <TableCell className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item.id)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsiveTable;

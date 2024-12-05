import { create } from "zustand";
import { db } from "@/database/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Definir a interface para um ativo
export interface Asset {
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
  createdAt: Date;
}

// Definir a interface para o estado do store
interface AssetStore {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => Promise<void>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

// Criar o store Zustand
export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  loading: false,
  error: null,

  // Buscar todos os ativos
  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "assets"));
      const assets = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        } as Asset;
      });
      set({ assets, loading: false });
    } catch (error) {
      set({ error: "Falha ao buscar ativos", loading: false });
      console.error("Erro ao buscar ativos:", error);
    }
  },

  // Adicionar um novo ativo
  addAsset: async (asset) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, "assets"), {
        ...asset,
        createdAt: serverTimestamp(),
      });
      const newAsset = {
        id: docRef.id,
        ...asset,
        createdAt: new Date(),
      };
      set((state) => ({ assets: [...state.assets, newAsset], loading: false }));
    } catch (error) {
      set({ error: "Falha ao adicionar ativo", loading: false });
      console.error("Erro ao adicionar ativo:", error);
    }
  },

  // Atualizar um ativo existente
  updateAsset: async (id, updatedAsset) => {
    set({ loading: true, error: null });
    try {
      const assetRef = doc(db, "assets", id);
      await updateDoc(assetRef, updatedAsset);
      set((state) => ({
        assets: state.assets.map((asset) =>
          asset.id === id ? { ...asset, ...updatedAsset } : asset
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Falha ao atualizar ativo", loading: false });
      console.error("Erro ao atualizar ativo:", error);
    }
  },

  // Excluir um ativo
  deleteAsset: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "assets", id));
      set((state) => ({
        assets: state.assets.filter((asset) => asset.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Falha ao excluir ativo", loading: false });
      console.error("Erro ao excluir ativo:", error);
    }
  },
}));

// Função auxiliar para buscar ativos por categoria
export const fetchAssetsByCategory = async (
  category: string
): Promise<Asset[]> => {
  try {
    const q = query(
      collection(db, "assets"),
      where("categoria", "==", category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      } as Asset;
    });
  } catch (error) {
    console.error("Erro ao buscar ativos por categoria:", error);
    throw new Error("Falha ao buscar ativos por categoria");
  }
};

import PocketBase from 'pocketbase';

// URL desde variables de entorno
export const PB_URL = import.meta.env.PUBLIC_POCKETBASE_URL;
export const pb = new PocketBase(PB_URL);

// Tipos para TypeScript 
export interface Product {
  id: string; // UUID generado por PocketBase
  originalId: string; // Tu ID original (buzo-algodon-rustico...)
  item: string;
  name: string;
  discountedPrice: number;
  listPrice: number;
  image: string;
  category: string;
  inStock: boolean;
  sizes: Array<{ size: string; quantity: number }>;
  created?: string;
  updated?: string;
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}
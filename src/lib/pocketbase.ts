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

export async function createOrder(cartItems: Product[], total: number,  userId: string) {
    const user = pb.authStore.record;
    
    if (!user) {
        throw new Error('Usuario no autenticado');
    }

    const orderData = {
        user: userId,
        status: 'pending',
        total: total,
        items: cartItems
    };

    try {
        const record = await pb.collection('orders').create(orderData);
        return record;
    } catch (error) {
        console.error('Error creando la orden:', error);
        throw error;
    }
}
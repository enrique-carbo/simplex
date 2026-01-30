import { pb } from '@/lib/pocketbase';
import type { Product } from '@/lib/pocketbase'; // Importa el tipo

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const filter = category ? `category = "${category}"` : '';
    return await pb.collection('products').getFullList<Product>({
      filter,
      sort: 'created'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await pb.collection('products').getOne<Product>(id);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// Para búsqueda (opcional)
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    return await pb.collection('products').getFullList<Product>({
      filter: `name ~ "${query}" || item ~ "${query}"`,
      sort: 'created'
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
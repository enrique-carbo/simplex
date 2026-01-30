// lib/products.ts - VERSIÓN COMPATIBLE CON CLOUDFLARE WORKERS
import type { Product } from '@/lib/pocketbase';

const POCKETBASE_URL = import.meta.env.PUBLIC_POCKETBASE_URL;

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const url = new URL(`${POCKETBASE_URL}/api/collections/products/records`);
    url.searchParams.set('sort', 'created'); // 'created' ascendente, '-created' descendente
    
    if (category) {
      url.searchParams.set('filter', `category="${category}"`);
    }
    
    console.log(`[SSR] Fetching products from: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Astro-SSR/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`[SSR] Fetch failed: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`[SSR] Found ${data.totalItems} total products, ${data.items?.length || 0} items`);
    
    return data.items || [];
    
  } catch (error) {
    console.error('[SSR] Error fetching products:', error);
    return [];
  }
}

// También actualiza getProductById para consistencia
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/products/records/${id}`
    );
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}
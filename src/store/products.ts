import { atom, map } from 'nanostores';
import type { Product } from '@/lib/pocketbase';

// Store para todos los productos
export const allProducts = atom<Product[]>([]);

// Store para estado de carga
export const productsLoading = atom(true);
export const productsError = atom<string | null>(null);

// Store cacheado por categoría
const productsByCategory = map<Record<string, Product[]>>({});

// Clave para localStorage
const STORAGE_KEY = 'simplex_products_cache_v1';

// Función para cargar TODOS los productos una sola vez
export async function loadAllProducts(): Promise<Product[]> {
  // Si ya están cargados, devolver
  const currentProducts = allProducts.get();
  if (currentProducts.length > 0 && !productsLoading.get()) {
    return currentProducts;
  }

  try {
    productsLoading.set(true);
    productsError.set(null);
    
    console.log('🔄 Cargando productos desde API...');
    
    // 1. Intentar desde localStorage (cache)
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const oneHourAgo = Date.now() - 3600000; // 1 hora de cache
        
        if (parsed.timestamp > oneHourAgo && parsed.data?.length > 0) {
          console.log(`📦 ${parsed.data.length} productos cargados desde cache`);
          allProducts.set(parsed.data);
          productsLoading.set(false);
          return parsed.data;
        }
      } catch (e) {
        console.log('Cache inválido, cargando desde API...');
      }
    }

    // 2. Cargar desde API
    const url = `${import.meta.env.PUBLIC_POCKETBASE_URL}/api/collections/products/records?perPage=500`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const products = data.items || [];
    
    console.log(`✅ ${products.length} productos cargados desde API`);
    
    // Guardar en store
    allProducts.set(products);
    
    // Guardar en localStorage con timestamp
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: products,
      timestamp: Date.now(),
      version: 'v1'
    }));
    
    return products;
    
  } catch (error) {
    const errorMsg = error.message || 'Error desconocido';
    console.error('❌ Error cargando productos:', errorMsg);
    productsError.set(errorMsg);
    
    // Intentar fallback a cache aunque sea viejo
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data?.length > 0) {
          console.log('🔄 Usando cache viejo como fallback');
          allProducts.set(parsed.data);
          return parsed.data;
        }
      }
    } catch (e) {
      // No hay cache disponible
    }
    
    return [];
    
  } finally {
    productsLoading.set(false);
  }
}

// Función para obtener productos por categoría (desde cache o store)
export function getProductsByCategory(category: string): Product[] {
  const all = allProducts.get();
  
  if (all.length === 0) return [];
  
  // Normalizar categoría (case-insensitive)
  const normalizedCategory = category.toLowerCase();
  
  // Verificar cache
  const cached = productsByCategory.get()[normalizedCategory];
  if (cached) return cached;
  
  // Filtrar (case-insensitive)
  const filtered = all.filter(p => 
    p.category?.toLowerCase() === normalizedCategory
  );
  
  // Cachear resultado
  productsByCategory.setKey(normalizedCategory, filtered);
  
  return filtered;
}

// Función para limpiar cache
export function clearProductsCache(): void {
  allProducts.set([]);
  productsByCategory.set({});
  localStorage.removeItem(STORAGE_KEY);
  console.log('🧹 Cache de productos limpiado');
}

// Función para forzar recarga (ignorar cache)
export async function refreshProducts(): Promise<Product[]> {
  clearProductsCache();
  return await loadAllProducts();
}
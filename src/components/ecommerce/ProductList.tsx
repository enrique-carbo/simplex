// components/ecommerce/ProductList.tsx - VERSIÓN CON LÍMITE DE 1 HORA
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/pocketbase';

const POCKETBASE_URL = import.meta.env.PUBLIC_POCKETBASE_URL || 'https://pb.simplex.ar';

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setDebug('Buscando productos...');
        
        // 1. Intentar desde localStorage CON LA CLAVE CORRECTA
        const cacheKey = 'simplex_products_cache_v1';
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            console.log('📦 Cache encontrado:', parsed.data?.length, 'productos');
            
            // ⭐⭐ VERIFICACIÓN DE TIEMPO DEL CACHE (1 HORA) ⭐⭐
            const cacheAge = Date.now() - parsed.timestamp;
            const ONE_HOUR = 60 * 60 * 1000; // 1 hora en milisegundos
            
            if (cacheAge < ONE_HOUR && parsed.data?.length > 0) {
              // Cache válido (menos de 1 hora)
              const allCategories = [...new Set(parsed.data?.map((p: Product) => p.category) || [])];
              console.log('🏷️ Categorías en cache:', allCategories);
              
              // Filtrar (case-insensitive)
              const filtered = parsed.data.filter((p: Product) => 
                p.category && p.category.toLowerCase() === category.toLowerCase()
              );
              
              console.log(`🎯 Productos en "${category}":`, filtered.length);
              
              if (filtered.length > 0) {
                setProducts(filtered);
                setDebug(`${filtered.length} productos encontrados en cache (${Math.round(cacheAge/60000)} min)`);
                setLoading(false);
                return;
              } else {
                setDebug(`0 productos en "${category}". Categorías disponibles: ${allCategories.join(', ')}`);
              }
            } else {
              // Cache expirado (> 1 hora) o vacío
              console.log(`🕐 Cache expirado (${Math.round(cacheAge/60000)} min > 60 min)`);
              setDebug('Cache expirado, recargando...');
              // Continúa para cargar desde API
            }
          } catch (e) {
            console.log('❌ Cache inválido:', e);
            setDebug('Cache inválido');
          }
        }

        // 2. Si no hay cache válido (< 1 hora), cargar desde API
        setDebug('Cargando desde API...');
        console.log('🔄 Cargando desde API');
        
        const url = `${POCKETBASE_URL}/api/collections/products/records?perPage=100`;
        console.log('📡 Fetch URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const allProducts = data.items || [];
        
        console.log(`✅ ${allProducts.length} productos cargados desde API`);
        
        // Ver todas las categorías
        const allCategories = [...new Set(allProducts.map((p: Product) => p.category))];
        console.log('🏷️ Todas las categorías:', allCategories);
        
        // Guardar en localStorage CON CLAVE CORRECTA
        localStorage.setItem('simplex_products_cache_v1', JSON.stringify({
          data: allProducts,
          timestamp: Date.now()
        }));
        
        // Filtrar
        const filtered = allProducts.filter((p: Product) => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
        
        console.log(`🎯 Filtrados para "${category}":`, filtered.length);
        setDebug(`${filtered.length} productos cargados`);
        setProducts(filtered);
        
      } catch (error) {
        console.error('❌ Error:', error);
        setDebug('Error cargando productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  // Estados UI
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <p className="text-gray-500">Cargando productos...</p>
        <p className="text-sm text-gray-400 mt-1">{debug}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 text-lg mb-2">No hay productos en "{category}"</p>
        <p className="text-sm text-gray-400 mb-4">{debug}</p>
        <button 
          onClick={() => {
            localStorage.removeItem('simplex_products_cache_v1');
            window.location.reload();
          }}
          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Limpiar cache y recargar
        </button>
      </div>
    );
  }

  // Renderizado de productos (igual que antes)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 mb-10">
      {products.map((product) => {
        const discountPercentage = (
          ((product.listPrice - product.discountedPrice) / product.listPrice) * 100
        ).toFixed(0);

        return (
          <Card
            key={product.id}
            className="p-4 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 relative"
            onClick={() => {
              window.location.href = `/product/${product.originalId || product.id}`;
            }}
          >
            {product.discountedPrice < product.listPrice && (
              <Badge className="absolute top-2 left-2 text-red-500 bg-white border-red-500 dark:text-white dark:bg-red-500 z-10">  
                {discountPercentage}% OFF
              </Badge>
            )}
            <CardContent>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-contain" 
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-xl font-medium mb-2">
                  Art-{product.item}: 
                  <span className='font-semibold'> {product.name}</span>
                </h2>
                <div className="flex">
                  <p className="text-gray-900 dark:text-white text-xl font-medium">
                    ${product.discountedPrice.toFixed(2)}
                  </p>
                  {product.discountedPrice < product.listPrice && (
                    <p className="ml-4 line-through text-gray-500">
                      ${product.listPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                {product.inStock ? (
                  <p className="text-green-500">Disponible</p>
                ) : (
                  <p className="text-red-500">Sin stock</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.sizes
                    ?.filter(size => size.quantity > 0)
                    .map(size => (
                      <span 
                        key={size.size}
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        {size.size}
                      </span>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductList;
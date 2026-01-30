// components/ecommerce/ProductList.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/pocketbase'; 

interface ProductListProps {
  products?: Product[];  
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // 1. VALIDACIÓN INICIAL
  if (!products || !Array.isArray(products)) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Cargando productos...</p>
        <p className="text-sm text-gray-400 mt-2">
          {products === undefined ? 'Sin datos' : 'Formato inválido'}
        </p>
      </div>
    );
  }

  // 2. ARRAY VACÍO
  if (products.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">No hay productos en esta categoría.</p>
      </div>
    );
  }
  
  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.originalId}`;
  };

  // Ya no necesitas filteredProducts porque vienen filtrados desde Astro
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 mb-10">
      {products.map((product) => {
        const discountPercentage = (
          ((product.listPrice - product.discountedPrice) / product.listPrice) * 100
        ).toFixed(0);

        return (
          <Card
            key={product.id} // Usar UUID de PocketBase
            className="p-4 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 relative"
            onClick={() => handleProductClick(product)}
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
                {/* Mostrar tallas disponibles */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.sizes
                    .filter(size => size.quantity > 0)
                    .map(size => (
                      <span 
                        key={size.size}
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        {size.size}
                      </span>
                    ))
                  }
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
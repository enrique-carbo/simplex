// components/ecommerce/ProductList.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { availableProducts } from '@/assets/data/products/products';

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const filteredProducts = availableProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());

  if (filteredProducts.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No hay productos en "{category}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:mx-10">
      {filteredProducts.map((product) => {
        const hasDiscount = product.discountedPrice < product.listPrice;
        const discountPercent = hasDiscount
          ? Math.round(((product.listPrice - product.discountedPrice) / product.listPrice) * 100)
          : 0;

        return (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-md cursor-pointer border"
            onClick={() => (window.location.href = `/product/${product.id}`)}
          >
            {/* Imagen */}
            <div className="aspect-square bg-gray-50 p-2 relative">
              <img 
                src={product.image} alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105" loading="lazy" />
              {hasDiscount && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">-{discountPercent}%</span>
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-3 space-y-2">
              {/* Precios */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">${product.listPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Nombre */}
              <p className="text-sm font-medium line-clamp-2 h-10 text-gray-800">{product.name}</p>

              {/* Referencia */}
              <p className="text-xs text-gray-500">Art-{product.item}</p>

              {/* Stock y talles */}
              <div className="flex items-center justify-between pt-1 border-t">
                <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? '✔ Stock' : 'Agotado'}
                </span>
                <div className="flex gap-1">
                  {product.sizes?.filter((s) => s.quantity > 0)
                    .map((size) => (
                      <span key={size.size} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                        {size.size}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductList;

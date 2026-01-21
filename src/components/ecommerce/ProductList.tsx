import React from 'react';
import { availableProducts, type Product } from '@/assets/data/products/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductListProps {
  category: string;
  isLoggedIn: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ category, isLoggedIn }) => {
  const handleProductClick = (product: Product) => {
    // Si no está logueado, redirigir
    if (!isLoggedIn) {
      window.location.href = '/auth/login';
      // window.location.href = `/auth/login?redirect=/product/${product.id}`;
      return;
    }
    // Si está logueado, ir al producto
    window.location.href = `/product/${product.id}`;
  };

  const filteredProducts = availableProducts.filter((product) => product.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 mb-10">
      {filteredProducts.map((product) => {
        const discountPercentage = (
          ((product.listPrice - product.discountedPrice) / product.listPrice) * 100
        ).toFixed(0);

        return (
          <Card
            key={product.id}
            className="p-4 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 relative"
            onClick={() => handleProductClick(product)}
          >
            {product.discountedPrice < product.listPrice && (
              <Badge className="absolute top-2 left-2 text-red-500 bg-white border-red-500 dark:text-white dark:bg-red-500 z-10">  
                {discountPercentage}% OFF
              </Badge>
            )}
            <CardContent>
              <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
              <div className="p-4">
                <h2 className="text-xl font-medium mb-2">Art-{product.item}: 
                <span className='font-semibold'> {product.name}</span>
                </h2>
                <div className="flex">
                  <p className="text-gray-900 dark:text-white text-xl font-medium">${product.discountedPrice.toFixed(2)}</p>
                  {product.discountedPrice < product.listPrice && (
                    <p className="ml-4 line-through text-gray-500">${product.listPrice.toFixed(2)}</p>
                  )}
                </div>
                {product.inStock ? (
                  <p className="text-green-500">Disponible</p>
                ) : (
                  <p className="text-red-500">Sin stock</p>
                )}
              </div>
              <div className="p-1">
                {!isLoggedIn && <p className="text-xs text-muted-foreground italic m-1">Inicia sesión para ver detalle</p>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductList;
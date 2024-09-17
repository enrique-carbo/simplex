import React from 'react';
import { availableProducts, type Product } from '@/assets/data/products';

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ( {category} ) => {
  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.id}`;
  };

const filteredProducts = availableProducts.filter((product) => product.category === category);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 mb-10">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-slate-100 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
          onClick={() => handleProductClick(product)}
        >
          <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
          <div className="p-4">
            <h2 className="text-xl text-black font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
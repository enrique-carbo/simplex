import React from 'react';
import { availableSales } from '@/assets/data/sales/sales';
import { Card, CardContent } from '@/components/ui/card';


const SalesList: React.FC = () => {
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 mb-10">
      {availableSales.map((sale) => (
        <Card 
        key={sale.id}
        className="p-4 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
        >
        <CardContent>  
        
          <img src={sale.image} alt={sale.name} className="w-full h-48 object-contain" />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">OFERTA: {sale.name}</h2>
            <p>${sale.price.toFixed(2)}</p>
            {sale.inStock ? (
                <p className="text-green-500">Disponible</p>
              ) : (
                <p className="text-red-500">Sin stock</p>
              )}
          </div>
        
        </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalesList;
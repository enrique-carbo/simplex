import React from 'react';
import { availableSales } from '@/assets/data/sales/sales';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SalesList: React.FC = () => {
  return (
    <div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {availableSales.map((sale) => {
          const discountPercentage = (
            ((sale.listPrice - sale.discountedPrice) / sale.listPrice) * 100
          ).toFixed(0);

          return (
            <Card
              key={sale.id}
              className="p-4 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 relative"
            >
              {sale.discountedPrice < sale.listPrice && (
                <Badge className="absolute top-2 left-2 text-red-500 bg-white border-red-500 dark:text-white dark:bg-red-500 z-10">
                  {discountPercentage}% OFF
                </Badge>
              )}

              <CardContent>
                <img src={sale.image} alt={sale.name} className="w-full h-48 object-contain" />
                <div className="p-4">
                  <h2 className="text-xl font-medium mb-2">Art-{sale.item}:  
                  <span className='font-semibold'> {sale.name}</span>
                  </h2>
                  <div className="flex">
                    <p className="text-gray-900 dark:text-white text-xl font-medium">${sale.discountedPrice.toFixed(2)}</p>
                    {sale.discountedPrice < sale.listPrice && (
                      <p className="ml-4 line-through text-gray-500">${sale.listPrice.toFixed(2)}</p>
                    )}
                  </div>
                  {sale.inStock ? (
                    <p className="text-green-500">Disponible</p>
                  ) : (
                    <p className="text-red-500">Sin stock</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default SalesList;
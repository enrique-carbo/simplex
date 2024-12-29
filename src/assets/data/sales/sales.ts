export interface Sales {
  id: string;
  item: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

import salesData from './sales.json';

export const availableSales: Sales[] = salesData;
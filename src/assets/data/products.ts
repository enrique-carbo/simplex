export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

import productsData from './products.json';

export const availableProducts: Product[] = productsData;
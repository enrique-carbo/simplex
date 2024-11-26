export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  sizes: { "size": string, "quantity": number }[];
}

import productsData from './products.json';

export const availableProducts: Product[] = productsData;
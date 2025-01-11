export interface Product {
  id: string;
  item: string;
  name: string;
  discountedPrice: number;
  listPrice: number;
  image: string;
  category: string;
  inStock: boolean;
  sizes: { "size": string, "quantity": number }[];
}

import productsData from './products.json';

export const availableProducts: Product[] = productsData;
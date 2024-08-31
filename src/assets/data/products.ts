export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const availableProducts: Product[] = [
  { id: 1, name: 'Producto 1', price: 20, image: '/images/products/hoodie.jpg', category: 'buzos' },
  { id: 2, name: 'Producto 2', price: 20, image: '/images/products/hoodie.webp', category: 'buzos' },
  { id: 3, name: 'Producto 3', price: 10, image: '/images/products/white-t-shirt.jpg', category: 'remeras' },
  { id: 4, name: 'Producto 4', price: 10, image: '/images/products/white-t-shirt.jpg', category: 'remeras' },
  { id: 5, name: 'Producto 5', price: 10, image: '/images/products/white-t-shirt-1.jpg', category: 'remeras' },
  { id: 6, name: 'Producto 6', price: 10, image: '/images/products/white-t-shirt-1.jpg', category: 'remeras' },
  { id: 7, name: 'Producto 7', price: 25, image: '/images/products/jeans.webp', category: 'pantalones' },
  { id: 8, name: 'Producto 8', price: 25, image: '/images/products/pantalon.webp', category: 'pantalones' },
  { id: 9, name: 'Producto 9', price: 20, image: '/images/products/Jogging.webp', category: 'pantalones' },
];

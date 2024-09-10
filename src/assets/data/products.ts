export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const availableProducts: Product[] = [
  { id: 1, name: 'Producto 1', 
    price: 39000, image: '/images/products/hoodie.jpg', 
    category: 'buzos' },
  { id: 2, name: 'Producto 2', price: 39000, image: '/images/products/hoodie.webp', category: 'buzos' },
  { id: 3, name: 'Producto 3', price: 6900, image: '/images/products/remera-gris.jpg', category: 'remeras' },
  { id: 4, name: 'Producto 4', price: 6900, image: '/images/products/remera-negra.jpg', category: 'remeras' },
  { id: 5, name: 'Producto 5', price: 9900, image: '/images/products/white-t-shirt-1.jpg', category: 'remeras' },
  { id: 6, name: 'Producto 6', price: 9900, image: '/images/products/white-t-shirt-1.jpg', category: 'remeras' },
  { id: 7, name: 'Producto 7', price: 35000, image: '/images/products/jeans.webp', category: 'pantalones' },
  { id: 8, name: 'Producto 8', price: 35000, image: '/images/products/pantalon.webp', category: 'pantalones' },
  { id: 9, name: 'Producto 9', price: 20000, image: '/images/products/Jogging.webp', category: 'pantalones' },
  { id: 10, name: 'Producto 10', price: 9900, image: '/images/products/mini-bag.jpg', category: 'bags' },
  { id: 11, name: 'Producto 11', price: 11900, image: '/images/products/morral-gris.jpg', category: 'bags' },
  { id: 12, name: 'Producto 12', price: 11900, image: '/images/products/morral-negro-red.jpg', category: 'bags' },
  { id: 13, name: 'Producto 13', price: 4900, image: '/images/products/boxer.jpg', category: 'accesorios' },
  { id: 14, name: 'Producto 14', price: 3900, image: '/images/products/gorra.jpg', category: 'accesorios' },
  { id: 15, name: 'Producto 15', price: 2900, image: '/images/products/medias-2.jpg', category: 'accesorios' },
];

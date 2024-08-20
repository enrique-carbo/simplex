export interface Product {
    id: number;
    name: string;
    price: number;
}

export const availableProducts: Product[] = [
    { id: 1, name: "Producto 1", price: 10 },
    { id: 2, name: "Producto 2", price: 15 },
    { id: 3, name: "Producto 3", price: 20 },
    { id: 4, name: "Producto 4", price: 20 },
    { id: 5, name: "Producto 5", price: 20 },
];
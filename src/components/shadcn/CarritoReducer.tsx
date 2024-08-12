import React, { useReducer, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const availableProducts: Product[] = [
  { id: 1, name: "Producto 1", price: 10 },
  { id: 2, name: "Producto 2", price: 15 },
  { id: 3, name: "Producto 3", price: 20 },
  { id: 4, name: "Producto 4", price: 20 },
  { id: 5, name: "Producto 5", price: 20 },
];

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartState {
  items: CartItem[];
  total: number;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      newState = { items: newItems, total: newTotal };
      break;
    }
    case 'REMOVE_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload);
      let newItems;
      if (existingItem && existingItem.quantity > 1) {
        newItems = state.items.map(item =>
          item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        newItems = state.items.filter(item => item.id !== action.payload);
      }
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      newState = { items: newItems, total: newTotal };
      break;
    }
    case 'CLEAR_CART':
      newState = { items: [], total: 0 };
      break;
    case 'LOAD_CART':
      newState = action.payload;
      break;
    default:
      return state;
  }
  
  // Guardar el nuevo estado en localStorage
  localStorage.setItem('cart', JSON.stringify(newState));
  return newState;
}

function Carrito() {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    // Cargar el carrito desde localStorage al montar el componente
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return(
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Carrito ({getTotalItems()})</Button>    
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[540px] flex-grow overflow-y-auto">

        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            Productos en tu carrito
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <h3 className="mb-2 font-bold">Productos disponibles:</h3>
          {availableProducts.map((product) => (
            <div key={product.id} className="flex justify-between items-center mb-2">
              <span>{product.name} - ${product.price}</span>
              <Button size="sm" className="text-white" onClick={() => addToCart(product)}>Agregar</Button>
            </div>
          ))}
        </div>

        <div className="py-4">
          <h3 className="mb-2 font-bold">Tu carrito:</h3>
          {cartState.items.length > 0 ? (
          cartState.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name} - ${item.price} x {item.quantity}</span>
              <div>
                <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="outline" size="sm" onClick={() => addToCart(item)}>+</Button>
              </div>
            </div>
          ))) : (
            <p className="text-gray-500 italic">está vacío</p>
          )}
        </div>
       
        <div className="mt-auto py-4 border-t">
          <h3 className="font-bold">Total: ${cartState.total}</h3>
          {cartState.items.length > 0 && (
          <div className="py-4">
            <Button variant="destructive" onClick={clearCart}>
              Vaciar
            </Button>
          </div>
        )}
        </div>
        
      </SheetContent>
    </Sheet>
  )
}

export default Carrito;
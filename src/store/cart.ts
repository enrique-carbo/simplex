import { atom, computed } from 'nanostores'
import type { Product } from '@/assets/data/products'

export type CartItem = Product & { quantity: number }

const CART_STORAGE_KEY = 'cartItems'

// Función para obtener el carrito inicial desde localStorage
function getInitialCartItems(): CartItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Esto solo se ejecutará en el cliente
    const savedItems = localStorage.getItem(CART_STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  }
  return [];
}

// Inicializar el estado del carrito
export const $cartItems = atom<CartItem[]>(getInitialCartItems());

export const $cartTotal = computed($cartItems, items => 
  items.reduce((total, item) => total + item.price * item.quantity, 0)
)

function updateLocalStorage(cartItems: CartItem[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }
}

export function addToCart(product: Product) {
  const currentItems = $cartItems.get();
  const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

  if (existingItemIndex !== -1) {
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + 1
    };
    $cartItems.set(updatedItems);
  } else {
    $cartItems.set([...currentItems, { ...product, quantity: 1 }]);
  }

  updateLocalStorage($cartItems.get());
}

export function removeFromCart(productId: number) {
  const items = $cartItems.get();
  const itemIndex = items.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const newItems = [...items];
    if (newItems[itemIndex].quantity > 1) {
      newItems[itemIndex] = { ...newItems[itemIndex], quantity: newItems[itemIndex].quantity - 1 };
    } else {
      newItems.splice(itemIndex, 1);
    }
    $cartItems.set(newItems);
  }

  updateLocalStorage($cartItems.get());
}

export function clearCart() {
  $cartItems.set([]);
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(CART_STORAGE_KEY); // Limpiar el carrito de localStorage
  }
}

// Sincronizar el estado inicial con localStorage cuando el script se carga en el cliente
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const savedItems = getInitialCartItems();
    $cartItems.set(savedItems);
  });
}
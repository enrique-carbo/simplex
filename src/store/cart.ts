import { atom, computed } from 'nanostores';
import type { Product } from '@/assets/data/products';

export interface CartItem extends Product {
  size: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'cartItems';

// Function to get the initial cart items from localStorage
function getInitialCartItems(): CartItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    // This will only run on the client
    const savedItems = localStorage.getItem(CART_STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  }
  return [];
}

// Initialize the cart state
export const $cartItems = atom<CartItem[]>(getInitialCartItems());

export const $cartTotal = computed($cartItems, items =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

function updateLocalStorage(cartItems: CartItem[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }
}

export function addToCart(product: Product, size: string) {
  const currentItems = $cartItems.get();
  const existingItemIndex = currentItems.findIndex(
    item => item.id === product.id && item.size === size
  );

  if (existingItemIndex !== -1) {
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + 1
    };
    $cartItems.set(updatedItems);
  } else {
    $cartItems.set([
      ...currentItems,
      { ...product, size, quantity: 1 }
    ]);
  }

  updateLocalStorage($cartItems.get());
}

export function removeFromCart(productId: string, size: string) {
  const items = $cartItems.get();
  const itemIndex = items.findIndex(item => item.id === productId && item.size === size);
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
    localStorage.removeItem(CART_STORAGE_KEY); // Clear the cart from localStorage
  }
}

// Synchronize the initial state with localStorage when the script loads on the client
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const savedItems = getInitialCartItems();
    $cartItems.set(savedItems);
  });
}
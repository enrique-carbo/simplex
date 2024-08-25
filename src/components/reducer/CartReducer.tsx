import type { CartAction, CartState } from "@/types";


function CartReducer(state: CartState, action: CartAction): CartState {
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

  export default CartReducer
import { useStore } from '@nanostores/react'
import { $cartItems, addToCart} from '@/store/cart'
import { Button } from "@/components/ui/button"
import { type Product } from "@/assets/data/products"


interface ButtonAddToCartProps {
    product: Product;
  }
  
  function ButtonAddToCart({ product }: ButtonAddToCartProps) {
    const cartItems = useStore($cartItems);

    const handleAddToCart = () => {
      addToCart(product);
    };
  
    const itemInCart = cartItems.find(item => item.id === product.id);
  
    return (
      <Button 
        size="sm" 
        className="text-white" 
        onClick={handleAddToCart}
        disabled={!product.inStock}
      >
        {!product.inStock ? 'Sin stock' : (itemInCart ? `En carrito (${itemInCart.quantity})` : 'Agregar al carrito')}
      </Button>
    );
  }

export default ButtonAddToCart
import { useStore } from '@nanostores/react';
import { $cartItems, addToCart } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { type Product } from '@/assets/data/products/products';

interface ButtonAddToCartProps {
  product: Product;
}

function ButtonAddToCart({ product }: ButtonAddToCartProps) {
  const cartItems = useStore($cartItems);

  const handleAddToCart = (size: string) => {
    addToCart(product, size);
  };

  const getQuantityInCart = (size: string) => {
    const item = cartItems.find(item => item.id === product.id && item.size === size);
    return item ? item.quantity : 0;
  };

  return (
    <div>
      {product.inStock ? (
        <div>
          {product.sizes.map(sizeOption => (
            <Button
              key={sizeOption.size}
              size="sm"
              className="text-white m-1"
              onClick={() => handleAddToCart(sizeOption.size)}
              disabled={sizeOption.quantity === 0}
            >
              {sizeOption.quantity === 0 ? 'Sin stock' : `Agregar ${sizeOption.size} (${getQuantityInCart(sizeOption.size)})`}
            </Button>
            ))}
        </div>
      ) : (
        <Button size="sm" className="text-white" disabled>
          Sin stock
        </Button>
      )}
    </div>
  );
}

export default ButtonAddToCart;
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, addToCart, removeFromCart, clearCart } from '@/store/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { availableProducts, type Product } from '@/assets/data/products';

function CarritoNanostore() {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Carrito ({getTotalItems()})</Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[540px] flex-grow overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito de Compras Nanostore</SheetTitle>
          <SheetDescription>Productos en tu carrito</SheetDescription>
        </SheetHeader>

        <div className="py-4" style={{ display: 'none' }}>
          <h3 className="mb-2 font-bold">Productos disponibles:</h3>
          {availableProducts.map((product) => (
            <div key={product.id.toString()} className="flex justify-between items-center mb-2">
              <span>
                {product.name} - ${product.price}
              </span>
              <Button size="sm" className="text-white" onClick={() => addToCart(product)}>
                Agregar
              </Button>
            </div>
          ))}
        </div>

        <div className="py-4">
          <h3 className="mb-2 font-bold">Tu carrito:</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id.toString()} className="flex justify-between items-center mb-2">
                <span>
                  {item.name} - ${item.price} x {item.quantity}
                </span>
                <div>
                  <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                    +
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">está vacío</p>
          )}
        </div>
        <div className="mt-auto py-4 border-t">
          <h3 className="font-bold">Total: ${total.toFixed(2)}</h3>
          {cartItems.length > 0 && (
            <div className="py-4">
              <Button variant="destructive" onClick={clearCart}>
                Vaciar
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CarritoNanostore;

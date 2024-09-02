import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, addToCart, removeFromCart, clearCart } from '@/store/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { availableProducts } from '@/assets/data/products';

import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from '@/components/ecommerce/PDFDocument';

function CarritoNanostore() {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (isLoading) {
    return <Button variant="outline">Cargando...</Button>;
  }

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
            cartItems.map((item) => {
              const subtotal = item.price * item.quantity; // Calcular subtotal
              return (
                <div key={item.id.toString()} className="block md:flex justify-between items-center mb-2 border-t p-2">
                  <span>
                    {item.name} - ${item.price} x {item.quantity}
                  </span>
                  <div className='p-2'>
                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                      +
                    </Button>
                    <span className='p-2'>
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                </div>
              );
            })
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

              <PDFDownloadLink
                document={<PDFDocument cartItems={cartItems} total={total} />}
                fileName="resumen-compra.pdf"
              >
                {({ blob, url, loading, error }) => (
                  <Button variant="outline" disabled={loading} className="ml-2">
                    {loading ? 'Generando PDF...' : 'Descargar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CarritoNanostore;

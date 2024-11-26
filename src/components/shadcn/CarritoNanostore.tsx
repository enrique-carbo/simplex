import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, addToCart, removeFromCart, clearCart } from '@/store/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from '@/components/ecommerce/PDFDocument';

function CarritoNanostore() {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleFinishPurchase = () => {
    // Additional logic to process the purchase can be added here
    setIsCheckoutComplete(true);
  };

  const handlePdfDownload = () => {
    setTimeout(() => {
      clearCart();
      setIsCheckoutComplete(false); // Reset the variable
    }, 2000);
  };

  const handleClearCart = () => {
    clearCart();
    setIsCheckoutComplete(false);
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
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>Productos en tu carrito</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <h3 className="mb-2 font-bold">Tu carrito:</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const subtotal = item.price * item.quantity; // Calculate subtotal
              return (
                <div key={item.id + item.size} className="block md:flex justify-between items-center mb-2 border-t p-2">
                  <div className="flex items-center">
                    <span>
                      {item.name} - {item.size} - ${item.price}
                    </span>
                  </div>
                  <div className="flex items-center p-2">
                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id, item.size)}>
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => addToCart(item, item.size)}>
                      +
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <span className="p-2 font-semibold text-slate-800">{subtotal}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic">está vacío</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-auto py-4 border-t-4 border-t-blue-700">
            <h3 className="font-bold text-xl text-right">Total: $ {total}</h3>
            <div className="mt-10 py-4 flex justify-end">
              <Button variant="destructive" onClick={handleClearCart}>
                Vaciar
              </Button>
              {!isCheckoutComplete ? (
                <Button onClick={handleFinishPurchase} className="ml-1 text-white">
                  Finalizar Compra
                </Button>
              ) : (
                <PDFDownloadLink
                  document={<PDFDocument cartItems={cartItems} total={total} />}
                  fileName="resumen-compra.pdf"
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      className="ml-1"
                      variant="outline"
                      disabled={loading}
                      onClick={handlePdfDownload}
                    >
                      {loading ? 'Generando PDF...' : 'Descargar PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CarritoNanostore;
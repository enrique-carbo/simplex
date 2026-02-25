import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, clearCart, removeFromCart, addToCart } from '@/store/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NumberFlow from '@number-flow/react';

// 🟢 CAMBIO 1: Añadir isLoggedIn a las props
interface CarritoNanostoreProps {
  userId: string | null;
  isLoggedIn?: boolean; // 👈 NUEVA PROP (opcional para compatibilidad)
}

// 🟢 CAMBIO 2: Recibir isLoggedIn
function CarritoNanostorePocketbase({ isLoggedIn = false }: CarritoNanostoreProps) {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // 🟢 CAMBIO 3: Usar isLoggedIn en validación (más eficiente)
  const handleFinishPurchase = async () => {
    // Usar isLoggedIn en lugar de !userId
    if (!isLoggedIn) {
      // 👈 CAMBIADO
      setOrderError('Debes iniciar sesión para finalizar la compra');
      setTimeout(() => setOrderError(null), 3000);
      return;
    }

    if (cartItems.length === 0) return;

    setIsProcessingOrder(true);
    setOrderError(null);

    try {
      // 🟢 CAMBIO 4: NO enviar userId en el body (confiamos en cookie)
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Las cookies se envían automáticamente
        },
        body: JSON.stringify({
          cartItems,
          total,
          // userId NO se envía 👈
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      if (result.success) {
        clearCart();
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setOrderError(error.message || 'No se pudo crear el pedido.');
      setTimeout(() => setOrderError(null), 5000);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setOrderSuccess(false);
    setOrderError(null);
  };

  if (isLoading) {
    return <Button variant="outline">Cargando...</Button>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* 🟢 CAMBIO 5: Indicador visual opcional (solo 3 líneas) */}
        <Button variant="outline" className="relative">
          Carrito ({getTotalItems()})
          {!isLoggedIn && getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[540px] flex-grow overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {orderSuccess ? (
              <span className="text-green-600 font-semibold">¡Pedido creado exitosamente!</span>
            ) : orderError ? (
              <span className="text-red-600 font-semibold">{orderError}</span>
            ) : !isLoggedIn ? ( // 👈 Mensaje adicional opcional
              <span className="text-yellow-600 font-semibold">Inicia sesión para comprar</span>
            ) : (
              'Productos en tu carrito'
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <h3 className="mb-2 font-bold">Tu carrito:</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const subtotal = item.discountedPrice * item.quantity;
              return (
                <div key={item.id + item.size} className="block md:flex justify-between items-center mb-2 border-t p-2">
                  <div className="flex items-center">
                    <span>
                      {item.item}: {item.name} - {item.size} - ${item.discountedPrice}
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
                    <span className="p-2 font-semibold text-slate-800">${subtotal}</span>
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
            <h3 className="font-bold text-xl text-right">
              Total: $
              <span>
                <NumberFlow value={total} />
              </span>
            </h3>
            <div className="mt-10 py-4 flex justify-end space-x-2">
              <Button variant="destructive" onClick={handleClearCart} disabled={isProcessingOrder}>
                Vaciar
              </Button>
              <Button
                onClick={handleFinishPurchase}
                className="text-white bg-green-600 hover:bg-green-700"
                disabled={isProcessingOrder || cartItems.length === 0 || !isLoggedIn} // 👈 Deshabilitar si no logueado
                title={!isLoggedIn ? 'Inicia sesión para comprar' : ''}
              >
                {isProcessingOrder ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⟳</span>
                    Procesando...
                  </>
                ) : !isLoggedIn ? ( // 👈 Texto diferente si no logueado
                  'Inicia Sesión'
                ) : (
                  'Finalizar Pedido'
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CarritoNanostorePocketbase;

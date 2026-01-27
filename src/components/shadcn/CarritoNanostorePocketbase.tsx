import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, clearCart, removeFromCart, addToCart  } from '@/store/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NumberFlow from '@number-flow/react';

interface CarritoNanostoreProps {
  userId: string; // Recibes el userId desde Astro
}

function CarritoNanostorePocketbase({ userId }: CarritoNanostoreProps) {
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

  // Nueva función para crear la orden vía endpoint seguro
  const handleFinishPurchase = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessingOrder(true);
    setOrderError(null); // Limpiar errores previos
    
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Las cookies se envían automáticamente al mismo dominio
        },
        body: JSON.stringify({ 
          cartItems, 
          total,
          userId // También puedes enviarlo para validación extra
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error desconocido');
      }
      
      if (result.success) {
        // Éxito: limpiar carrito y mostrar confirmación
        clearCart();
        setOrderSuccess(true);
        
        // Opcional: redirigir a la página de órdenes o mostrar ID
        console.log('Pedido creado con ID:', result.orderId);
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setOrderSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Error en la respuesta');
      }
      
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      setOrderError(error.message || 'No se pudo crear el pedido. Intenta nuevamente.');
      
      // Ocultar error después de 5 segundos
      setTimeout(() => {
        setOrderError(null);
      }, 5000);
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
        <Button variant="outline">Carrito ({getTotalItems()})</Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[540px] flex-grow overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {orderSuccess ? (
              <span className="text-green-600 font-semibold">¡Pedido creado exitosamente!</span>
            ) : orderError ? (
              <span className="text-red-600 font-semibold">{orderError}</span>
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
            <h3 className="font-bold text-xl text-right">Total: $ 
              <span><NumberFlow value={total}/></span>
            </h3>
            <div className="mt-10 py-4 flex justify-end space-x-2">
              <Button 
                variant="destructive" 
                onClick={handleClearCart} 
                disabled={isProcessingOrder}
              >
                Vaciar
              </Button>
              <Button 
                onClick={handleFinishPurchase} 
                className="text-white bg-green-600 hover:bg-green-700"
                disabled={isProcessingOrder || cartItems.length === 0}
              >
                {isProcessingOrder ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⟳</span>
                    Procesando...
                  </>
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

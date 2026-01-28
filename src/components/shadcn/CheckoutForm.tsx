'use client';

import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Truck, CreditCard } from 'lucide-react';

interface CheckoutFormProps {
  orderTotal: number;
  customerData?: {
    direccionCalle?: string;
    ciudad?: string;
    phone?: string;
  } | null;
}

export default function CheckoutForm({ orderTotal, customerData }: CheckoutFormProps) {
  const [shippingMethod, setShippingMethod] = useState('correo');
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [shippingCost, setShippingCost] = useState(0);

  const shippingCosts = {
    correo: 10000,
    uber: 8000,
    retiro_local: 0
  };

  const transferData = {
    cbu: '0170204660000008787653',
    alias: 'simplex.ar',
    razonSocial: 'Simplex Ecommerce',
    cuit: '30-12345678-9'
  };

    useEffect(() => {
    const cost = shippingCosts[shippingMethod as keyof typeof shippingCosts] || 0;
    setShippingCost(cost);
    
    // ACTUALIZAR LOS TOTALES VISIBLES EN LA PÁGINA
    const shippingCostEl = document.getElementById('shipping-cost');
    const totalWithShippingEl = document.getElementById('total-with-shipping');
    
    if (shippingCostEl) {
      shippingCostEl.textContent = `$${cost.toFixed(2)}`;
    }
    
    if (totalWithShippingEl) {
      totalWithShippingEl.textContent = `$${(orderTotal + cost).toFixed(2)}`;
    }
  }, [shippingMethod, orderTotal]);

  const showAddressFields = shippingMethod !== 'retiro_local';
  const showTransferFields = paymentMethod === 'transferencia';

  return (
    <>
      {/* Método de envío */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Método de Envío
          </CardTitle>
          <CardDescription>Selecciona cómo quieres recibir tu pedido</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={shippingMethod} 
            onValueChange={setShippingMethod} 
            name="shipping_method" 
            required 
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-400 cursor-pointer">
              <RadioGroupItem value="correo" id="correo" />
              <div className="flex-1">
                <Label htmlFor="correo" className="font-medium cursor-pointer">Correo Argentino</Label>
                <p className="text-sm text-muted-foreground">Envío a domicilio en 5-10 días hábiles</p>
              </div>
              <Badge variant="outline">{shippingCosts.correo}</Badge>
            </div>
            
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-400 cursor-pointer">
              <RadioGroupItem value="uber" id="uber" />
              <div className="flex-1">
                <Label htmlFor="uber" className="font-medium cursor-pointer">Uber/Delivery</Label>
                <p className="text-sm text-muted-foreground">Entrega el mismo día en Paraná (16 a 20 hs)</p>
              </div>
              <Badge variant="outline">{shippingCosts.uber}</Badge>
            </div>
            
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-400 cursor-pointer">
              <RadioGroupItem value="retiro_local" id="retiro_local" />
              <div className="flex-1">
                <Label htmlFor="retiro_local" className="font-medium cursor-pointer">Retiro en Local</Label>
                <p className="text-sm text-muted-foreground">Padre Grella 1593, Paraná. Lunes a Viernes 16-20hs</p>
              </div>
              <Badge variant="outline">Gratis</Badge>
            </div>
          </RadioGroup>

          {/* Datos de envío (condicional) */}
          {showAddressFields && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Dirección de entrega</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    name="shipping_address[direccion]"
                    placeholder="Calle y número"
                    defaultValue={customerData?.direccionCalle || ''}
                    required={showAddressFields}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input 
                    id="ciudad" 
                    name="shipping_address[ciudad]"
                    placeholder="Ciudad"
                    defaultValue={customerData?.ciudad || ''}
                    required={showAddressFields}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo_postal">Código Postal</Label>
                  <Input 
                    id="codigo_postal" 
                    name="shipping_address[codigo_postal]"
                    placeholder="CP"
                    required={showAddressFields}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                  <Input 
                    id="telefono_contacto" 
                    name="shipping_address[telefono]"
                    placeholder="+54 9 11 1234-5678"
                    defaultValue={customerData?.phone || ''}
                    required={showAddressFields}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Método de pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
          <CardDescription>Selecciona cómo quieres pagar</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod} 
            name="payment_method" 
            required 
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-400 cursor-pointer">
              <RadioGroupItem value="transferencia" id="transferencia" />
              <div className="flex-1">
                <Label htmlFor="transferencia" className="font-medium cursor-pointer">Transferencia Bancaria</Label>
                <p className="text-sm text-muted-foreground">Realiza la transferencia y envía el comprobante</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-400 cursor-pointer">
              <RadioGroupItem value="efectivo" id="efectivo" />
              <div className="flex-1">
                <Label htmlFor="efectivo" className="font-medium cursor-pointer">Efectivo</Label>
                <p className="text-sm text-muted-foreground">Solo disponible para retiro en local</p>
              </div>
            </div>
          </RadioGroup>

          {/* Datos de transferencia (condicional) */}
          {showTransferFields && (
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Datos para la transferencia:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">CBU:</span>
                    <span className="font-mono font-bold">{transferData.cbu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Alias:</span>
                    <span className="font-bold">{transferData.alias}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Razón Social:</span>
                    <span>{transferData.razonSocial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">CUIT:</span>
                    <span>{transferData.cuit}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante de Transferencia</Label>
                <Input 
                  id="comprobante" 
                  name="payment_receipt"
                  type="file"
                  accept="image/*,.pdf"
                  required={showTransferFields}
                />
                <p className="text-xs text-muted-foreground">Subí una foto o PDF del comprobante (máx. 1MB)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cbu_cliente">Tu CBU (opcional)</Label>
                <Input 
                  id="cbu_cliente" 
                  name="cbu"
                  placeholder="0000000000000000000000"
                  maxLength={22}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alias_cliente">Tu Alias (opcional)</Label>
                <Input 
                  id="alias_cliente" 
                  name="alias"
                  placeholder="tualias.bancario"
                  maxLength={30}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden fields para enviar datos al formulario principal */}
      <input type="hidden" name="shipping_cost" value={shippingCost} />
      <input type="hidden" name="total_with_shipping" value={orderTotal + shippingCost} />
      <input type="hidden" name="shipping_method_value" value={shippingMethod} />
      <input type="hidden" name="payment_method_value" value={paymentMethod} />
    </>
  );
}
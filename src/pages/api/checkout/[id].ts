import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { id } = params;
    const pb = locals.pb;
    
    if (!pb || !pb.authStore.isValid) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401 }
      );
    }

    // Obtener datos del formulario
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    // Obtener la orden
    const order = await pb.collection('orders').getOne(id || '');
    
    // Verificar propiedad
    if (order.user !== pb.authStore.model?.id) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 403 }
      );
    }
    
    // Calcular costo de envío
    const shippingCosts: Record<string, number> = {
      correo: 10000,
      uber: 8000,
      retiro_local: 0
    };
    
    const shippingCost = shippingCosts[data.shipping_method as string] || 0;
    const totalWithShipping = order.total + shippingCost;
    
    // Actualizar la orden
    const updatedOrder = await pb.collection('orders').update(id || '', {
      shipping_method: data.shipping_method,
      shipping_cost: shippingCost,
      payment_method: data.payment_method,
      cbu: data.cbu || '',
      alias: data.alias || '',
      shipping_address: JSON.parse(data.shipping_address as string || '{}'),
      notes: data.notes || '',
      total: totalWithShipping,
      status: 'pending', // Cambiar de 'draft' a 'pending'
      payment_status: data.payment_method === 'efectivo' ? 'pending' : 'pending'
    });
    
    // Aquí podrías:
    // 1. Enviar email de confirmación
    // 2. Generar PDF de comprobante
    // 3. Notificar al admin
    
    // Redirigir a confirmación
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `/checkout/confirmation/${updatedOrder.id}`
      }
    });
    
  } catch (error) {
    console.error('Error en checkout:', error);
    return new Response(
      JSON.stringify({ error: 'Error procesando el checkout' }),
      { status: 500 }
    );
  }
};
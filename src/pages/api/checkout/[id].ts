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

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de orden requerido' }),
        { status: 400 }
      );
    }

    // Obtener datos del formulario MULTIPART
    const formData = await request.formData();
    
    // Obtener la orden
    let order;
    try {
      order = await pb.collection('orders').getOne(id);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Orden no encontrada' }),
        { status: 404 }
      );
    }
    
    // Verificar propiedad
    if (order.user !== pb.authStore.model?.id) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 403 }
      );
    }

    // Verificar que la orden pueda ser actualizada
    if (order.status !== 'draft' && order.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'La orden no puede ser modificada' }),
        { status: 400 }
      );
    }

    // Extraer datos básicos
    const shippingMethod = formData.get('shipping_method') as string;
    const paymentMethod = formData.get('payment_method') as string;
    const shippingCostStr = formData.get('shipping_cost') as string;
    const totalWithShippingStr = formData.get('total_with_shipping') as string;
    const notes = formData.get('notes') as string;
    const cbu = formData.get('cbu') as string;
    const alias = formData.get('alias') as string;
    
    // Obtener datos de dirección (del componente)
    const direccion = formData.get('shipping_address[direccion]') as string;
    const ciudad = formData.get('shipping_address[ciudad]') as string;
    const codigo_postal = formData.get('shipping_address[codigo_postal]') as string;
    const telefono = formData.get('shipping_address[telefono]') as string;
    
    // Obtener el archivo
    const receiptFile = formData.get('payment_receipt') as File | null;
    
    // Crear FormData para PocketBase
    const pbFormData = new FormData();
    
    // Agregar datos obligatorios
    pbFormData.append('shipping_method', shippingMethod);
    pbFormData.append('payment_method', paymentMethod);
    
    // Calcular costo de envío
    const shippingCosts: Record<string, number> = {
      correo: 10000,
      uber: 8000,
      retiro_local: 0
    };
    
    let shippingCost = 0;
    if (shippingCostStr) {
      shippingCost = Number(shippingCostStr);
    } else {
      shippingCost = shippingCosts[shippingMethod] || 0;
    }
    
    pbFormData.append('shipping_cost', shippingCost.toString());
    
    // Calcular total
    let totalWithShipping = order.total + shippingCost;
    if (totalWithShippingStr) {
      totalWithShipping = Number(totalWithShippingStr);
    }
    
    pbFormData.append('total', totalWithShipping.toString());
    
    // Actualizar estados
    pbFormData.append('status', 'pending');
    pbFormData.append('payment_status', 'pending');
    
    // Agregar campos opcionales
    if (notes) pbFormData.append('notes', notes);
    if (cbu) pbFormData.append('cbu', cbu);
    if (alias) pbFormData.append('alias', alias);
    
    // Construir shipping_address JSON
    const shippingAddress = {
      direccion,
      ciudad,
      codigo_postal,
      telefono
    };
    pbFormData.append('shipping_address', JSON.stringify(shippingAddress));
    
    // Agregar archivo si existe
    if (receiptFile && receiptFile.size > 0 && receiptFile.name) {
      // Verificar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(receiptFile.type)) {
        return new Response(
          JSON.stringify({ 
            error: 'Formato de archivo no permitido. Use PDF, JPEG o WebP' 
          }),
          { status: 400 }
        );
      }
      
      // Verificar tamaño (1MB)
      if (receiptFile.size > 1048576) {
        return new Response(
          JSON.stringify({ error: 'El archivo es demasiado grande. Máximo 1MB' }),
          { status: 400 }
        );
      }
      
      pbFormData.append('payment_receipt', receiptFile);
    }
    
    // Actualizar la orden
    const updatedOrder = await pb.collection('orders').update(id, pbFormData);
    
    // Redirigir a confirmación
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `/checkout/confirmation/${updatedOrder.id}`
      }
    });
    
  } catch (error) {
    console.error('Error en checkout:', error);
    
    let errorMessage = 'Error procesando el checkout';
    if (error.response?.data) {
      errorMessage = error.response.data.message || JSON.stringify(error.response.data);
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
};
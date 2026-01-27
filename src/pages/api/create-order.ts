import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Verificar autenticación
    if (!locals.pb || !locals.pb.authStore.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'No autenticado', 
          success: false,
          code: 'AUTH_REQUIRED'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obtener datos
    const { cartItems, total } = await request.json();
    
    // Validaciones
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Carrito vacío', 
          success: false,
          code: 'EMPTY_CART'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!total || total <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Total inválido', 
          success: false,
          code: 'INVALID_TOTAL'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear orden
    const orderData = {
      user: locals.pb.authStore.record?.id,
      status: 'pending',
      total: total,
      items: cartItems,
      // created y updated los genera PocketBase automáticamente
    };

    const record = await locals.pb.collection('orders').create(orderData);
    
    // Respuesta exitosa con más detalles
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: record.id,
        orderNumber: `ORD-${record.id.substring(0, 8).toUpperCase()}`,
        total: record.total,
        createdAt: record.created,
        message: 'Pedido creado exitosamente'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('❌ Error en create-order:', error);
    
    // Errores específicos de PocketBase
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;
    let errorCode = 'SERVER_ERROR';
    
    if (error?.status === 403) {
      errorMessage = 'No tienes permiso para crear pedidos';
      statusCode = 403;
      errorCode = 'FORBIDDEN';
    } else if (error?.status === 400) {
      errorMessage = 'Datos inválidos en la solicitud';
      statusCode = 400;
      errorCode = 'BAD_REQUEST';
    } else if (error?.message?.includes('network')) {
      errorMessage = 'Error de conexión con el servidor';
      errorCode = 'NETWORK_ERROR';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        code: errorCode,
        success: false,
        details: import.meta.env.DEV ? error.message : undefined
      }),
      { 
        status: statusCode, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
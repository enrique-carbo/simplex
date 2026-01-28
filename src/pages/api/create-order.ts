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

    // Crear orden TEMPORAL (solo con datos básicos)
    const orderData = {
      user: locals.pb.authStore.record?.id,
      status: 'draft', // Nuevo estado para pedidos en proceso
      total: total,
      items: cartItems,
      payment_status: 'pending',
      // Los demás campos (shipping_method, etc.) se completarán en el checkout
    };

    const record = await locals.pb.collection('orders').create(orderData);
    
    // Respuesta exitosa con redirección al checkout
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: record.id,
        checkoutUrl: `/checkout/${record.id}`, // URL para redirigir
        message: 'Pedido creado, redirigiendo al checkout...'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('❌ Error en create-order:', error);
    
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
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        code: errorCode,
        success: false
      }),
      { 
        status: statusCode, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
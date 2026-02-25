import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 🟢 CAMBIO 1: Usar locals.isLoggedIn (más eficiente)
    // ANTES:
    // if (!locals.pb || !locals.pb.authStore.isValid) {

    // DESPUÉS:
    if (!locals.isLoggedIn) {
      // 👈 Usar el flag del middleware
      return new Response(
        JSON.stringify({
          error: 'No autenticado',
          success: false,
          code: 'AUTH_REQUIRED',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Obtener datos - YA NO recibimos userId del cliente
    const { cartItems, total } = await request.json();

    // Validaciones
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Carrito vacío',
          success: false,
          code: 'EMPTY_CART',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!total || total <= 0) {
      return new Response(
        JSON.stringify({
          error: 'Total inválido',
          success: false,
          code: 'INVALID_TOTAL',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🟢 CAMBIO 2: Usar locals.user.id (ya viene del middleware)
    // ANTES:
    // user: locals.pb.authStore.record?.id,

    // DESPUÉS:
    const orderData = {
      user: locals.user.id, // 👈 Directo y seguro
      status: 'draft',
      total: total,
      items: cartItems,
      payment_status: 'pending',
    };

    const record = await locals.pb.collection('orders').create(orderData);

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        orderId: record.id,
        checkoutUrl: `/checkout/${record.id}`,
        message: 'Pedido creado, redirigiendo al checkout...',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
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
        success: false,
      }),
      {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

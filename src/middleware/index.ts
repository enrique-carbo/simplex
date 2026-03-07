import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // 1. Inicialización de PocketBase
  // Usamos la URL de las variables de entorno configuradas en el panel de Cloudflare
  const pbUrl = import.meta.env.PUBLIC_POCKETBASE_URL;
  locals.pb = new PocketBase(pbUrl);

  // 2. Cargar sesión desde la cookie de la petición
  const cookieHeader = request.headers.get('cookie') || '';
  locals.pb.authStore.loadFromCookie(cookieHeader);

  // 3. Sincronización de sesión (Refresh del token)
  try {
    if (locals.pb.authStore.isValid) {
      const isProtectedRoute = ['/dashboard', '/account', '/checkout', '/api/'].some((path) =>
        request.url.includes(path)
      );

      if (isProtectedRoute) {
        const token = locals.pb.authStore.token;
        // Reemplazo de caracteres para que atob no falle en el Edge de Cloudflare
        const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64Payload));

        // Refrescar si faltan menos de 5 minutos para que expire
        if (payload.exp * 1000 < Date.now() + 5 * 60 * 1000) {
          await locals.pb.collection('users').authRefresh();
        }
      }
    }
  } catch (e) {
    // Si el token es inválido o falla el refresh, limpiamos
    locals.pb.authStore.clear();
  }

  // 4. Asignar datos a locals (estos son los que lee tu Header.astro)
  locals.user = locals.pb.authStore.record;
  locals.isLoggedIn = locals.pb.authStore.isValid;

  // 5. Ejecutar la ruta/componente
  const response = await next();

  // 6. Persistencia de sesión (Set-Cookie)
  try {
    // IMPORTANTE: Detectamos si es una Server Island
    const isIsland = request.headers.has('x-astro-server-island');
    const isHtml = response.headers.get('content-type')?.includes('text/html');

    // Solo persistimos la cookie si el usuario está logueado, es una página HTML
    // y NO es una Server Island (para evitar errores de inmutabilidad en Cloudflare)
    if (locals.pb.authStore.isValid && response instanceof Response && isHtml && !isIsland) {
      // Creamos una nueva respuesta basada en la original para asegurar que los headers sean editables
      const newResponse = new Response(response.body, response);

      newResponse.headers.append(
        'set-cookie',
        locals.pb.authStore.exportToCookie({
          httpOnly: true,
          secure: true, // Siempre true para producción en Cloudflare (HTTPS)
          sameSite: 'Lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      );

      return newResponse;
    }
  } catch (error) {
    // Si falla el set-cookie, logueamos el error pero devolvemos la respuesta original
    // Esto evita que el componente (Header) desaparezca por un error de headers.
    console.error('Error en el set-cookie del Middleware:', error);
    return response;
  }

  return response;
});

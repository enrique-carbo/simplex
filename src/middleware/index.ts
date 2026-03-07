import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // 1. Inicialización - Usa un fallback por si la env no carga
  const pbUrl = import.meta.env.PUBLIC_POCKETBASE_URL;
  locals.pb = new PocketBase(pbUrl);

  // 2. Cargar sesión desde cookie
  const cookieHeader = request.headers.get('cookie') || '';
  locals.pb.authStore.loadFromCookie(cookieHeader);

  // 3. Sincronización de sesión (Simplificada para evitar errores de streaming)
  try {
    if (locals.pb.authStore.isValid) {
      // Solo parseamos el token si es estrictamente necesario
      const isProtectedRoute = ['/dashboard', '/account', '/checkout', '/api/'].some((path) =>
        request.url.includes(path)
      );

      if (isProtectedRoute) {
        // Cloudflare prefiere Buffer.from o una implementación robusta de atob
        const token = locals.pb.authStore.token;
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

        if (payload.exp * 1000 < Date.now() + 5 * 60 * 1000) {
          await locals.pb.collection('users').authRefresh();
        }
      }
    }
  } catch (e) {
    locals.pb.authStore.clear();
  }

  // 4. Helpers
  locals.user = locals.pb.authStore.record;
  locals.isLoggedIn = locals.pb.authStore.isValid;

  // 5. Ejecutar la ruta
  const response = await next();

  /**
   * 6. Persistencia de sesión
   * IMPORTANTE: En Server Islands, la 'response' puede ser un stream que no permite append.
   * Envolvemos en un try/catch para que si falla la cookie, el Header IGUAL se renderice.
   */
  try {
    if (locals.pb.authStore.isValid && response instanceof Response) {
      const isPage = response.headers.get('content-type')?.includes('text/html');

      // Solo intentamos setear la cookie si es una navegación de página real
      if (isPage) {
        response.headers.append(
          'set-cookie',
          locals.pb.authStore.exportToCookie({
            httpOnly: true,
            secure: true, // Forzamos true para Cloudflare (siempre HTTPS)
            sameSite: 'Lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
        );
      }
    }
  } catch (error) {
    console.error('Error seteando cookie en Cloudflare:', error);
  }

  return response;
});

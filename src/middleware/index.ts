import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // 1. Inicialización
  locals.pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL);

  // 2. Cargar sesión desde cookie
  const cookieHeader = request.headers.get('cookie') || '';
  locals.pb.authStore.loadFromCookie(cookieHeader);

  // 3. Sincronización de sesión
  try {
    // Refrescar si el token es válido
    if (locals.pb.authStore.isValid) {
      await locals.pb.collection('users').authRefresh();
    }
  } catch (_) {
    // Si falla el refresh (token expirado o error de red), limpiamos
    locals.pb.authStore.clear();
  }

  // 4. Helpers para los componentes (.astro)
  locals.user = locals.pb.authStore.record;
  locals.isLoggedIn = locals.pb.authStore.isValid;

  // 5. Ejecutar la ruta
  const response = await next();

  // 6. Persistencia de sesión
  if (locals.pb.authStore.isValid) {
    response.headers.append(
      'set-cookie',
      locals.pb.authStore.exportToCookie({
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  }

  return response;
});

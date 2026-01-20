import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  /**
   * 1. Inicialización de PocketBase   
   */
  locals.pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL);

  /**
   * 2. Cargar la sesión desde la cookie del navegador
   */
  const cookieHeader = request.headers.get('cookie') || '';
  locals.pb.authStore.loadFromCookie(cookieHeader);

  /**
   * 3. Sincronización de sesión
   * Intentamos refrescar el token para asegurar que los datos del usuario 
   * (como 'verified' o 'name') estén actualizados.
   */
  try {
    if (locals.pb.authStore.isValid) {
      await locals.pb.collection('users').authRefresh();
    }
  } catch (_) {
    // Si el token es inválido o expiró, limpiamos el store
    locals.pb.authStore.clear();
  }

  /**
   * 4. Ejecutar la ruta (página o API)
   */
  const response = await next();

  /**
   * 5. Persistencia de la sesión (Set-Cookie)
   * Configuramos la cookie con las opciones de seguridad necesarias 
   * para que funcione entre tu Local (Astro) y tu VPS (PocketBase HTTPS).
   */
  response.headers.append('set-cookie', locals.pb.authStore.exportToCookie({
    httpOnly: true,    // Protege contra ataques XSS
    secure: true,      // Obligatorio para HTTPS (VPS). En localhost funciona igual.
    sameSite: 'Lax',   // Permite la navegación entre sitios manteniendo la sesión
    path: '/',         // Disponible en toda la web
    maxAge: 60 * 60 * 24 * 7, // 7 días de duración
  }));

  return response;
});
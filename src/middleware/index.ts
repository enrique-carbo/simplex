import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // IMPORTANTE: Reemplaza con tu URL de Pocketbase en Dokploy
  locals.pb = new PocketBase(import.meta.env.POCKETBASE_URL);
  
  // Carga la sesión desde cookies
  locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || '');
  
  // Refresca el token si es válido
  try {
    if (locals.pb.authStore.isValid) {
      await locals.pb.collection('users').authRefresh();
    }
  } catch (_) {
    locals.pb.authStore.clear();
  }

  const response = await next();
  
  // Guarda la sesión en cookies
  response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());
  
  return response;
});
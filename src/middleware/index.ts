import PocketBase from 'pocketbase';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // 1. Inicialización
  locals.pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL);
  
  // 2. Cargar sesión desde cookie
  const cookieHeader = request.headers.get('cookie') || '';
  locals.pb.authStore.loadFromCookie(cookieHeader);
  
  // 3. Sincronización de sesión CONDICIONAL
  // Solo refrescar si estamos en una ruta protegida o si es necesario
  try {
    const isProtectedRoute = request.url.includes('/dashboard') || 
                            request.url.includes('/account') ||
                            request.url.includes('/checkout');
    
    // Refrescar solo si hay token válido Y es ruta protegida
    if (locals.pb.authStore.isValid && isProtectedRoute) {
      // Refrescar solo si el token expira pronto (ej: en menos de 5 min)
      const token = locals.pb.authStore.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convertir a ms
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
      
      if (expiresAt < fiveMinutesFromNow) {
        await locals.pb.collection('users').authRefresh();
      }
    }
  } catch (_) {
    locals.pb.authStore.clear();
  }

  // 4. Añadir helpers útiles al contexto
  locals.user = locals.pb.authStore.record;
  locals.isLoggedIn = locals.pb.authStore.isValid;
  
  // 5. Ejecutar la ruta
  const response = await next();
  
  // 6. Persistencia de sesión (SOLO si hubo cambios)
  if (locals.pb.authStore.isValid) {
    response.headers.append('set-cookie', locals.pb.authStore.exportToCookie({
      httpOnly: true,
      secure: import.meta.env.PROD, // true en producción, false en desarrollo
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }));
  }
  
  return response;
});
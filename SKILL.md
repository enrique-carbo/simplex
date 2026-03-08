# 🛒 SKILLS.md - Especificaciones de Proyecto: Tienda Simplex

## 🌟 1. Visión General del Proyecto

**Tienda Simplex** es una plataforma de e-commerce de alto rendimiento diseñada en Paraná, Argentina. El objetivo principal es ofrecer una experiencia de compra instantánea, con un SEO impecable y una gestión de usuarios robusta.

* **Core:** [Astro 5.0](https://astro.build/) (SSR - Server Side Rendering).
* **Backend & Auth:** [PocketBase](https://pocketbase.io/) (Base de datos en tiempo real y gestión de usuarios).
* **Infraestructura:** Despliegue en **Cloudflare Pages** (Edge Computing) y VPS con Docker/Dokploy para servicios complementarios.
* **UI/UX:** React 18 + Tailwind CSS + Shadcn UI + Nanostores.

---

## 🏗️ 2. Arquitectura: "Selective Island Isolation"

La innovación principal de este proyecto es cómo manejamos el **Header**, resolviendo el conflicto entre "Contenido Estático para SEO" y "Contenido Dinámico de Usuario".

### A. El Header Estático (Performance Primero)

El cuerpo del Header (`Header.astro`) es **100% estático**. No espera a la base de datos para renderizarse. Esto permite que el usuario vea el Logo, las categorías (Remeras, Buzos, etc.) y el menú mobile de forma inmediata.

* **Interactividad:** El menú hamburguesa (`ToggleMenu.astro`) funciona mediante estados de Tailwind (`group-[.expanded]`), eliminando la necesidad de scripts complejos que se rompen al navegar.

### B. La Isla de Servidor (`UserActions.astro`)

Para la gestión de sesión, utilizamos la directiva **server:defer**. Esta "isla" de servidor se renderiza de forma independiente.

* **El Problema que Resuelve:** Evita que todo el Header sea lento si la conexión con PocketBase tiene latencia.
* **Fallback (Skeleton):** Mientras el servidor valida la cookie de sesión, se muestra un esqueleto animado (`animate-pulse`) que mantiene la estructura visual (0% Layout Shift).
* **Sincronización:** Una vez resuelta la sesión, inyecta el `userId` y el estado `isLoggedIn` directamente desde los `Astro.locals` al componente de React.

---

## 🛒 3. Gestión del Carrito y Estado

El carrito es una pieza híbrida que garantiza persistencia:

* **Tecnología:** React + Nanostores.
* **Flujo:** `UserActions` (Servidor) -> `Carrito` (Cliente).
* **Persistencia:** Al recibir el `userId` desde la isla de servidor, el componente de React sabe exactamente qué carrito recuperar de PocketBase, manteniendo los productos guardados incluso si el usuario refresca la página o cambia de dispositivo.

---

## ⚡ 4. Optimización de Recursos en Cloudflare

Esta arquitectura está diseñada específicamente para ser ultra-eficiente (Edge):
Bajo Uso de CPU Time: Al no procesar la sesión de usuario en el Header principal, Cloudflare entrega el 90% del HTML de forma casi instantánea. Solo el pequeño Worker de la "Isla" consume tiempo de cómputo.
Escalabilidad en el Borde: Reducimos drásticamente los milisegundos de ejecución por request, lo que permite que Tienda Simplex soporte picos de tráfico sin exceder los límites de cómputo de los Workers de Cloudflare.
Carga Diferida: La hidratación de React (client:only) ocurre solo en el cliente, descargando de trabajo al servidor.

## 🛒 5. Gestión del Carrito y Sesión
**Flujo:** UserActions (Servidor) -> Carrito (React/Cliente).
**Persistencia:** La isla de servidor extrae el userId y lo inyecta directamente en el componente del carrito. Esto garantiza que el carrito sepa quién es el usuario sin peticiones extra desde el navegador, manteniendo la sincronización total con PocketBase.

## 🛠️ 6. Reglas para el Desarrollo (IA Context)

1. **No Bloquear el Render:** Nunca mover lógica pesada de base de datos al `Header.astro` principal. Todo lo dinámico debe vivir dentro de la isla `UserActions`.
2. **Estilos Consistentes:** Se utiliza la capa `@layer components` de Tailwind para botones (`btn-primary`) y fondos (`bg-page`), asegurando que el modo oscuro sea nativo y coherente.
3. **Limpieza de Sesión:** El logout se maneja con `window.location.replace('/')` para resetear el estado de todas las islas de servidor y limpiar cookies.
4. **Imágenes:** Usar el servicio de passthrough de Astro para Cloudflare para evitar problemas de procesamiento en el build.

---

## 🚀 7. Checklist de Escalabilidad

Esta arquitectura está lista para crecer:

* **Roles:** Se pueden añadir paneles de Admin o Editor simplemente extendiendo la lógica dentro de la isla `UserActions`.
* **Nuevas Features:** Funciones como "Favoritos" o "Notificaciones" deben seguir el mismo patrón: ser una isla diferida con un skeleton para no penalizar la velocidad de la landing.

---

## 💎 8. Beneficios de la Arquitectura Híbrida (Static + server:defer)
Esta estructura de Islas Selectivas ofrece ventajas críticas en tres áreas: Rendimiento, Costo y Experiencia de Usuario.

### A. Rendimiento Extremo (TTFB & LCP)
Al no procesar la lógica de sesión en el Header principal, Astro puede generar el HTML de la página de forma casi instantánea.
* TTFB (Time to First Byte) reducido: El servidor entrega el "esqueleto" y el contenido estático (productos, categorías, banners) sin esperar a que PocketBase valide al usuario.
* LCP (Largest Contentful Paint) instantáneo: El usuario ve la marca y la navegación en milisegundos, eliminando la sensación de "página blanca" o carga lenta.

### B. Eficiencia en Cloudflare (Ahorro de CPU Time)
* Cloudflare Workers cobra por CPU Time (tiempo de procesamiento). Nuestra arquitectura es ultra-eficiente:
* Cómputo Granular: Solo el pequeño componente UserActions.astro consume tiempo de ejecución dinámico. El 90% del Header se sirve como contenido estático o cacheable.
* Optimización de Recursos: Evitamos ejecutar middleware pesado de autenticación en cada recurso estático, concentrando el poder de cómputo solo donde es estrictamente necesario.

### C. Estabilidad Visual (0% Layout Shift)
Gracias al uso de Skeletons (Fallbacks) definidos en el slot="fallback", el diseño no "salta" cuando el usuario se loguea.
CLS (Cumulative Layout Shift) controlado: El espacio para el carrito y el botón de cuenta ya está reservado por el Skeleton. Cuando la Server Island termina de procesar, el contenido aparece suavemente sin mover el resto de la página.

### D. Resiliencia ante Fallos
Si el servicio de base de datos (PocketBase) tiene una latencia alta o una caída momentánea:
Navegación Ininterrumpida: El usuario aún puede navegar por las categorías, ver productos y leer la landing, ya que el Header estático no depende de la base de datos. Solo la "isla" de usuario mostrará el estado de carga o un error controlado, sin romper el sitio completo.

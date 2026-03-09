# 🚀 Simplex - Indumentaria Urbana

Página web oficial de **Simplex**, un local de venta minorista de indumentaria urbana, deportiva y de tiempo libre. Diseñada con enfoque en **rendimiento**, **experiencia de usuario** y **optimización para Cloudflare**.

## ✨ Tecnologías

- **[Astro 5.0](https://astro.build/)** - Framework web con islas de interactividad
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos utilitarios
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizables
- **[PocketBase](https://pocketbase.io/)** - Backend y autenticación
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Hosting y edge network
- **[Nanostores](https://github.com/nanostores/nanostores)** - Estado global del carrito
- **[Astrowind](https://github.com/arthelokyo/astrowind)** - Este proyecto está basado en **AstroWind**

## 🎯 Características

- ✅ **Optimizado para Cloudflare** - Mínimo consumo de CPU time
- ✅ **Autenticación híbrida y persistente** - Implementación de un Middleware que sincroniza la sesión de PocketBase mediante cookies en el borde (Edge). Realiza un authRefresh() único al inicio del ciclo de vida de la solicitud para validar el token y expone los datos del usuario a través de Astro.locals
- ✅ **Carrito de compras** con estado global y feedback visual
- ✅ **Blog estático** - 0 CPU time en Cloudflare (con `prerender = true`)
- ✅ **Dashboard de usuario** con datos en tiempo real
- ✅ **Modo oscuro** soportado
- ✅ **Diseño responsive** y mobile-first
- ✅ **PWA ready** con iconos y manifest
- ✅ **RSS feed** automático
- ✅ **SEO optimizado** con Open Graph tags

## 🚀 Optimizaciones implementadas

### Header y autenticación
- Uso de `Astro.locals.isLoggedIn` desde middleware
- Verificación de sesión por cookie (sin llamadas a PocketBase)
- Indicador visual en carrito cuando hay items sin login

### Arquitectura de Islas de Servidor: 
El Header utiliza <UserActions server:defer />. Esto permite que el 90% de la página sea estática y cacheable, delegando la lógica de sesión a una micro-isla dinámica.

### API Endpoints
- Validación con `locals.isLoggedIn` en lugar de `pb.authStore`
- No se envía `userId` desde el cliente (confianza en cookies)
- Respuestas optimizadas con códigos de error específicos

### Blog
- Generación estática con `export const prerender = true`
- **0 CPU time** en Cloudflare
- Acceso a datos de sesión gracias a `output: 'server'` en config

## 📁 Estructura del proyecto

```
/
├── public/
│   ├── _headers
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── favicons/
│   │   ├── images/
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/
│   │   ├── blog/
│   │   ├── common/
│   │   ├── shadcn/           # Componentes de Shadcn/ui
│   │   │   ├── CarritoNanostorePocketbase.tsx  # Carrito optimizado
│   │   │   └── ...
│   │   ├── ui/
│   │   ├── widgets/
│   │   │   ├── Header.astro   # Header con autenticación optimizada
│   │   │   └── ...
│   │   ├── CustomStyles.astro
│   │   ├── Favicons.astro
│   │   └── Logo.astro
│   ├── content/
│   │   ├── post/
│   │   │   ├── post-slug-1.md
│   │   │   ├── post-slug-2.mdx
│   │   │   └── ...
│   │   └── config.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── MarkdownLayout.astro
│   │   └── PageLayout.astro    # Layout con header forzado por key
│   ├── pages/
│   │   ├── api/                 # Endpoints API
│   │   │   ├── auth/
│   │   │   ├── create-order.ts  # Optimizado (usa locals.isLoggedIn)
│   │   │   └── ...
│   │   ├── [...blog]/
│   │   │   ├── [category]/
│   │   │   ├── [tag]/
│   │   │   ├── [...page].astro  # Blog con prerender = true
│   │   │   └── index.astro       # Blog con prerender = true
│   │   ├── dashboard/            # Rutas protegidas
│   │   ├── auth/                  # Login, registro
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   └── ...
│   ├── store/                     # Nanostores
│   │   └── cart.ts                 # Estado del carrito
│   ├── middleware.ts               # Middleware con autenticación por cookie
│   ├── utils/
│   ├── config.yaml
│   └── navigation.js
├── package.json
├── astro.config.mjs                # Config con output: 'server'
└── ...
```

## ⚙️ Configuración clave

### Astro Config (`astro.config.mjs`)
```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',  // Permite páginas estáticas + dinámicas
  adapter: cloudflare(),
  // ... resto de config
});
```

### Middleware (`src/middleware.ts`)
- Carga sesión desde cookies
- Expone `locals.isLoggedIn` y `locals.user`
- Refresco condicional de tokens

## 🔐 Flujo de autenticación optimizado

1. Usuario se loguea → cookie establecida
2. Middleware lee cookie → `locals.isLoggedIn = true`
3. Header usa `locals.isLoggedIn` (sin llamadas a DB)
4. API endpoints validan con `locals.isLoggedIn`
5. Blog estático muestra header correcto (gracias a `output: 'server'`)

## 📊 Rendimiento

- **Blog**: 0 CPU time en Cloudflare (estático)
- **Header**: Sin llamadas a PocketBase en cada render
- **Carrito**: Validación visual sin requests
- **API**: Una sola llamada a DB al finalizar compra

**Reducción estimada de CPU time**: ~75%

## 🚀 Despliegue en Cloudflare Pages

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview local del build
npm run preview

# Deploy (automático con git push a main)
git push origin main
```

## 📝 Licencia

Este proyecto está basado en **AstroWind**, licenciado bajo MIT — ver archivo [LICENSE.md](./LICENSE.md) para más detalles.

## 👥 Contribuciones

¿Encontraste un bug o tenés sugerencias de optimización? ¡Abrí un issue o enviá un pull request!

---

Hecho con ❤️ para **Simplex** | Optimizado para Cloudflare 🚀
```

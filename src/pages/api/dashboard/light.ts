// src/pages/api/dashboard/light.ts
import type { APIRoute } from 'astro';
import type { RecordModel } from 'pocketbase';

// Tipos para la respuesta
interface CustomerData {
  nombre?: string;
  apellido?: string;
  documento?: string;
  phone?: string;
  direccionCalle?: string;
  direccionNumero?: string;
  ciudad?: string;
  provincia?: string;
}

interface OrderItem {
  quantity?: number;
  [key: string]: unknown;
}

interface OrderData {
  id: string;
  status?: string;
  total?: number;
  created: string;
  items?: OrderItem[];
}

interface ProcessedOrder {
  id: string;
  status: string;
  total: number;
  created: string;
  itemCount: number;
}

interface DashboardResponse {
  customerData: CustomerData | null;
  recentOrders: ProcessedOrder[];
  totalOrders: number;
}

// Cache global tipado
interface CacheEntry {
  data: DashboardResponse;
  timestamp: number;
}

declare global {
  // eslint-disable-next-line no-var
  var dashboardCache: Map<string, CacheEntry> | undefined;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId') || locals.user?.id;
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Cache simple en memoria del Worker
  const cacheKey = `dashboard:${userId}`;
  const cached = globalThis.dashboardCache?.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 30000) { // 30 segundos
    return new Response(JSON.stringify(cached.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT'
      }
    });
  }

  const pb = locals.pb;
  
  try {
    // Solo datos esenciales - campos mínimos
    const [customerData, orders] = await Promise.all([
      pb.collection('customer_data')
        .getFirstListItem<RecordModel & CustomerData>(`user = "${userId}"`, {
          fields: 'nombre,apellido,documento,phone,direccionCalle,direccionNumero,ciudad,provincia'
        })
        .catch(() => null),
      
      pb.collection('orders')
        .getList<RecordModel & OrderData>(1, 5, {
          filter: `user = "${userId}"`,
          sort: '-created',
          fields: 'id,status,total,created,items',
          perPage: 3 // Solo 3 órdenes para dashboard
        })
        .catch(() => ({ items: [], totalItems: 0 }))
    ]);

    // Procesamiento MÍNIMO con tipos
    const processedOrders: ProcessedOrder[] = orders.items.map(order => ({
      id: order.id,
      status: order.status || 'pending',
      total: order.total || 0,
      created: order.created,
      itemCount: Array.isArray(order.items) 
        ? order.items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 1), 0)
        : 0
    }));

    const response: DashboardResponse = {
      customerData,
      recentOrders: processedOrders,
      totalOrders: orders.totalItems || 0
    };

    // Cache simple
    if (!globalThis.dashboardCache) {
      globalThis.dashboardCache = new Map();
    }
    globalThis.dashboardCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    const errorResponse: DashboardResponse = { 
      customerData: null, 
      recentOrders: [], 
      totalOrders: 0 
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Siempre responde algo
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
// components/dashboard/DashboardShell.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, CreditCard, Phone, MapPin, Calendar, User } from 'lucide-react';

interface DashboardData {
  customerData: {
    nombre?: string;
    apellido?: string;
    documento?: string;
    phone?: string;
    direccionCalle?: string;
    direccionNumero?: string;
    ciudad?: string;
    provincia?: string;
  } | null;
  recentOrders: Array<{
    id: string;
    status: string;
    total: number;
    created: string;
    itemCount: number;
  }>;
  totalOrders: number;
}

export default function DashboardShell({ userId }: { userId: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(userId);
  }, [userId]);

  const fetchDashboardData = async (userId: string) => {
    try {
      const res = await fetch(`/api/dashboard/light?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Datos Personales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Información para compras y envíos</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/editar">
              {data?.customerData ? 'Editar' : 'Completar'}
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          {data?.customerData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {data.customerData.nombre && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">Nombre:</span> {data.customerData.nombre}
                </div>
              )}  
              {data.customerData.documento && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">DNI:</span> {data.customerData.documento}
                </div>
              )}
              {data.customerData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Celular:</span> {data.customerData.phone}
                </div>
              )}
              {(data.customerData.direccionCalle || data.customerData.ciudad) && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Dirección:</span>
                  {[data.customerData.direccionCalle, data.customerData.direccionNumero, data.customerData.ciudad]
                    .filter(Boolean)
                    .join(' ')}
                  {data.customerData.provincia && ` (${data.customerData.provincia})`}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Completa tus datos de envío</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">ID de Cliente</p>
              <p className="font-mono p-1 rounded text-xs truncate">{userId.substring(0, 12)}...</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Miembro desde
              </p>
              <p>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Órdenes */}
      <OrdersSection orders={data?.recentOrders || []} totalOrders={data?.totalOrders || 0} />
    </div>
  );
}

function OrdersSection({ orders, totalOrders }: { orders: Array<{ id: string; status: string; total: number; created: string; itemCount: number; }>, totalOrders: number }) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Borrador' },  
      pending: { color: 'bg-amber-100 text-amber-800', text: 'Pendiente' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'Procesando' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Enviado' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Entregado' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };
    return statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mis Pedidos
          </CardTitle>
          <CardDescription>
            {totalOrders > 0
              ? `${totalOrders} pedido${totalOrders !== 1 ? 's' : ''} en total`
              : 'Aún no has realizado pedidos'}
          </CardDescription>
        </div>
        {totalOrders > 0 && (
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/orders" className="flex items-center gap-1">
              Ver todos
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = getStatusBadge(order.status);
              return (
                <a
                  href={`/dashboard/orders/${order.id}`}
                  className="block border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  key={order.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          Pedido #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                        <Badge className={`text-xs ${status.color}`}>
                          {status.text}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created).toLocaleDateString('es-ES')} • {order.itemCount} producto{order.itemCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Aún no has realizado pedidos</p>
            <Button asChild>
              <a href="/productos">Explorar productos</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
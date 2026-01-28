// src/types/order.ts
import type { RecordModel } from 'pocketbase';

export interface OrderItem {
  id: string;
  name: string;
  item: string;
  size: string;
  quantity: number;
  price?: number; // Opcional por compatibilidad
  discountedPrice: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ShippingAddress {
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  notas?: string;
}

export interface PaymentDetails {
  cbu?: string;
  alias?: string;
  receipt_url?: string;
  transaction_id?: string;
  verified_at?: string;
}

export interface Order extends RecordModel {
  user: string;
  status: 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal?: number; // Nuevo campo
  discount?: number; // Nuevo campo
  shipping_cost?: number;
  total: number;
  items: OrderItem[];
  shipping_method?: 'correo' | 'uber' | 'retiro_local' | 'otro';
  shipping_address?: ShippingAddress | JSON;
  payment_method?: 'transferencia' | 'efectivo' | 'mercadopago' | 'tarjeta';
  payment_details?: PaymentDetails;
  payment_receipt?: string; // ID del archivo en PB
  payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  cbu?: string; // Mantener por compatibilidad
  alias?: string; // Mantener por compatibilidad
  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  metadata?: Record<string, string | number | boolean | object>;
  expand?: {
    user?: {
      id: string;
      email: string;
      username?: string;
    }
  };
}
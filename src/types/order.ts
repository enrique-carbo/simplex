import type { RecordModel } from 'pocketbase';

export interface Order extends RecordModel {
  user: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    item: string;
    size: string;
    quantity: number;
    discountedPrice: number;
    [key: string]: string | number | boolean;
  }>;
  expand?: {
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  };
}
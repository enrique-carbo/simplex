export interface UserRecord {
  id: string;
  email: string;
  verified: boolean;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}

export interface CustomerDataRecord {
  id: string;
  user: string;
  nombre: string;
  apellido: string;
  documento: number;
  direccionCalle: string;
  direccionNumero: string;
  ciudad: string;
  provincia: string;
  phone: string;
  created: string;
  updated: string;
}
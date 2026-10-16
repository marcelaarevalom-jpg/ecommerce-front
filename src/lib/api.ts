import { cookies } from "next/headers";

// BASE_URL viene del archivo .env.local (ver .env.example). Ej: http://localhost:8000/api
const BASE_URL = process.env.BASE_URL ?? "http://localhost:8000/api";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string | number; // Laravel devuelve los decimales como texto: "19.99"
  stock: number;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: string | number;
  product?: Product;
};

export type Payment = {
  id: number;
  stripe_payment_id: string;
  amount: string | number;
  status: string;
};

export type Order = {
  id: number;
  total: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
  payment: Payment | null;
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;
  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  next?: { revalidate?: number; tags?: string[] };
  cache?: RequestCache;
};

/** Función única para hablar con la API Laravel. Aquí se adjunta el JWT (Bearer). */
export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  if (opts.auth) {
    const token = (await cookies()).get("token")?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: opts.cache,
      next: opts.next,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con la API. ¿Está corriendo Laravel (php artisan serve)?",
      0,
    );
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    let fieldErrors: Record<string, string[]> | undefined;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      if (data?.errors) fieldErrors = data.errors;
    } catch {
      /* respuesta sin JSON */
    }
    throw new ApiError(message, res.status, fieldErrors);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

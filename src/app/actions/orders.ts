"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError, type Order } from "@/lib/api";
import { readCart, writeCart } from "@/lib/cart";
import type { FormState } from "@/lib/schemas";

/** Mutación 1: crea la orden en la API (POST /orders) con lo que hay en el carrito. */
export async function createOrderAction(_prev: FormState): Promise<FormState> {
  const cart = await readCart();
  if (cart.length === 0) return { error: "Tu carrito está vacío" };

  let orderId: number;
  try {
    const order = await api<Order>("/orders", {
      method: "POST",
      auth: true,
      body: { items: cart.map((l) => ({ product_id: l.id, quantity: l.qty })) },
    });
    orderId = order.id;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?next=/carrito");
    return { error: e instanceof ApiError ? e.message : "No se pudo crear la orden" };
  }

  await writeCart([]); // el carrito ya se convirtió en orden
  revalidatePath("/pedidos");
  revalidatePath("/", "layout");
  redirect(`/pedidos/${orderId}`);
}

/** Mutación 2: paga la orden con Stripe (POST /orders/{id}/pay). */
export async function payOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const orderId = Number(formData.get("orderId"));
  if (!Number.isInteger(orderId) || orderId <= 0) return { error: "Orden inválida" };

  try {
    await api(`/orders/${orderId}/pay`, { method: "POST", auth: true });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect(`/login?next=/pedidos/${orderId}`);
    return { error: e instanceof ApiError ? e.message : "No se pudo procesar el pago" };
  }

  // Refresca el historial y el detalle: así se ve "Pagada" sin recargar a mano
  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${orderId}`);
  redirect(`/pedidos/${orderId}?pagado=1`);
}

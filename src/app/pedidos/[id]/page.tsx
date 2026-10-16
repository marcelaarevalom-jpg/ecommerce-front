import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { api, ApiError, type Order } from "@/lib/api";
import { PayForm } from "@/components/PayForm";
import { estadoOrden, fecha, money } from "@/lib/format";

export const metadata: Metadata = { title: "Detalle de orden" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ pagado?: string }> };

export default async function PedidoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { pagado } = await searchParams;

  let order: Order;
  try {
    order = await api<Order>(`/orders/${id}`, { auth: true, cache: "no-store" });
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401) redirect(`/login?next=/pedidos/${id}`);
      if (e.status === 404 || e.status === 403) notFound();
    }
    throw e;
  }
  const pagada = order.status === "paid";

  return (
    <article className="card mx-auto max-w-2xl space-y-5">
      {pagado && pagada && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 font-semibold text-green-700">
          ¡Pago confirmado! Gracias por tu compra.
        </p>
      )}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orden #{order.id}</h1>
          <p className="text-sm text-slate-500">{fecha(order.created_at)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pagada ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {estadoOrden(order.status)}
        </span>
      </header>

      <ul className="divide-y divide-slate-200">
        {order.items.map((it) => (
          <li key={it.id} className="flex justify-between py-2 text-sm">
            <span>{it.quantity} × {it.product?.name ?? `Producto #${it.product_id}`}</span>
            <span className="font-semibold">{money(Number(it.price) * it.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="flex justify-between text-xl font-extrabold"><span>Total</span><span>{money(order.total)}</span></p>

      {order.payment && (
        <p className="text-xs text-slate-500">Pago Stripe: {order.payment.stripe_payment_id} ({order.payment.status})</p>
      )}

      {pagada ? (
        <Link href="/pedidos" className="btn-outline">Ver historial</Link>
      ) : (
        <PayForm orderId={order.id} />
      )}
    </article>
  );
}

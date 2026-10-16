import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { api, ApiError, type Order } from "@/lib/api";
import { estadoOrden, fecha, money } from "@/lib/format";

export const metadata: Metadata = { title: "Mis pedidos" };
export const dynamic = "force-dynamic"; // datos del usuario: nunca estáticos

async function Historial() {
  let orders: Order[];
  try {
    orders = await api<Order[]>("/orders", { auth: true, cache: "no-store" });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?next=/pedidos");
    throw e; // lo atrapa error.tsx
  }

  if (orders.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-slate-600">Aún no tienes compras.</p>
        <Link href="/productos" className="btn mt-4">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/pedidos/${o.id}`} className="card flex items-center justify-between transition hover:border-indigo-300">
            <div>
              <p className="font-semibold">Orden #{o.id}</p>
              <p className="text-sm text-slate-500">{fecha(o.created_at)} · {o.items.length} producto(s)</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{money(o.total)}</p>
              <span className={`text-xs font-semibold ${o.status === "paid" ? "text-green-600" : "text-amber-600"}`}>
                {estadoOrden(o.status)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function PedidosPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Historial de compras</h1>
      <Suspense fallback={<p className="text-slate-500">Cargando tus pedidos…</p>}>
        <Historial />
      </Suspense>
    </section>
  );
}

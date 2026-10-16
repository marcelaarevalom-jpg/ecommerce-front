import type { Metadata } from "next";
import Link from "next/link";
import { api, ApiError, type Product } from "@/lib/api";
import { readCart } from "@/lib/cart";
import { removeFromCartAction } from "@/app/actions/cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { SubmitButton } from "@/components/SubmitButton";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Carrito" };
export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  const cart = await readCart();

  if (cart.length === 0) {
    return (
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link href="/productos" className="btn mt-4">Ver productos</Link>
      </div>
    );
  }

  // Precios siempre frescos desde la API (no confiamos en lo guardado en la cookie)
  const productos = await Promise.all(
    cart.map((l) =>
      api<Product>(`/products/${l.id}`, { next: { revalidate: 60, tags: ["products"] } }).catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    ),
  );
  const lineas = cart
    .map((l, i) => ({ ...l, product: productos[i] }))
    .filter((l): l is typeof l & { product: Product } => l.product !== null);
  const total = lineas.reduce((s, l) => s + Number(l.product.price) * l.qty, 0);

  return (
    <section className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="card">
        <h1 className="mb-4 text-2xl font-bold">Carrito</h1>
        <ul className="divide-y divide-slate-200">
          {lineas.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{l.product.name}</p>
                <p className="text-sm text-slate-500">{l.qty} × {money(l.product.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{money(Number(l.product.price) * l.qty)}</span>
                <form action={removeFromCartAction}>
                  <input type="hidden" name="productId" value={l.id} />
                  <SubmitButton className="btn-outline" pending="…">Quitar</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="card h-fit space-y-4">
        <h2 className="text-lg font-bold">Resumen</h2>
        <p className="flex justify-between text-xl font-extrabold"><span>Total</span><span>{money(total)}</span></p>
        <CheckoutForm />
        <p className="text-xs text-slate-500">Primero se crea la orden y luego se paga en el siguiente paso.</p>
      </aside>
    </section>
  );
}

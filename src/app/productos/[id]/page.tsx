import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api, ApiError, type Product } from "@/lib/api";
import { addToCartAction } from "@/app/actions/cart";
import { SubmitButton } from "@/components/SubmitButton";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

// cache() evita pedir el mismo producto dos veces (metadata + página)
const getProduct = cache(async (id: string) => {
  try {
    return await api<Product>(`/products/${id}`, { next: { revalidate: 60, tags: ["products"] } });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  return p ? { title: p.name, description: p.description ?? undefined } : { title: "Producto no encontrado" };
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  return (
    <article className="card mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">{p.name}</h1>
      <p className="mt-3 text-slate-600">{p.description}</p>
      <p className="mt-6 text-3xl font-extrabold">{money(p.price)}</p>
      <p className="mt-1 text-sm text-slate-500">{p.stock > 0 ? `${p.stock} en stock` : "Agotado"}</p>

      <form action={addToCartAction} className="mt-6 flex items-end gap-3">
        <input type="hidden" name="productId" value={p.id} />
        <div>
          <label htmlFor="quantity" className="mb-1 block text-sm font-medium">Cantidad</label>
          <input id="quantity" name="quantity" type="number" min={1} max={Math.max(p.stock, 1)} defaultValue={1} className="input w-24" />
        </div>
        <SubmitButton pending="Agregando…">Agregar al carrito</SubmitButton>
      </form>
    </article>
  );
}

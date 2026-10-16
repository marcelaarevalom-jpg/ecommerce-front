import Link from "next/link";
import { addToCartAction } from "@/app/actions/cart";
import { SubmitButton } from "./SubmitButton";
import { money } from "@/lib/format";
import type { Product } from "@/lib/api";

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card flex flex-col">
      <Link href={`/productos/${p.id}`} className="text-lg font-semibold hover:text-indigo-600">{p.name}</Link>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600">{p.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold">{money(p.price)}</span>
        <span className="text-xs text-slate-500">{p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}</span>
      </div>
      <form action={addToCartAction} className="mt-3">
        <input type="hidden" name="productId" value={p.id} />
        <input type="hidden" name="quantity" value={1} />
        <SubmitButton className="btn w-full" pending="Agregando…">Agregar al carrito</SubmitButton>
      </form>
    </article>
  );
}

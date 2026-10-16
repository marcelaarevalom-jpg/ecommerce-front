import type { Metadata } from "next";
import { Suspense } from "react";
import { api, type Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Productos" };
// La API puede no estar disponible al hacer build: se pide en cada visita (ver PDF "Errores comunes")
export const dynamic = "force-dynamic";

async function Catalogo() {
  // GET /products — se cachea 60 s y se puede invalidar con la etiqueta "products"
  const products = await api<Product[]>("/products", { next: { revalidate: 60, tags: ["products"] } });

  if (products.length === 0) {
    return <p className="text-slate-600">Todavía no hay productos. Créalos desde Swagger (POST /api/products).</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}

export default function ProductosPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>
      <Suspense fallback={<p className="text-slate-500">Cargando productos…</p>}>
        <Catalogo />
      </Suspense>
    </section>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/data";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

const POR_PAGINA = 6;

export const metadata: Metadata = { title: "Productos" };
// La API puede no estar disponible al hacer build: se pide en cada visita (ver PDF "Errores comunes")
export const dynamic = "force-dynamic";

async function Catalogo({ page }: { page: number }) {
  // GET /products (con caché de 60 s, ver lib/data.ts)
  const products = await getProducts();

  if (products.length === 0) {
    return <p className="text-slate-600">Todavía no hay productos. Créalos desde Swagger (POST /api/products).</p>;
  }
  const totalPaginas = Math.max(1, Math.ceil(products.length / POR_PAGINA));
  const actual = Math.min(Math.max(page, 1), totalPaginas);
  const visibles = products.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p, i) => <ProductCard key={p.id} p={p} priority={i === 0} />)}
      </div>
      {totalPaginas > 1 && (
        <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-3 text-sm">
          {actual > 1 ? (
            <Link className="btn-outline" href={`/productos?page=${actual - 1}`}>← Anterior</Link>
          ) : <span className="btn-outline pointer-events-none opacity-40">← Anterior</span>}
          <span className="font-medium">Página {actual} de {totalPaginas}</span>
          {actual < totalPaginas ? (
            <Link className="btn-outline" href={`/productos?page=${actual + 1}`}>Siguiente →</Link>
          ) : <span className="btn-outline pointer-events-none opacity-40">Siguiente →</span>}
        </nav>
      )}
    </>
  );
}

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>
      <Suspense fallback={<p className="text-slate-500">Cargando productos…</p>}>
        <Catalogo page={Number(page) || 1} />
      </Suspense>
    </section>
  );
}

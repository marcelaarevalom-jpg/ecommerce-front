import { unstable_cache } from "next/cache";
import { api, ApiError, type Product } from "./api";

// Caché en el servidor (60 s): la API Laravel puede ser lenta, así que no la consultamos
// en cada visita. Mejora el TTFB y el LCP (Web Vitals). Los errores NO se guardan en caché.
const productsCached = unstable_cache(
  () => api<Product[]>("/products", { cache: "no-store" }),
  ["products-list"],
  { revalidate: 60, tags: ["products"] },
);

const productCached = unstable_cache(
  (id: string) => api<Product>(`/products/${id}`, { cache: "no-store" }),
  ["product-detail"],
  { revalidate: 60, tags: ["products"] },
);

export const getProducts = () => productsCached();

/** Devuelve null si el producto no existe (404). */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await productCached(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

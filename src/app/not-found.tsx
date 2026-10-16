import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-lg text-center">
      <h1 className="text-2xl font-bold">404 · No encontrado</h1>
      <p className="mt-2 text-sm text-slate-600">Esa página o producto no existe.</p>
      <Link href="/productos" className="btn mt-4">Ver productos</Link>
    </div>
  );
}

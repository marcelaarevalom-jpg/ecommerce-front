import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg text-center">
      <h1 className="text-xl font-bold">Orden no encontrada</h1>
      <Link href="/pedidos" className="btn mt-4">Volver al historial</Link>
    </div>
  );
}

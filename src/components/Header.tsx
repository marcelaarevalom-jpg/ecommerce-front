import Link from "next/link";
import { cookies } from "next/headers";
import { logoutAction } from "@/app/actions/auth";
import { readCart } from "@/lib/cart";

export async function Header() {
  const logged = Boolean((await cookies()).get("token")?.value);
  const cart = await readCart();
  const count = cart.reduce((n, l) => n + l.qty, 0);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/productos" className="text-lg font-extrabold text-indigo-600">Tienda API</Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/productos" className="hover:text-indigo-600">Productos</Link>
          <Link href="/carrito" className="hover:text-indigo-600">Carrito ({count})</Link>
          {logged ? (
            <>
              <Link href="/pedidos" className="hover:text-indigo-600">Mis pedidos</Link>
              <form action={logoutAction}>
                <button className="btn-outline" type="submit">Salir</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600">Entrar</Link>
              <Link href="/registro" className="btn">Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

import { NextResponse, type NextRequest } from "next/server";

// En Next 16 "middleware.ts" se llama "proxy.ts" (mismo concepto que vimos en clase).
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const protegida = pathname.startsWith("/pedidos") || pathname.startsWith("/carrito");
  const esAuth = pathname === "/login" || pathname === "/registro";

  if (protegida && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (esAuth && token) {
    return NextResponse.redirect(new URL("/productos", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/pedidos/:path*", "/carrito/:path*", "/login", "/registro"],
};

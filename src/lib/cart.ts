import { cookies } from "next/headers";

export type CartLine = { id: number; qty: number };

/** El carrito vive en una cookie (se modifica solo desde Server Actions). */
export async function readCart(): Promise<CartLine[]> {
  const raw = (await cookies()).get("cart")?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((l) => l?.id && l?.qty > 0) : [];
  } catch {
    return [];
  }
}

export async function writeCart(lines: CartLine[]) {
  (await cookies()).set("cart", JSON.stringify(lines), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

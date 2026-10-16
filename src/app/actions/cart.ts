"use server";

import { revalidatePath } from "next/cache";
import { readCart, writeCart } from "@/lib/cart";
import { cartItemSchema } from "@/lib/schemas";

export async function addToCartAction(formData: FormData) {
  const parsed = cartItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { productId, quantity } = parsed.data;

  const cart = await readCart();
  const line = cart.find((l) => l.id === productId);
  if (line) line.qty = Math.min(line.qty + quantity, 99);
  else cart.push({ id: productId, qty: quantity });

  await writeCart(cart);
  revalidatePath("/carrito");
  revalidatePath("/", "layout"); // actualiza el contador del header
}

export async function removeFromCartAction(formData: FormData) {
  const id = Number(formData.get("productId"));
  const cart = (await readCart()).filter((l) => l.id !== id);
  await writeCart(cart);
  revalidatePath("/carrito");
  revalidatePath("/", "layout");
}

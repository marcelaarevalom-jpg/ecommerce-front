"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { loginSchema, registerSchema, type FormState } from "@/lib/schemas";

type TokenResponse = { access_token: string };

async function guardarToken(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true, // JavaScript del navegador NO puede leerla
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hora (el JWT de Laravel dura 60 min por defecto)
  });
}

function aFormState(e: unknown): FormState {
  if (e instanceof ApiError) return { error: e.message, fieldErrors: e.fieldErrors };
  return { error: "Ocurrió un error inesperado" };
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Datos inválidos", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const data = await api<TokenResponse>("/auth/register", { method: "POST", body: parsed.data });
    await guardarToken(data.access_token);
  } catch (e) {
    return aFormState(e);
  }
  redirect("/productos"); // redirect va FUERA del try/catch (lanza una excepción interna)
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Datos inválidos", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const data = await api<TokenResponse>("/auth/login", { method: "POST", body: parsed.data });
    await guardarToken(data.access_token);
  } catch (e) {
    return aFormState(e);
  }

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/productos");
}

export async function logoutAction() {
  try {
    await api("/auth/logout", { method: "POST", auth: true }); // invalida el JWT en Laravel
  } catch {
    /* si ya expiró, igual cerramos la sesión local */
  }
  const jar = await cookies();
  jar.delete("token");
  jar.delete("cart");
  redirect("/login");
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/schemas";

type Props = {
  mode: "login" | "registro";
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  next?: string;
};

export function AuthForm({ mode, action, next }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const esRegistro = mode === "registro";
  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  return (
    <form action={formAction} className="card mx-auto mt-10 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">{esRegistro ? "Crear cuenta" : "Iniciar sesión"}</h1>
      {next && <input type="hidden" name="next" value={next} />}

      {esRegistro && (
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
          <input id="name" name="name" className="input" autoComplete="name" required />
          {err("name") && <p className="mt-1 text-xs text-red-600">{err("name")}</p>}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Correo</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
        {err("email") && <p className="mt-1 text-xs text-red-600">{err("email")}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Contraseña</label>
        <input id="password" name="password" type="password" className="input"
          autoComplete={esRegistro ? "new-password" : "current-password"} required />
        {err("password") && <p className="mt-1 text-xs text-red-600">{err("password")}</p>}
      </div>
      {esRegistro && (
        <div>
          <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
          <input id="password_confirmation" name="password_confirmation" type="password" className="input"
            autoComplete="new-password" required />
          {err("password_confirmation") && (
            <p className="mt-1 text-xs text-red-600">{err("password_confirmation")}</p>
          )}
        </div>
      )}

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton className="btn w-full" pending={esRegistro ? "Creando cuenta…" : "Entrando…"}>
        {esRegistro ? "Registrarme" : "Entrar"}
      </SubmitButton>

      <p className="text-center text-sm text-slate-600">
        {esRegistro ? (
          <>¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-indigo-600">Inicia sesión</Link></>
        ) : (
          <>¿No tienes cuenta? <Link href="/registro" className="font-semibold text-indigo-600">Regístrate</Link></>
        )}
      </p>
    </form>
  );
}

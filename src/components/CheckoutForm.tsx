"use client";

import { useActionState } from "react";
import { createOrderAction } from "@/app/actions/orders";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/schemas";

export function CheckoutForm() {
  const [state, action] = useActionState<FormState, FormData>(createOrderAction, {});
  return (
    <form action={action} className="space-y-2">
      <SubmitButton className="btn w-full" pending="Creando orden…">Crear orden</SubmitButton>
      {state.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}

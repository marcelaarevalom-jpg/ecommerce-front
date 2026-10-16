"use client";

import { useActionState } from "react";
import { payOrderAction } from "@/app/actions/orders";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/schemas";

export function PayForm({ orderId }: { orderId: number }) {
  const [state, action] = useActionState<FormState, FormData>(payOrderAction, {});
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <SubmitButton className="btn w-full sm:w-auto" pending="Procesando pago con Stripe…">
        Pagar con Stripe
      </SubmitButton>
      {state.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}

"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pending: label = "Procesando…", className = "btn" }: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? label : children}
    </button>
  );
}

import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { registerAction } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return <AuthForm mode="registro" action={registerAction} />;
}

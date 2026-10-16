import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tienda API", template: "%s · Tienda API" },
  description: "E-commerce en Next.js que consume una API Laravel con JWT, Swagger y Stripe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Suspense: el header (lee cookies) se transmite sin bloquear el resto de la página */}
        <Suspense fallback={<div className="h-[57px] border-b border-slate-200 bg-white" />}>
          <Header />
        </Suspense>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

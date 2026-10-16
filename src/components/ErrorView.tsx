"use client";

type Props = {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
  unstable_retry?: () => void;
};

/**
 * Pantalla de error compartida por todos los error.tsx.
 * - retry: vuelve a pedir los datos al servidor (Next 16.3+).
 * - reset: solo vuelve a pintar el componente, sin pedir datos otra vez.
 */
export function ErrorView({ error, reset, retry, unstable_retry }: Props) {
  const reintentar = retry ?? unstable_retry ?? reset;
  return (
    <div className="card mx-auto mt-10 max-w-lg text-center">
      <h2 className="text-xl font-bold text-red-700">Algo salió mal</h2>
      <p className="mt-2 text-sm text-slate-600">{error.message || "Error inesperado"}</p>
      {reintentar && (
        <button onClick={() => reintentar()} className="btn mt-4">
          Reintentar
        </button>
      )}
    </div>
  );
}

export const money = (v: string | number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(v));

export const fecha = (iso: string) =>
  new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export const estadoOrden = (s: string) =>
  s === "paid" ? "Pagada" : s === "pending" ? "Pendiente de pago" : s;

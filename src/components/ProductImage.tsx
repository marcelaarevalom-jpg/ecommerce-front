import Image from "next/image";

// La API no guarda fotos, así que usamos 3 imágenes de ejemplo según el id del producto.
// next/image las convierte a AVIF/WebP, les da tamaño fijo (sin saltos = CLS 0) y las carga perezosas.
export function ProductImage({ id, name, priority = false, className = "" }: {
  id: number;
  name: string;
  priority?: boolean;
  className?: string;
}) {
  const n = (Math.abs(id) % 3) + 1;
  return (
    <Image
      src={`/producto-${n}.jpg`}
      alt={name}
      width={640}
      height={480}
      sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
      priority={priority}
      className={`h-auto w-full rounded-xl object-cover ${className}`}
    />
  );
}

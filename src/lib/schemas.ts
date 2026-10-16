import { z } from "zod";

// Mismas reglas que RegisterRequest.php de la API (name, email, password min 8 + confirmación)
export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre es muy corto").max(255),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  ok?: boolean;
};

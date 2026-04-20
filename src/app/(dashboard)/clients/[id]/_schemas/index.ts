import * as z from "zod"

export const createClientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  tax_id: z.string().min(1, "El NIF/CIF es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  email: z.email("El correo electrónico no es válido").trim().or(z.literal("")),
})

export const createClientResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export const updateClientSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio").optional(),
  tax_id: z.string().min(1, "El NIF/CIF es obligatorio").optional(),
  address: z.string().min(1, "La dirección es obligatoria").optional(),
  email: z
    .email("El correo electrónico no es válido")
    .trim()
    .or(z.literal(""))
    .optional(),
})

export const updateClientResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export type CreateClientSchema = z.infer<typeof createClientSchema>
export type UpdateClientSchema = z.infer<typeof updateClientSchema>

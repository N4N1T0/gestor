import { expensesTypes } from "@/data/config"
import * as z from "zod"

const isDateInFuture = (dateValue: string) => {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date > new Date()
}

const categorySchema = z
  .string()
  .refine(
    (value) => expensesTypes.includes(value),
    "La categoría del gasto no es válida"
  )

export const createExpenseSchema = z
  .object({
    date: z.string().min(1, "La fecha del gasto es obligatoria"),
    description: z.string().min(1, "La descripción es obligatoria"),
    category: categorySchema,
    amount: z.number().min(0, "El importe no puede ser negativo"),
    vat_rate: z.number().min(0).optional().nullable(),
    vat_amount: z.number().min(0).optional().nullable(),
    total: z.number().min(0, "El total no puede ser negativo"),
    receipt_url: z
      .string()
      .max(50, "La URL del archivo no puede exceder los 50 caracteres")
      .optional()
      .nullable(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (isDateInFuture(data.date)) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "La fecha del gasto no puede estar en el futuro",
      })
    }
  })

export const createExpenseResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export const updateExpenseSchema = z
  .object({
    id: z.string().min(1, "El ID es obligatorio"),
    date: z.string().min(1, "La fecha del gasto es obligatoria").optional(),
    description: z.string().min(1, "La descripción es obligatoria").optional(),
    category: categorySchema.optional(),
    amount: z.number().min(0).optional(),
    vat_rate: z.number().min(0).optional().nullable(),
    vat_amount: z.number().min(0).optional().nullable(),
    total: z.number().min(0).optional(),
    receipt_url: z
      .string()
      .max(50, "La URL del archivo no puede exceder los 50 caracteres")
      .optional()
      .nullable(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.date) {
      return
    }

    if (isDateInFuture(data.date)) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "La fecha del gasto no puede estar en el futuro",
      })
    }
  })

export const updateExpenseResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export const deleteExpenseSchema = z
  .object({
    id: z.string().min(1, "El ID es obligatorio"),
    confirmation_id: z
      .string()
      .min(1, "Debes escribir el ID del gasto para confirmar"),
  })
  .superRefine((data, ctx) => {
    if (data.id !== data.confirmation_id) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmation_id"],
        message: "El ID del gasto no coincide",
      })
    }
  })

export const deleteExpenseResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>
export type DeleteExpenseSchema = z.infer<typeof deleteExpenseSchema>

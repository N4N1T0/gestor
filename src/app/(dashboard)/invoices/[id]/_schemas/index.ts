import { InvoicesStatus } from "@/types/appwrite"
import * as z from "zod"

const isDueDateBeforeIssueDate = (issueDate: string, dueDate: string) => {
  const issue = new Date(issueDate)
  const due = new Date(dueDate)

  if (Number.isNaN(issue.getTime()) || Number.isNaN(due.getTime())) {
    return false
  }

  return due < issue
}

export const createInvoiceSchema = z
  .object({
    invoice_number: z.string().min(1, "El número de factura es obligatorio"),
    issue_date: z.string().min(1, "La fecha de emisión es obligatoria"),
    due_date: z.string().or(z.literal("")).optional(),
    description: z.string().min(1, "La descripción es obligatoria"),
    subtotal: z.number().min(0, "El subtotal no puede ser negativo"),
    vat_amount: z.number().min(0).optional().nullable(),
    total: z.number().min(0, "El total no puede ser negativo"),
    status: z.enum(InvoicesStatus).default(InvoicesStatus.DRAFT),
  })
  .superRefine((data, ctx) => {
    if (!data.due_date) {
      return
    }

    if (isDueDateBeforeIssueDate(data.issue_date, data.due_date)) {
      ctx.addIssue({
        code: "custom",
        path: ["due_date"],
        message:
          "La fecha de vencimiento no puede ser anterior a la fecha de emisión",
      })
    }
  })

export const createInvoiceResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export const updateInvoiceSchema = z
  .object({
    id: z.string().min(1, "El ID es obligatorio"),
    invoice_number: z
      .string()
      .min(1, "El número de factura es obligatorio")
      .optional(),
    issue_date: z
      .string()
      .min(1, "La fecha de emisión es obligatoria")
      .optional(),
    due_date: z.string().or(z.literal("")).optional(),
    description: z.string().min(1, "La descripción es obligatoria").optional(),
    subtotal: z.number().min(0).optional(),
    vat_amount: z.number().min(0).optional().nullable(),
    total: z.number().min(0).optional(),
    status: z.enum(InvoicesStatus).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.issue_date || !data.due_date) {
      return
    }

    if (isDueDateBeforeIssueDate(data.issue_date, data.due_date)) {
      ctx.addIssue({
        code: "custom",
        path: ["due_date"],
        message:
          "La fecha de vencimiento no puede ser anterior a la fecha de emisión",
      })
    }
  })

export const updateInvoiceResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceSchema = z.infer<typeof updateInvoiceSchema>

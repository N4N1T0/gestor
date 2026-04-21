"use server"

import { createInvoiceRow, updateInvoiceRow } from "@/lib/api"
import { actionClient } from "@/lib/next-safe-actions"
import { catchError } from "@/lib/utils"
import { AppwriteException } from "appwrite"

import {
  createInvoiceResponseSchema,
  createInvoiceSchema,
  updateInvoiceResponseSchema,
  updateInvoiceSchema,
} from "../_schemas"

export const createInvoice = actionClient
  .inputSchema(createInvoiceSchema)
  .outputSchema(createInvoiceResponseSchema)
  .action(async ({ parsedInput }) => {
    const [error, data] = await catchError(
      createInvoiceRow({
        client_id: parsedInput.client_id,
        invoice_number: parsedInput.invoice_number,
        issue_date: parsedInput.issue_date,
        due_date:
          parsedInput.due_date === "" ? null : (parsedInput.due_date ?? null),
        description: parsedInput.description,
        subtotal: parsedInput.subtotal,
        vat_amount: parsedInput.vat_amount ?? null,
        total: parsedInput.total,
        status: parsedInput.status,
        file_url: parsedInput.file_url ?? null,
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo crear la factura")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

export const updateInvoice = actionClient
  .inputSchema(updateInvoiceSchema)
  .outputSchema(updateInvoiceResponseSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...fields } = parsedInput

    const [error, data] = await catchError(
      updateInvoiceRow(id, {
        ...(fields.client_id !== undefined && { client_id: fields.client_id }),
        ...(fields.invoice_number !== undefined && {
          invoice_number: fields.invoice_number,
        }),
        ...(fields.issue_date !== undefined && {
          issue_date: fields.issue_date,
        }),
        ...(fields.due_date !== undefined && {
          due_date: fields.due_date === "" ? null : fields.due_date,
        }),
        ...(fields.description !== undefined && {
          description: fields.description,
        }),
        ...(fields.subtotal !== undefined && { subtotal: fields.subtotal }),
        ...(fields.vat_amount !== undefined && {
          vat_amount: fields.vat_amount,
        }),
        ...(fields.total !== undefined && { total: fields.total }),
        ...(fields.status !== undefined && { status: fields.status }),
        ...(fields.file_url !== undefined && { file_url: fields.file_url }),
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo actualizar la factura")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

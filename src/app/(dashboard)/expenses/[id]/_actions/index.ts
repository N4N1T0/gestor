"use server"

import {
  createExpenseRow,
  deleteExpenseRow,
  getExpenseById,
  updateExpenseRow,
} from "@/lib/api"
import { actionClient } from "@/lib/next-safe-actions"
import { catchError } from "@/lib/utils"
import { AppwriteException } from "appwrite"

import {
  createExpenseResponseSchema,
  createExpenseSchema,
  deleteExpenseResponseSchema,
  deleteExpenseSchema,
  updateExpenseResponseSchema,
  updateExpenseSchema,
} from "../_schemas"

export const createExpense = actionClient
  .inputSchema(createExpenseSchema)
  .outputSchema(createExpenseResponseSchema)
  .action(async ({ parsedInput }) => {
    const [error, data] = await catchError(
      createExpenseRow({
        date: parsedInput.date,
        supplier_id: null,
        description: parsedInput.description,
        category: parsedInput.category,
        amount: parsedInput.amount,
        vat_rate: parsedInput.vat_rate ?? null,
        vat_amount: parsedInput.vat_amount ?? null,
        total: parsedInput.total,
        receipt_url: parsedInput.receipt_url ?? null,
        notes: parsedInput.notes ?? null,
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo crear el gasto")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

export const updateExpense = actionClient
  .inputSchema(updateExpenseSchema)
  .outputSchema(updateExpenseResponseSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...fields } = parsedInput

    const [error, data] = await catchError(
      updateExpenseRow(id, {
        ...(fields.date !== undefined && { date: fields.date }),
        ...(fields.description !== undefined && {
          description: fields.description,
        }),
        ...(fields.category !== undefined && { category: fields.category }),
        ...(fields.amount !== undefined && { amount: fields.amount }),
        ...(fields.vat_rate !== undefined && { vat_rate: fields.vat_rate }),
        ...(fields.vat_amount !== undefined && {
          vat_amount: fields.vat_amount,
        }),
        ...(fields.total !== undefined && { total: fields.total }),
        ...(fields.receipt_url !== undefined && {
          receipt_url: fields.receipt_url,
        }),
        ...(fields.notes !== undefined && { notes: fields.notes }),
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo actualizar el gasto")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

export const deleteExpense = actionClient
  .inputSchema(deleteExpenseSchema)
  .outputSchema(deleteExpenseResponseSchema)
  .action(async ({ parsedInput }) => {
    const [expenseError, expense] = await catchError(
      getExpenseById(parsedInput.id)
    )

    if (expenseError) {
      if (expenseError instanceof AppwriteException) {
        throw new Error(expenseError.message ?? "No se pudo validar el gasto")
      }

      throw new Error(expenseError.message ?? "Ocurrió un error inesperado")
    }

    if (!expense) {
      throw new Error("El gasto no existe")
    }

    if (expense.$id !== parsedInput.confirmation_id) {
      throw new Error("El ID del gasto no coincide")
    }

    const [deleteError, id] = await catchError(deleteExpenseRow(parsedInput.id))

    if (deleteError) {
      if (deleteError instanceof AppwriteException) {
        throw new Error(deleteError.message ?? "No se pudo eliminar el gasto")
      }

      throw new Error(deleteError.message ?? "Ocurrió un error inesperado")
    }

    return {
      id,
      success: true,
    }
  })

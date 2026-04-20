"use server"

import { createClientRow, updateClientRow } from "@/lib/api"
import { actionClient } from "@/lib/next-safe-actions"
import { catchError } from "@/lib/utils"
import { AppwriteException } from "appwrite"

import {
  createClientResponseSchema,
  createClientSchema,
  updateClientResponseSchema,
  updateClientSchema,
} from "../_schemas"

export const createClient = actionClient
  .inputSchema(createClientSchema)
  .outputSchema(createClientResponseSchema)
  .action(async ({ parsedInput }) => {
    const [error, data] = await catchError(
      createClientRow({
        name: parsedInput.name,
        tax_id: parsedInput.tax_id,
        address: parsedInput.address,
        email: parsedInput.email === "" ? null : parsedInput.email,
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo crear el cliente")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

export const updateClient = actionClient
  .inputSchema(updateClientSchema)
  .outputSchema(updateClientResponseSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...fields } = parsedInput

    const [error, data] = await catchError(
      updateClientRow(id, {
        ...(fields.name !== undefined && { name: fields.name }),
        ...(fields.tax_id !== undefined && { tax_id: fields.tax_id }),
        ...(fields.address !== undefined && { address: fields.address }),
        ...(fields.email !== undefined && {
          email: fields.email === "" ? null : fields.email,
        }),
      })
    )

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "No se pudo actualizar el cliente")
      }

      throw new Error(error.message ?? "Ocurrió un error inesperado")
    }

    return {
      id: data.$id,
      success: true,
    }
  })

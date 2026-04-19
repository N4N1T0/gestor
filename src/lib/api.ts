import { honoConfig } from "@/hono/config"
import { createAdminClient } from "@/lib/appwrite"
import { AppwriteException } from "node-appwrite"

export interface ClientDetails {
  $id: string
  name: string
  tax_id: string
  address: string
  email: string | null
}

export async function getClientById(id: string): Promise<ClientDetails | null> {
  try {
    const { tablesDB } = await createAdminClient()
    const row = await tablesDB.getRow({
      databaseId: honoConfig.appwrite.databaseId,
      tableId: honoConfig.appwrite.clientsTableId,
      rowId: id,
    })
    const rowData = row as Record<string, unknown>

    return {
      $id: String(row.$id),
      name: String(rowData.name ?? ""),
      tax_id: String(rowData.tax_id ?? ""),
      address: String(rowData.address ?? ""),
      email:
        rowData.email === null || rowData.email === undefined
          ? null
          : String(rowData.email),
    }
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) {
      return null
    }

    throw error
  }
}

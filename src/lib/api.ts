import { honoConfig } from "@/features/hono/config"
import { createAdminClient } from "@/lib/appwrite"
import { Clients } from "@/types/appwrite"
import { ID, Query } from "node-appwrite"

export type ClientDetails = Clients

export type CreateClientPayload = Pick<
  Clients,
  "name" | "tax_id" | "address" | "email"
>

export type UpdateClientPayload = Partial<CreateClientPayload>

// CLIENTS API
export async function getClientById(id: string): Promise<Clients | null> {
  const { tablesDB } = await createAdminClient()
  const row = await tablesDB.getRow<Clients>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.clientsTableId,
    rowId: id,
  })

  return row
}

export async function fetchClients(): Promise<Clients[]> {
  const { tablesDB } = await createAdminClient()

  const rows = await tablesDB.listRows<Clients>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.clientsTableId,
    queries: [Query.limit(50)],
  })

  return rows.rows
}

export async function updateClientRow(
  id: string,
  payload: UpdateClientPayload
): Promise<Clients> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.updateRow<Clients>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.clientsTableId,
    rowId: id,
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.tax_id !== undefined && { tax_id: payload.tax_id }),
      ...(payload.address !== undefined && { address: payload.address }),
      ...(payload.email !== undefined && { email: payload.email }),
    },
  })

  return row
}

export async function createClientRow(
  payload: CreateClientPayload
): Promise<Clients> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.createRow<Clients>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.clientsTableId,
    rowId: ID.unique(),
    data: {
      name: payload.name,
      tax_id: payload.tax_id,
      address: payload.address,
      email: payload.email,
    },
  })

  return row
}

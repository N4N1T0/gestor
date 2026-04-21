import { honoConfig } from "@/features/hono/config"
import { createAdminClient } from "@/lib/appwrite"
import { Clients, Invoices } from "@/types/appwrite"
import { ID, Query } from "node-appwrite"

export type ClientDetails = Clients

export type CreateClientPayload = Pick<
  Clients,
  "name" | "tax_id" | "address" | "email"
>

export type UpdateClientPayload = Partial<CreateClientPayload>

export type InvoiceDetails = Invoices

export type CreateInvoicePayload = Pick<
  Invoices,
  | "invoice_number"
  | "issue_date"
  | "due_date"
  | "description"
  | "subtotal"
  | "vat_amount"
  | "total"
  | "status"
>

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>

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

// INVOICES API
export async function getInvoiceById(id: string): Promise<Invoices | null> {
  const { tablesDB } = await createAdminClient()
  const row = await tablesDB.getRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    rowId: id,
  })

  return row as unknown as Invoices
}

export async function fetchInvoices(): Promise<Invoices[]> {
  const { tablesDB } = await createAdminClient()

  const rows = await tablesDB.listRows({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    queries: [Query.limit(50)],
  })

  return rows.rows as unknown as Invoices[]
}

export async function createInvoiceRow(
  payload: CreateInvoicePayload
): Promise<Invoices> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.createRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    rowId: ID.unique(),
    data: {
      invoice_number: payload.invoice_number,
      issue_date: payload.issue_date,
      due_date: payload.due_date ?? null,
      description: payload.description,
      subtotal: payload.subtotal,
      vat_amount: payload.vat_amount ?? null,
      total: payload.total,
      status: payload.status,
    },
  })

  return row as unknown as Invoices
}

export async function updateInvoiceRow(
  id: string,
  payload: UpdateInvoicePayload
): Promise<Invoices> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.updateRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    rowId: id,
    data: {
      ...(payload.invoice_number !== undefined && {
        invoice_number: payload.invoice_number,
      }),
      ...(payload.issue_date !== undefined && {
        issue_date: payload.issue_date,
      }),
      ...(payload.due_date !== undefined && { due_date: payload.due_date }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      ...(payload.subtotal !== undefined && { subtotal: payload.subtotal }),
      ...(payload.vat_amount !== undefined && {
        vat_amount: payload.vat_amount,
      }),
      ...(payload.total !== undefined && { total: payload.total }),
      ...(payload.status !== undefined && { status: payload.status }),
    },
  })

  return row as unknown as Invoices
}

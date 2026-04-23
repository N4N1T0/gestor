import { honoConfig } from "@/features/hono/config"
import { createAdminClient } from "@/lib/appwrite/server"
import { Clients, Expenses, Invoices } from "@/types/appwrite"
import { ID, Query } from "node-appwrite"

export type ClientDetails = Clients

export type CreateClientPayload = Pick<
  Clients,
  "name" | "tax_id" | "address" | "email"
>

export type UpdateClientPayload = Partial<CreateClientPayload>

export type InvoiceDetails = Invoices

export type CreateInvoicePayload = {
  client_id: string
  invoice_number: Invoices["invoice_number"]
  issue_date: Invoices["issue_date"]
  due_date: Invoices["due_date"]
  description: Invoices["description"]
  subtotal: Invoices["subtotal"]
  vat_amount: Invoices["vat_amount"]
  total: Invoices["total"]
  status: Invoices["status"]
  file_url: Invoices["file_url"]
}

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>

export type ExpenseDetails = Expenses

export type CreateExpensePayload = {
  date: Expenses["date"]
  supplier_id: Expenses["supplier_id"]
  description: Expenses["description"]
  category: Expenses["category"]
  amount: Expenses["amount"]
  vat_rate: Expenses["vat_rate"]
  vat_amount: Expenses["vat_amount"]
  total: Expenses["total"]
  receipt_url: Expenses["receipt_url"]
  notes: Expenses["notes"]
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>

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
  const row = await tablesDB.getRow<Invoices>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    rowId: id,
  })

  return row
}

export async function fetchInvoices(): Promise<Invoices[]> {
  const { tablesDB } = await createAdminClient()

  const rows = await tablesDB.listRows<Invoices>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    queries: [Query.limit(50), Query.select(["*", "client_id.name"])],
  })

  return rows.rows
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
      client_id: payload.client_id,
      invoice_number: payload.invoice_number,
      issue_date: payload.issue_date,
      due_date: payload.due_date ?? null,
      description: payload.description,
      subtotal: payload.subtotal,
      vat_amount: payload.vat_amount ?? null,
      total: payload.total,
      status: payload.status,
      file_url: payload.file_url ?? null,
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
      ...(payload.client_id !== undefined && { client_id: payload.client_id }),
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
      ...(payload.file_url !== undefined && { file_url: payload.file_url }),
    },
  })

  return row as unknown as Invoices
}

export async function deleteInvoiceRow(id: string): Promise<string> {
  const { tablesDB } = await createAdminClient()

  await tablesDB.deleteRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.invoicesTableId,
    rowId: id,
  })

  return id
}

// EXPENSES API
export async function getExpenseById(id: string): Promise<Expenses | null> {
  const { tablesDB } = await createAdminClient()
  const row = await tablesDB.getRow<Expenses>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.expensesTableId,
    rowId: id,
  })

  return row
}

export async function fetchExpenses(): Promise<Expenses[]> {
  const { tablesDB } = await createAdminClient()

  const rows = await tablesDB.listRows<Expenses>({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.expensesTableId,
    queries: [Query.limit(50)],
  })

  return rows.rows
}

export async function createExpenseRow(
  payload: CreateExpensePayload
): Promise<Expenses> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.createRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.expensesTableId,
    rowId: ID.unique(),
    data: {
      date: payload.date,
      supplier_id: payload.supplier_id ?? null,
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
      vat_rate: payload.vat_rate ?? null,
      vat_amount: payload.vat_amount ?? null,
      total: payload.total,
      receipt_url: payload.receipt_url ?? null,
      notes: payload.notes ?? null,
    },
  })

  return row as unknown as Expenses
}

export async function updateExpenseRow(
  id: string,
  payload: UpdateExpensePayload
): Promise<Expenses> {
  const { tablesDB } = await createAdminClient()

  const row = await tablesDB.updateRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.expensesTableId,
    rowId: id,
    data: {
      ...(payload.date !== undefined && { date: payload.date }),
      ...(payload.supplier_id !== undefined && {
        supplier_id: payload.supplier_id,
      }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      ...(payload.category !== undefined && { category: payload.category }),
      ...(payload.amount !== undefined && { amount: payload.amount }),
      ...(payload.vat_rate !== undefined && { vat_rate: payload.vat_rate }),
      ...(payload.vat_amount !== undefined && {
        vat_amount: payload.vat_amount,
      }),
      ...(payload.total !== undefined && { total: payload.total }),
      ...(payload.receipt_url !== undefined && {
        receipt_url: payload.receipt_url,
      }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
    },
  })

  return row as unknown as Expenses
}

export async function deleteExpenseRow(id: string): Promise<string> {
  const { tablesDB } = await createAdminClient()

  await tablesDB.deleteRow({
    databaseId: honoConfig.appwrite.databaseId,
    tableId: honoConfig.appwrite.expensesTableId,
    rowId: id,
  })

  return id
}

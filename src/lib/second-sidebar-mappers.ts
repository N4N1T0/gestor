import { SecondSidebarCardData } from "@/types"
import { Clients, Expenses, Invoices } from "@/types/appwrite"

export const mapClientToSidebarItem = (
  client: Clients
): SecondSidebarCardData => {
  return {
    id: client.$id,
    slug: client.$id,
    title: client.name,
    meta: client.tax_id ?? "",
    description: client.address ?? "",
  }
}

export const mapInvoiceToSidebarItem = (
  invoice: Invoices
): SecondSidebarCardData => {
  return {
    id: invoice.$id,
    slug: invoice.$id,
    title: invoice.invoice_number,
    meta: invoice.client_id?.name,
    description: invoice.description ?? "",
  }
}

export const mapExpenseToSidebarItem = (
  expense: Expenses
): SecondSidebarCardData => {
  return {
    id: expense.$id,
    slug: expense.$id,
    title: expense.description,
    meta: expense.category,
    description: expense.notes ?? "",
  }
}

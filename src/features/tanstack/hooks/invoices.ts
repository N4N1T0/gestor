import { SecondSidebarCardData } from "@/types"
import { Invoices } from "@/types/appwrite"
import { useQuery } from "@tanstack/react-query"
import { tanstackKeys } from "../keys"

// TYPES
interface GetInvoices {
  enabled: boolean
}

interface GetInvoiceById {
  id: string
  enabled: boolean
}

// API
const fetchInvoices = async (): Promise<SecondSidebarCardData[]> => {
  const response = await fetch("/api/invoices")

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch invoices (${response.status})`
    )
  }

  return response.json()
}

const fetchInvoiceById = async (id: string): Promise<Invoices> => {
  const response = await fetch(`/api/invoices/${id}`)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch invoice (${response.status})`
    )
  }

  return response.json()
}

// HOOKS
export const useGetInvoices = ({ enabled }: GetInvoices) => {
  return useQuery({
    queryKey: tanstackKeys.invoices,
    queryFn: fetchInvoices,
    enabled,
  })
}

export const useGetInvoiceById = ({ id, enabled }: GetInvoiceById) => {
  return useQuery({
    queryKey: tanstackKeys.invoice(id),
    queryFn: () => fetchInvoiceById(id),
    enabled,
  })
}

import { SecondSidebarCardData } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { tanstackKeys } from "../keys"

interface GetInvoices {
  enabled: boolean
}

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

export const useGetInvoices = ({ enabled }: GetInvoices) => {
  return useQuery({
    queryKey: tanstackKeys.invoices,
    queryFn: fetchInvoices,
    enabled,
  })
}

import { SecondSidebarCardData } from "@/types"
import { Clients } from "@/types/appwrite"
import { useQuery } from "@tanstack/react-query"
import { tanstackKeys } from "../keys"

// TYPES
interface GetClients {
  enabled: boolean
}

interface GetClientById {
  id: string
  enabled: boolean
}

// API
const fetchClients = async (): Promise<SecondSidebarCardData[]> => {
  const response = await fetch("/api/clients")

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch draft artists (${response.status})`
    )
  }
  return response.json()
}

const fetchClientById = async (id: string): Promise<Clients> => {
  const response = await fetch(`/api/clients/${id}`)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch client (${response.status})`
    )
  }

  return response.json()
}

// HOOKS
export const useGetClients = ({ enabled }: GetClients) => {
  return useQuery({
    queryKey: tanstackKeys.clients,
    queryFn: fetchClients,
    enabled,
  })
}

export const useGetClientById = ({ id, enabled }: GetClientById) => {
  return useQuery({
    queryKey: tanstackKeys.client(id),
    queryFn: () => fetchClientById(id),
    enabled,
  })
}

import { SecondSidebarCardData } from "@/types"
import { Expenses } from "@/types/appwrite"
import { useQuery } from "@tanstack/react-query"
import { tanstackKeys } from "../keys"

// TYPES
interface GetExpenses {
  enabled: boolean
}

interface GetExpenseById {
  id: string
  enabled: boolean
}

// API
const fetchExpenses = async (): Promise<SecondSidebarCardData[]> => {
  const response = await fetch("/api/expenses")

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch expenses (${response.status})`
    )
  }

  return response.json()
}

const fetchExpenseById = async (id: string): Promise<Expenses> => {
  const response = await fetch(`/api/expenses/${id}`)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to fetch expense (${response.status})`
    )
  }

  return response.json()
}

// HOOKS
export const useGetExpenses = ({ enabled }: GetExpenses) => {
  return useQuery({
    queryKey: tanstackKeys.expenses,
    queryFn: fetchExpenses,
    enabled,
  })
}

export const useGetExpenseById = ({ id, enabled }: GetExpenseById) => {
  return useQuery({
    queryKey: tanstackKeys.expense(id),
    queryFn: () => fetchExpenseById(id),
    enabled,
  })
}

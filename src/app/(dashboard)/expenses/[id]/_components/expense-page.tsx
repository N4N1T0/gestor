"use client"

import { CreateNewDataBtn } from "@/app/(dashboard)/_components/create-new-data-btn"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetExpenseById } from "@/features/tanstack/hooks/expenses"
import { getStorageFileViewUrl } from "@/lib/appwrite/client"
import { NavMainItems, NewDataAction } from "@/types"
import CreateExpenseSheet from "@dashboard/expenses/_components/create-expense-sheet"
import { useState } from "react"
import DeleteExpenseAlertDialog from "./delete-expense-alert-dialog"
import ExpenseFilePreviewCard from "./expense-file-preview-card"
import ExpenseFinancialCard from "./expense-financial-card"
import ExpenseMainCard from "./expense-main-card"

interface ExpensePageProps {
  id: string
}

export default function ExpensePage({ id }: ExpensePageProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: expense,
    isPending,
    isError,
    error,
  } = useGetExpenseById({
    id,
    enabled: Boolean(id),
  })

  const filePreviewUrl = expense?.receipt_url
    ? getStorageFileViewUrl(expense.receipt_url)
    : null

  if (isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-115 w-full" />
          <div className="col-span-1 space-y-4">
            <Skeleton className="h-55 w-full" />
            <Skeleton className="h-55 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !expense) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error instanceof Error ? error.message : "No se pudo cargar el gasto"}
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{expense.description}</h1>
          <p className="text-sm text-muted-foreground">Información del gasto</p>
        </div>

        <div className="flex items-center gap-2">
          <DeleteExpenseAlertDialog
            expense={expense}
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />

          <CreateNewDataBtn
            dataSource={NavMainItems.EXPENSES}
            action={NewDataAction.EDIT}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CreateExpenseSheet expense={expense} key={expense.$id} />
        <ExpenseFilePreviewCard filePreviewUrl={filePreviewUrl} />
        <div className="col-span-1 flex flex-col gap-4">
          <ExpenseMainCard expense={expense} />
          <ExpenseFinancialCard expense={expense} />
        </div>
      </div>
    </>
  )
}

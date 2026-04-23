"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { tanstackKeys } from "@/features/tanstack/keys"
import { Expenses } from "@/types/appwrite"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteExpense } from "../_actions"

interface DeleteExpenseAlertDialogProps {
  expense: Expenses
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteExpenseAlertDialog({
  expense,
  isOpen,
  onOpenChange,
}: DeleteExpenseAlertDialogProps) {
  const [confirmationId, setConfirmationId] = useState("")
  const queryClient = useQueryClient()
  const router = useRouter()

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteExpense,
    {
      onSuccess: ({ data }) => {
        if (!data?.success) {
          toast.error("No se pudo eliminar el gasto")
          return
        }

        toast.success("Gasto eliminado correctamente")
        onOpenChange(false)
        setConfirmationId("")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.expenses })
        queryClient.invalidateQueries({
          queryKey: tanstackKeys.expense(expense.$id),
        })
        router.push("/dashboard")
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo eliminar el gasto")
      },
    }
  )

  const isConfirmationValid = confirmationId === expense.$id

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setConfirmationId("")
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            aria-label="Eliminar gasto"
            onClick={() => onOpenChange(true)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Eliminar gasto</TooltipContent>
      </Tooltip>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Para confirmar, escribe el ID del
            gasto <strong>{expense.$id}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={confirmationId}
          onChange={(event) => setConfirmationId(event.target.value)}
          placeholder={expense.$id}
          aria-label="Confirmación de ID de gasto"
          disabled={isDeleting}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!isConfirmationValid || isDeleting}
            onClick={(event) => {
              event.preventDefault()

              if (!isConfirmationValid || isDeleting) {
                return
              }

              executeDelete({
                id: expense.$id,
                confirmation_id: confirmationId,
              })
            }}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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
import { Invoices } from "@/types/appwrite"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteInvoice } from "../_actions"

interface DeleteInvoiceAlertDialogProps {
  invoice: Invoices
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteInvoiceAlertDialog({
  invoice,
  isOpen,
  onOpenChange,
}: DeleteInvoiceAlertDialogProps) {
  const [confirmationName, setConfirmationName] = useState("")
  const queryClient = useQueryClient()
  const router = useRouter()

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteInvoice,
    {
      onSuccess: ({ data }) => {
        if (!data?.success) {
          toast.error("No se pudo eliminar la factura")
          return
        }

        toast.success("Factura eliminada correctamente")
        onOpenChange(false)
        setConfirmationName("")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.invoices })
        queryClient.invalidateQueries({
          queryKey: tanstackKeys.invoice(invoice.$id),
        })
        router.push("/invoices")
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo eliminar la factura")
      },
    }
  )

  const isConfirmationValid = confirmationName === invoice.invoice_number

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setConfirmationName("")
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            aria-label="Eliminar factura"
            onClick={() => onOpenChange(true)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Eliminar factura</TooltipContent>
      </Tooltip>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar factura</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Para confirmar, escribe el número
            de factura <strong>{invoice.invoice_number}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={confirmationName}
          onChange={(event) => setConfirmationName(event.target.value)}
          placeholder={invoice.invoice_number}
          aria-label="Confirmación de número de factura"
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
                id: invoice.$id,
                invoice_number: invoice.invoice_number,
                confirmation_name: confirmationName,
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

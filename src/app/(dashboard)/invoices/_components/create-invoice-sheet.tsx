"use client"

import {
  createInvoice,
  updateInvoice,
} from "@/app/(dashboard)/invoices/[id]/_actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { tanstackKeys } from "@/features/tanstack/keys"
import { useCreateNewData } from "@/hooks/use-create-new-data"
import { cn } from "@/lib/utils"
import { NavMainItems, NewDataAction } from "@/types"
import { InvoicesStatus, type Invoices } from "@/types/appwrite"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { formatDate } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateInvoiceSchema, createInvoiceSchema } from "../[id]/_schemas"

interface CreateInvoiceSheetProps {
  invoice?: Invoices
}

const EMPTY_FORM_VALUES: CreateInvoiceSchema = {
  invoice_number: "",
  issue_date: "",
  due_date: "",
  description: "",
  subtotal: 0,
  vat_amount: null,
  total: 0,
  status: InvoicesStatus.DRAFT,
}

export default function CreateInvoiceSheet({
  invoice,
}: CreateInvoiceSheetProps) {
  const queryClient = useQueryClient()

  // STATE
  const { newData, newDataAction, clearNewData } = useCreateNewData()
  const isEditing = Boolean(invoice) && newDataAction === NewDataAction.EDIT
  const { handleSubmit, reset, formState, control } =
    useForm<CreateInvoiceSchema>({
      resolver: zodResolver(createInvoiceSchema as never),
      defaultValues: EMPTY_FORM_VALUES,
    })

  // ACTIONS
  const { execute: executeCreate, isExecuting: isCreating } = useAction(
    createInvoice,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        toast.success("Factura creada correctamente")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.invoices })
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo crear la factura")
      },
    }
  )

  const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
    updateInvoice,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        toast.success("Factura actualizada correctamente")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.invoices })
        if (invoice) {
          queryClient.invalidateQueries({
            queryKey: tanstackKeys.invoice(invoice.$id),
          })
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo actualizar la factura")
      },
    }
  )

  // COMPUTED
  const isOpen = newData === NavMainItems.INVOICES
  const isExecuting = isCreating || isUpdating
  const isDisabled = isExecuting || formState.isSubmitting

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && invoice) {
      reset({
        invoice_number: invoice.invoice_number ?? "",
        issue_date: invoice.issue_date ?? "",
        due_date: invoice.due_date ?? "",
        description: invoice.description ?? "",
        subtotal: invoice.subtotal ?? 0,
        vat_amount: invoice.vat_amount ?? null,
        total: invoice.total ?? 0,
        status: invoice.status ?? InvoicesStatus.DRAFT,
      })
      return
    }

    reset(EMPTY_FORM_VALUES)
  }, [invoice, isEditing, isOpen, reset])

  // HANDLERS
  const onSubmit = handleSubmit((data) => {
    if (isEditing && invoice) {
      executeUpdate({ id: invoice.$id, ...data })
    } else {
      executeCreate(data)
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(EMPTY_FORM_VALUES)
      clearNewData()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar factura" : "Crear factura"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modifica los datos de la factura."
              : "Completa los datos para crear una nueva factura."}
          </SheetDescription>
        </SheetHeader>

        <form className="flex h-full flex-col gap-4 p-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name="invoice_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-number" required>
                    Número de factura
                  </FieldLabel>
                  <Input
                    id="invoice-number"
                    placeholder="FAC-0001"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="issue_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-issue-date" required>
                    Fecha de emisión
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="invoice-issue-date"
                        type="button"
                        variant="outline"
                        disabled={isDisabled}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-invalid={fieldState.invalid}
                        data-empty={field.value === "" ? true : undefined}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDate(new Date(field.value), "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() ?? "")
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="due_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-due-date">
                    Fecha de vencimiento
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="invoice-due-date"
                        type="button"
                        variant="outline"
                        disabled={isDisabled}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-invalid={fieldState.invalid}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDate(new Date(field.value), "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() ?? "")
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-description" required>
                    Descripción
                  </FieldLabel>
                  <Input
                    id="invoice-description"
                    placeholder="Servicios de consultoría"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="subtotal"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-subtotal" required>
                    Subtotal (€)
                  </FieldLabel>
                  <Input
                    id="invoice-subtotal"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="vat_amount"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-vat">IVA (€)</FieldLabel>
                  <Input
                    id="invoice-vat"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="total"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-total" required>
                    Total (€)
                  </FieldLabel>
                  <Input
                    id="invoice-total"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoice-status" required>
                    Estado
                  </FieldLabel>
                  <Select
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="invoice-status">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={InvoicesStatus.DRAFT}>
                        Borrador
                      </SelectItem>
                      <SelectItem value={InvoicesStatus.SENT}>
                        Enviada
                      </SelectItem>
                      <SelectItem value={InvoicesStatus.PAID}>
                        Pagada
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className="px-0 pb-0 border-t mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(EMPTY_FORM_VALUES)
                clearNewData()
              }}
              disabled={isDisabled}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {isExecuting
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Guardar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

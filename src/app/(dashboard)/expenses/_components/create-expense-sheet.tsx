"use client"

import {
  createExpense,
  updateExpense,
} from "@/app/(dashboard)/expenses/[id]/_actions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { expensesTypes } from "@/data/config"
import { tanstackKeys } from "@/features/tanstack/keys"
import { useCreateNewData } from "@/hooks/use-create-new-data"
import { uploadFile } from "@/lib/appwrite/client"
import { catchError } from "@/lib/utils"
import { NavMainItems, NewDataAction } from "@/types"
import { type Expenses } from "@/types/appwrite"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateExpenseSchema, createExpenseSchema } from "../[id]/_schemas"

interface CreateExpenseSheetProps {
  expense?: Expenses
}

const EMPTY_FORM_VALUES: CreateExpenseSchema = {
  date: new Date().toISOString().split("T")[0],
  description: "",
  category: "other",
  amount: 0,
  vat_rate: null,
  vat_amount: null,
  total: 0,
  receipt_url: undefined,
  notes: "",
}

export default function CreateExpenseSheet({
  expense,
}: CreateExpenseSheetProps) {
  const queryClient = useQueryClient()

  // STATE
  const [file, setFile] = useState<File | null>(null)
  const { newData, newDataAction, clearNewData } = useCreateNewData()
  const isEditing = Boolean(expense) && newDataAction === NewDataAction.EDIT
  const { handleSubmit, reset, formState, control } =
    useForm<CreateExpenseSchema>({
      resolver: zodResolver(createExpenseSchema as never),
      defaultValues: EMPTY_FORM_VALUES,
      mode: "onChange",
    })

  // ACTIONS
  const { execute: executeCreate, isExecuting: isCreating } = useAction(
    createExpense,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        setFile(null)
        toast.success("Gasto creado correctamente")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.expenses })
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo crear el gasto")
      },
    }
  )

  const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
    updateExpense,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        setFile(null)
        toast.success("Gasto actualizado correctamente")
        queryClient.invalidateQueries({ queryKey: tanstackKeys.expenses })

        if (expense) {
          queryClient.invalidateQueries({
            queryKey: tanstackKeys.expense(expense.$id),
          })
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo actualizar el gasto")
      },
    }
  )

  // COMPUTED
  const isOpen = newData === NavMainItems.EXPENSES
  const isExecuting = isCreating || isUpdating
  const isDisabled = isExecuting || formState.isSubmitting

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && expense) {
      reset({
        date: expense.date ?? EMPTY_FORM_VALUES.date,
        description: expense.description ?? "",
        category: expense.category ?? "other",
        amount: expense.amount ?? 0,
        vat_rate: expense.vat_rate ?? null,
        vat_amount: expense.vat_amount ?? null,
        total: expense.total ?? 0,
        receipt_url: expense.receipt_url ?? undefined,
        notes: expense.notes ?? "",
      })
      return
    }

    reset(EMPTY_FORM_VALUES)
  }, [expense, isEditing, isOpen, reset])

  // HANDLERS
  const onSubmit = handleSubmit(async (data) => {
    const [error, fileUrl] = await catchError(uploadFile(file))

    if (error) {
      toast.error(error.message ?? "No se pudo subir el archivo")
      return
    }

    if (isEditing && expense) {
      executeUpdate({
        id: expense.$id,
        ...data,
        receipt_url: fileUrl,
      })
    } else {
      executeCreate({
        ...data,
        receipt_url: fileUrl,
      })
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(EMPTY_FORM_VALUES)
      clearNewData()
      setFile(null)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{isEditing ? "Editar gasto" : "Crear gasto"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modifica los datos del gasto."
              : "Completa los datos para crear un nuevo gasto."}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex h-full flex-col gap-4 overflow-y-scroll p-4"
          onSubmit={onSubmit}
        >
          <FieldGroup>
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-date" required>
                    Fecha
                  </FieldLabel>
                  <Input
                    id="expense-date"
                    type="date"
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
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-description" required>
                    Descripción
                  </FieldLabel>
                  <Input
                    id="expense-description"
                    placeholder="Compra de dominio, coworking, etc."
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
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-category" required>
                    Categoría
                  </FieldLabel>
                  <Select
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {expensesTypes.map((expenseType) => (
                        <SelectItem key={expenseType} value={expenseType}>
                          {expenseType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-amount" required>
                    Importe
                  </FieldLabel>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={Number.isFinite(field.value) ? field.value : 0}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      field.onChange(Number.isNaN(nextValue) ? 0 : nextValue)
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="vat_rate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-vat-rate">IVA (%)</FieldLabel>
                  <Input
                    id="expense-vat-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const rawValue = event.target.value
                      if (rawValue === "") {
                        field.onChange(null)
                        return
                      }

                      const nextValue = Number(rawValue)
                      field.onChange(Number.isNaN(nextValue) ? null : nextValue)
                    }}
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
                  <FieldLabel htmlFor="expense-vat-amount">IVA (€)</FieldLabel>
                  <Input
                    id="expense-vat-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const rawValue = event.target.value
                      if (rawValue === "") {
                        field.onChange(null)
                        return
                      }

                      const nextValue = Number(rawValue)
                      field.onChange(Number.isNaN(nextValue) ? null : nextValue)
                    }}
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
                  <FieldLabel htmlFor="expense-total" required>
                    Total
                  </FieldLabel>
                  <Input
                    id="expense-total"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    value={Number.isFinite(field.value) ? field.value : 0}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      field.onChange(Number.isNaN(nextValue) ? 0 : nextValue)
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="expense-receipt">Archivo adjunto</FieldLabel>
              <Input
                id="expense-receipt"
                type="file"
                disabled={isDisabled}
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null)
                }}
              />
            </Field>

            <Controller
              name="notes"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-notes">Notas</FieldLabel>
                  <Textarea
                    id="expense-notes"
                    placeholder="Notas opcionales"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                    rows={10}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className="mt-auto border-t px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(EMPTY_FORM_VALUES)
                clearNewData()
                setFile(null)
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

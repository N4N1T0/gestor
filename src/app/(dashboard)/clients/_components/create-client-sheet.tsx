"use client"

import {
  createClient,
  updateClient,
} from "@/app/(dashboard)/clients/[id]/_actions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCreateNewData } from "@/hooks/use-create-new-data"
import { NavMainItems, NewDataAction } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { tanstackKeys } from "@/features/tanstack/keys"
import { Clients } from "@/types/appwrite"
import { useQueryClient } from "@tanstack/react-query"
import { CreateClientSchema, createClientSchema } from "../[id]/_schemas"

interface CreateClientSheetProps {
  client?: Clients
}

const EMPTY_FORM_VALUES: CreateClientSchema = {
  name: "",
  tax_id: "",
  address: "",
  email: "",
}

export default function CreateClientSheet({ client }: CreateClientSheetProps) {
  const queryClient = useQueryClient()

  // STATE
  const { newData, newDataAction, clearNewData } = useCreateNewData()
  const isEditing = Boolean(client) && newDataAction === NewDataAction.EDIT
  const { handleSubmit, reset, formState, control } =
    useForm<CreateClientSchema>({
      resolver: zodResolver(createClientSchema as never),
      defaultValues: EMPTY_FORM_VALUES,
    })

  // ACTIONS
  const { execute: executeCreate, isExecuting: isCreating } = useAction(
    createClient,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        toast.success("Cliente creado correctamente")
        queryClient.invalidateQueries({
          queryKey: tanstackKeys.clients,
        })
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo crear el cliente")
      },
    }
  )

  const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
    updateClient,
    {
      onSuccess: () => {
        reset()
        clearNewData()
        toast.success("Cliente actualizado correctamente")
        queryClient.invalidateQueries({
          queryKey: tanstackKeys.clients,
        })
        if (client) {
          queryClient.invalidateQueries({
            queryKey: tanstackKeys.client(client.$id),
          })
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "No se pudo actualizar el cliente")
      },
    }
  )

  // COMPUTED
  const isOpen = newData === NavMainItems.CLIENTS
  const isExecuting = isCreating || isUpdating
  const isDisabled = isExecuting || formState.isSubmitting

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && client) {
      reset({
        name: client.name ?? "",
        tax_id: client.tax_id ?? "",
        address: client.address ?? "",
        email: client.email ?? "",
      })
      return
    }

    reset(EMPTY_FORM_VALUES)
  }, [client, isEditing, isOpen, reset])

  // HANDLERS
  const onSubmit = handleSubmit((data) => {
    if (isEditing && client) {
      executeUpdate({ id: client.$id, ...data })
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
            {isEditing ? "Editar cliente" : "Crear cliente"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modifica los datos del cliente."
              : "Completa los datos para crear un nuevo cliente."}
          </SheetDescription>
        </SheetHeader>

        <form className="flex h-full flex-col gap-4 p-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-client-name" required>
                    Nombre
                  </FieldLabel>
                  <Input
                    id="new-client-name"
                    placeholder="Nombre del cliente"
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
              name="tax_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-client-tax-id" required>
                    NIF/CIF
                  </FieldLabel>
                  <Input
                    id="new-client-tax-id"
                    placeholder="B12345678"
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
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-client-email">
                    Correo electrónico
                  </FieldLabel>
                  <Input
                    id="new-client-email"
                    type="email"
                    placeholder="cliente@empresa.com"
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
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-client-address" required>
                    Dirección
                  </FieldLabel>
                  <Input
                    id="new-client-address"
                    placeholder="Calle, número, ciudad"
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

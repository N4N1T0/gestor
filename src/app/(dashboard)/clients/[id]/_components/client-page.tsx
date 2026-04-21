"use client"

import { CreateNewDataBtn } from "@/app/(dashboard)/_components/create-new-data-btn"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetClientById } from "@/features/tanstack/hooks/clients"
import { NavMainItems, NewDataAction } from "@/types"
import ClientContactCard from "./client-contact-card"
import ClientIdentityCard from "./client-identity-card"
import CreateClientSheet from "./create-client-sheet"

interface ClientPageProps {
  id: string
}

export default function ClientPage({ id }: ClientPageProps) {
  const {
    data: client,
    isPending,
    isError,
    error,
  } = useGetClientById({
    id,
    enabled: Boolean(id),
  })

  if (isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !client) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "No se pudo cargar el cliente"}
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{client.name}</h1>
          <p className="text-sm text-muted-foreground">
            Información básica del cliente
          </p>
        </div>

        <CreateNewDataBtn
          dataSource={NavMainItems.CLIENTS}
          action={NewDataAction.EDIT}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CreateClientSheet client={client} key={client.$id} />
        <ClientIdentityCard client={client} />
        <ClientContactCard client={client} />
      </div>
    </>
  )
}

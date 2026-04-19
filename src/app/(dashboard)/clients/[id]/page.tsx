import { getClientById } from "@/lib/api"
import { notFound } from "next/navigation"

import ClientContactCard from "./_components/client-contact-card"
import ClientIdentityCard from "./_components/client-identity-card"

interface ClientPageProps {
  params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">{client.name}</h1>
        <p className="text-sm text-muted-foreground">
          Basic information for this client.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClientIdentityCard client={client} />
        <ClientContactCard client={client} />
      </div>
    </div>
  )
}

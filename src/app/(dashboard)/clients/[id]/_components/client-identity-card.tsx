import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ClientDetails } from "@/lib/api"

interface ClientIdentityCardProps {
  client: ClientDetails
}

export default function ClientIdentityCard({
  client,
}: ClientIdentityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Identidad</CardDescription>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">NIF / CIF</p>
          <p className="font-medium">{client.tax_id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ID de registro</p>
          <p className="break-all font-mono text-xs">{client.$id}</p>
        </div>
      </CardContent>
    </Card>
  )
}

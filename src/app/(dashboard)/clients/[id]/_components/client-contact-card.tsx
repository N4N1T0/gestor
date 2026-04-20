import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ClientDetails } from "@/lib/api"

interface ClientContactCardProps {
  client: ClientDetails
}

export default function ClientContactCard({ client }: ClientContactCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Contacto</CardDescription>
        <CardTitle>Datos de comunicación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Correo electrónico</p>
          <p className="font-medium">
            {client.email ?? "Sin correo electrónico"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Dirección</p>
          <p className="whitespace-pre-line font-medium">{client.address}</p>
        </div>
      </CardContent>
    </Card>
  )
}

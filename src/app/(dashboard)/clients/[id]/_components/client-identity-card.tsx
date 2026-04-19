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
        <CardDescription>Identity</CardDescription>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Tax ID</p>
          <p className="font-medium">{client.tax_id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Record ID</p>
          <p className="break-all font-mono text-xs">{client.$id}</p>
        </div>
      </CardContent>
    </Card>
  )
}

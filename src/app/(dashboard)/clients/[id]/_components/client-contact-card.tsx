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
        <CardDescription>Contact</CardDescription>
        <CardTitle>Communication details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{client.email ?? "No email"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Address</p>
          <p className="whitespace-pre-line font-medium">{client.address}</p>
        </div>
      </CardContent>
    </Card>
  )
}

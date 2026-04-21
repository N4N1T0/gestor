import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { InvoiceDetails } from "@/lib/api"
import { InvoicesStatus } from "@/types/appwrite"

interface InvoiceMainCardProps {
  invoice: InvoiceDetails
}

const statusMap: Record<InvoicesStatus, string> = {
  [InvoicesStatus.DRAFT]: "Borrador",
  [InvoicesStatus.SENT]: "Enviada",
  [InvoicesStatus.PAID]: "Pagada",
}

export default function InvoiceMainCard({ invoice }: InvoiceMainCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Factura</CardDescription>
        <CardTitle>{invoice.invoice_number}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Estado</p>
          <p className="font-medium">{statusMap[invoice.status]}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ID de registro</p>
          <p className="break-all font-mono text-xs">{invoice.$id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Descripción</p>
          <p className="font-medium">{invoice.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

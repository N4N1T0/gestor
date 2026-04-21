import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { InvoiceDetails } from "@/lib/api"

interface InvoiceFinancialCardProps {
  invoice: InvoiceDetails
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value)

const formatDate = (value: string | null) => {
  if (!value) {
    return "Sin fecha"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default function InvoiceFinancialCard({
  invoice,
}: InvoiceFinancialCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Importes y fechas</CardDescription>
        <CardTitle>Resumen financiero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Fecha de emisión</p>
          <p className="font-medium">{formatDate(invoice.issue_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Fecha de vencimiento</p>
          <p className="font-medium">{formatDate(invoice.due_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">IVA</p>
          <p className="font-medium">
            {formatCurrency(invoice.vat_amount ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total</p>
          <p className="font-semibold">{formatCurrency(invoice.total)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

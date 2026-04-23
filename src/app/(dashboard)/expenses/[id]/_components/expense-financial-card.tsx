import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ExpenseDetails } from "@/lib/api"

interface ExpenseFinancialCardProps {
  expense: ExpenseDetails
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value)

const formatDate = (value: string) => {
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

export default function ExpenseFinancialCard({
  expense,
}: ExpenseFinancialCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Importes y fecha</CardDescription>
        <CardTitle>Resumen financiero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Fecha</p>
          <p className="font-medium">{formatDate(expense.date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Importe</p>
          <p className="font-medium">{formatCurrency(expense.amount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">IVA (%)</p>
          <p className="font-medium">{expense.vat_rate ?? 0}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">IVA (€)</p>
          <p className="font-medium">
            {formatCurrency(expense.vat_amount ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total</p>
          <p className="font-semibold">{formatCurrency(expense.total)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

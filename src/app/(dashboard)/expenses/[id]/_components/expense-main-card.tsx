import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ExpenseDetails } from "@/lib/api"

interface ExpenseMainCardProps {
  expense: ExpenseDetails
}

export default function ExpenseMainCard({ expense }: ExpenseMainCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Gasto</CardDescription>
        <CardTitle>{expense.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Categoría</p>
          <p className="font-medium">{expense.category}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ID de registro</p>
          <p className="break-all font-mono text-xs">{expense.$id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Notas</p>
          <p className="font-medium">{expense.notes || "Sin notas"}</p>
        </div>
      </CardContent>
    </Card>
  )
}

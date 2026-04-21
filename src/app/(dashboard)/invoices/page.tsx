import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { honoConfig } from "@/features/hono/config"
import { createAdminClient } from "@/lib/appwrite/server"
import { InvoicesStatus } from "@/types/appwrite"
import { Query } from "node-appwrite"
import MetricCard from "./_components/metric-card"
import OverviewHeader from "./_components/overview-header"

function percentage(value: number, total: number) {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

function currency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value)
}

export default async function InvoicesPage() {
  let hasLoadError = false
  let totalInvoices = 0
  let loadedRowsCount = 0
  let paidInvoices = 0
  let sentInvoices = 0
  let draftInvoices = 0
  let billedAmount = 0

  try {
    const { tablesDB } = await createAdminClient()
    const response = await tablesDB.listRows({
      databaseId: honoConfig.appwrite.databaseId,
      tableId: honoConfig.appwrite.invoicesTableId,
      queries: [Query.limit(5000)],
    })

    const rows = response.rows as Array<Record<string, unknown>>
    totalInvoices = response.total
    loadedRowsCount = rows.length

    draftInvoices = rows.filter(
      (row) => row.status === InvoicesStatus.DRAFT
    ).length
    sentInvoices = rows.filter(
      (row) => row.status === InvoicesStatus.SENT
    ).length
    paidInvoices = rows.filter(
      (row) => row.status === InvoicesStatus.PAID
    ).length

    billedAmount = rows.reduce((sum, row) => {
      const value = typeof row.total === "number" ? row.total : 0
      return sum + value
    }, 0)
  } catch {
    hasLoadError = true
  }

  if (hasLoadError) {
    return (
      <div className="flex flex-1 flex-col p-4">
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar el resumen</CardTitle>
            <CardDescription>
              Hubo un problema al obtener los datos de facturas.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loadedRowsCount === 0) {
    return (
      <div className="flex flex-1 flex-col p-4">
        <Card>
          <CardHeader>
            <CardTitle>No hay facturas todavía</CardTitle>
            <CardDescription>
              Crea tu primera factura para empezar a ver métricas aquí.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <OverviewHeader
        title="Resumen de facturas"
        description="Vista general de tus facturas y su estado actual."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total de facturas" value={totalInvoices} />
        <MetricCard
          label="Facturación total"
          value={currency(billedAmount)}
          helper={`${loadedRowsCount} registros analizados`}
        />
        <MetricCard
          label="Facturas pagadas"
          value={paidInvoices}
          helper={`${percentage(paidInvoices, loadedRowsCount)} del total`}
        />
        <MetricCard
          label="Pendientes de envío/cobro"
          value={sentInvoices + draftInvoices}
          helper={`${sentInvoices} enviadas y ${draftInvoices} borradores`}
        />
      </div>
    </div>
  )
}

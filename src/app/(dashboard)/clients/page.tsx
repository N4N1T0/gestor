import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { honoConfig } from "@/hono/config"
import { createAdminClient } from "@/lib/appwrite"
import { Query } from "node-appwrite"

function percentage(value: number, total: number) {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

export default async function ClientsPage() {
  let hasLoadError = false
  let totalClients = 0
  let loadedRowsCount = 0
  let withEmail = 0
  let withoutEmail = 0
  let uniqueDomains = 0

  try {
    const { tablesDB } = await createAdminClient()
    const response = await tablesDB.listRows({
      databaseId: honoConfig.appwrite.databaseId,
      tableId: honoConfig.appwrite.clientsTableId,
      queries: [Query.limit(5000)],
    })

    const rows = response.rows
    totalClients = response.total
    loadedRowsCount = rows.length

    const emails = rows
      .map((row) => {
        const rowData = row as Record<string, unknown>
        return typeof rowData.email === "string" ? rowData.email.trim() : ""
      })
      .filter(Boolean)

    withEmail = emails.length
    withoutEmail = rows.length - withEmail

    uniqueDomains = new Set(
      emails
        .map((email) => email.split("@")[1]?.toLowerCase() ?? "")
        .filter(Boolean)
    ).size
  } catch {
    hasLoadError = true
  }

  if (hasLoadError) {
    return (
      <div className="flex flex-1 flex-col p-4">
        <Card>
          <CardHeader>
            <CardTitle>Could not load overview</CardTitle>
            <CardDescription>
              There was an issue fetching clients data. Please try again.
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
            <CardTitle>No clients yet</CardTitle>
            <CardDescription>
              Add your first client to start seeing overview metrics here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Clients Overview</h1>
        <p className="text-sm text-muted-foreground">
          General snapshot of your clients data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Clients</CardDescription>
            <CardTitle>{totalClients}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>With Email</CardDescription>
            <CardTitle>{withEmail}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {percentage(withEmail, loadedRowsCount)} of loaded records
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Without Email</CardDescription>
            <CardTitle>{withoutEmail}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {percentage(withoutEmail, loadedRowsCount)} of loaded records
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Unique Email Domains</CardDescription>
            <CardTitle>{uniqueDomains}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

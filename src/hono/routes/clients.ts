import { getClientById } from "@/lib/api"
import { createAdminClient } from "@/lib/appwrite"
import type { Clients } from "@/types/appwrite"
import { Hono } from "hono"
import { Query } from "node-appwrite"

import { honoConfig } from "../config"

const clientsRoute = new Hono()
type ClientListItem = Pick<Clients, "name" | "email" | "address" | "tax_id"> & {
  $id: string
}

clientsRoute.get("/", async (c) => {
  try {
    const { tablesDB } = await createAdminClient()
    const rows = await tablesDB.listRows({
      databaseId: honoConfig.appwrite.databaseId,
      tableId: honoConfig.appwrite.clientsTableId,
      queries: [Query.limit(100)],
    })
    const clients: ClientListItem[] = rows.rows.map((row) => {
      const rowData = row as Record<string, unknown>

      return {
        $id: String(row.$id),
        name: String(rowData.name ?? ""),
        tax_id: String(rowData.tax_id ?? ""),
        address: String(rowData.address ?? ""),
        email:
          rowData.email === null || rowData.email === undefined
            ? null
            : String(rowData.email),
      }
    })

    return c.json({ data: clients })
  } catch (error) {
    console.error("Error while fetching clients:", error)
    return c.json({ error: "Unable to fetch clients" }, 500)
  }
})

clientsRoute.get("/:id", async (c) => {
  try {
    const id = c.req.param("id")
    const client = await getClientById(id)

    if (!client) {
      return c.json({ error: "Client not found" }, 404)
    }

    return c.json({ data: client })
  } catch (error) {
    console.error("Error while fetching client by id:", error)
    return c.json({ error: "Unable to fetch client" }, 500)
  }
})

export default clientsRoute

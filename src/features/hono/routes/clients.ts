import { createClientRow, fetchClients, getClientById } from "@/lib/api"
import { SecondSidebarCardData } from "@/types"
import { Clients } from "@/types/appwrite"
import { Hono } from "hono"

const clientsRoute = new Hono()

clientsRoute
  .get("/", async (c) => {
    try {
      const data = await fetchClients()

      const clients = data.map((row) => {
        return mapClientToListItem(row)
      })

      return c.json(clients)
    } catch (_error) {
      return c.json({ error: "Unable to fetch clients" }, 500)
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id")
      const client = await getClientById(id)

      if (!client) {
        return c.json({ error: "Client not found" }, 404)
      }

      return c.json(client)
    } catch (_error) {
      return c.json({ error: "Unable to fetch client" }, 500)
    }
  })
  .post("/", async (c) => {
    try {
      const payload = (await c.req.json()) as Pick<
        Clients,
        "name" | "tax_id" | "address" | "email"
      >

      const client = await createClientRow(payload)

      return c.json(client, 201)
    } catch (_error) {
      return c.json({ error: "Unable to create client" }, 500)
    }
  })

// HELPER FUNCTIONS
const mapClientToListItem = (client: Clients): SecondSidebarCardData => {
  return {
    id: client.$id,
    slug: client.$id,
    title: client.name,
    meta: client.tax_id ?? "",
    description: client.address ?? "",
  }
}

export default clientsRoute

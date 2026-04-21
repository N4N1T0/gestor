import { fetchInvoices } from "@/lib/api"
import { mapInvoiceToSidebarItem } from "@/lib/second-sidebar-mappers"
import { Hono } from "hono"

const invoicesRoute = new Hono()

invoicesRoute.get("/", async (c) => {
  try {
    const data = await fetchInvoices()

    const invoices = data.map((row) => {
      return mapInvoiceToSidebarItem(row)
    })

    return c.json(invoices)
  } catch (_error) {
    return c.json({ error: "Unable to fetch invoices" }, 500)
  }
})

export default invoicesRoute

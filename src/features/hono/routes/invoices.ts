import {
  createInvoiceRow,
  fetchInvoices,
  getInvoiceById,
  updateInvoiceRow,
} from "@/lib/api"
import { mapInvoiceToSidebarItem } from "@/lib/second-sidebar-mappers"
import { Invoices } from "@/types/appwrite"
import { Hono } from "hono"

const invoicesRoute = new Hono()

invoicesRoute
  .get("/", async (c) => {
    try {
      const data = await fetchInvoices()

      const invoices = data.map((row) => mapInvoiceToSidebarItem(row))

      return c.json(invoices)
    } catch (_error) {
      return c.json({ error: "Unable to fetch invoices" }, 500)
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id")
      const invoice = await getInvoiceById(id)

      if (!invoice) {
        return c.json({ error: "Invoice not found" }, 404)
      }

      return c.json(invoice)
    } catch (_error) {
      return c.json({ error: "Unable to fetch invoice" }, 500)
    }
  })
  .post("/", async (c) => {
    try {
      const payload = (await c.req.json()) as Pick<
        Invoices,
        | "invoice_number"
        | "issue_date"
        | "due_date"
        | "description"
        | "subtotal"
        | "vat_amount"
        | "total"
        | "status"
      >

      const invoice = await createInvoiceRow(payload)

      return c.json(invoice, 201)
    } catch (_error) {
      return c.json({ error: "Unable to create invoice" }, 500)
    }
  })
  .patch("/:id", async (c) => {
    try {
      const id = c.req.param("id")
      const payload = (await c.req.json()) as Partial<
        Pick<
          Invoices,
          | "invoice_number"
          | "issue_date"
          | "due_date"
          | "description"
          | "subtotal"
          | "vat_amount"
          | "total"
          | "status"
        >
      >

      const invoice = await updateInvoiceRow(id, payload)

      return c.json(invoice)
    } catch (_error) {
      return c.json({ error: "Unable to update invoice" }, 500)
    }
  })

export default invoicesRoute

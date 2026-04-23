import {
  CreateExpensePayload,
  UpdateExpensePayload,
  createExpenseRow,
  fetchExpenses,
  getExpenseById,
  updateExpenseRow,
} from "@/lib/api"
import { mapExpenseToSidebarItem } from "@/lib/second-sidebar-mappers"
import { Hono } from "hono"

const expensesRoute = new Hono()

expensesRoute
  .get("/", async (c) => {
    try {
      const data = await fetchExpenses()

      const expenses = data.map((row) => mapExpenseToSidebarItem(row))

      return c.json(expenses)
    } catch (_error) {
      return c.json({ error: "Unable to fetch expenses" }, 500)
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id")
      const expense = await getExpenseById(id)

      if (!expense) {
        return c.json({ error: "Expense not found" }, 404)
      }

      return c.json(expense)
    } catch (_error) {
      return c.json({ error: "Unable to fetch expense" }, 500)
    }
  })
  .post("/", async (c) => {
    try {
      const payload = (await c.req.json()) as CreateExpensePayload

      const expense = await createExpenseRow(payload)

      return c.json(expense, 201)
    } catch (_error) {
      return c.json({ error: "Unable to create expense" }, 500)
    }
  })
  .patch("/:id", async (c) => {
    try {
      const id = c.req.param("id")
      const payload = (await c.req.json()) as UpdateExpensePayload

      const expense = await updateExpenseRow(id, payload)

      return c.json(expense)
    } catch (_error) {
      return c.json({ error: "Unable to update expense" }, 500)
    }
  })

export default expensesRoute

import { Hono } from "hono"

import clientsRoute from "./routes/clients"
import expensesRoute from "./routes/expenses"
import invoicesRoute from "./routes/invoices"

const app = new Hono().basePath("/api")

app.route("/clients", clientsRoute)
app.route("/invoices", invoicesRoute)
app.route("/expenses", expensesRoute)

export default app

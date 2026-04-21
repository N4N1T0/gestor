import { Hono } from "hono"

import clientsRoute from "./routes/clients"
import invoicesRoute from "./routes/invoices"

const app = new Hono().basePath("/api")

app.route("/clients", clientsRoute)
app.route("/invoices", invoicesRoute)

export default app

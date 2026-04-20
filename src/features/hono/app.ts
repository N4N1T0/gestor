import { Hono } from "hono"

import clientsRoute from "./routes/clients"

const app = new Hono().basePath("/api")

app.route("/clients", clientsRoute)

export default app

export const tanstackKeys = {
  clients: ["clients"],
  client: (id: string) => ["clients", id],
  invoices: ["invoices"],
  invoice: (id: string) => ["invoices", id],
  expenses: ["expenses"],
  expense: (id: string) => ["expenses", id],
}

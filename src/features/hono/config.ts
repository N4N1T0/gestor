import { env } from "@/env"

export const honoConfig = {
  appwrite: {
    databaseId: env.NEXT_APPWRITE_DATABASE_ID,
    clientsTableId: env.NEXT_APPWRITE_CLIENTS_TABLE_ID,
    invoicesTableId: env.NEXT_APPWRITE_INVOICES_TABLE_ID,
  },
}

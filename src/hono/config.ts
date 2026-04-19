export const honoConfig = {
  appwrite: {
    databaseId: process.env.NEXT_APPWRITE_DATABASE_ID ?? "69e4d5a20031673b27e7",
    clientsTableId: process.env.NEXT_APPWRITE_CLIENTS_TABLE_ID ?? "clients",
  },
}

"use server"

import { env } from "@/env"
import { cookies } from "next/headers"
import { Account, AppwriteException, Client, TablesDB } from "node-appwrite"

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

  const session = await cookies()
  const value = session.get("my-custom-session")

  if (!value) {
    throw new Error("No session")
  }

  client.setSession(value.value)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.NEXT_APPWRITE_KEY)

  return {
    get account() {
      return new Account(client)
    },
    get tablesDB() {
      return new TablesDB(client)
    },
  }
}

// HELPER FUNCTIONS
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 401 || error.code === 403) {
        return null
      }
      throw new Error(error.message ?? "No se pudo obtener el usuario")
    }
    return null
  }
}

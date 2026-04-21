"use server"

import { createAdminClient, createSessionClient } from "@/lib/appwrite/server"
import { actionClient } from "@/lib/next-safe-actions"
import { catchError } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppwriteException } from "node-appwrite"
import { loginUserResponseSchema, loginUserSchema } from "../(home)/_schemas"

export const loginUser = actionClient
  .inputSchema(loginUserSchema)
  .outputSchema(loginUserResponseSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const { account } = await createAdminClient()
    const cookiesValues = await cookies()

    const [error, data] = await catchError(
      account.createEmailPasswordSession({
        email,
        password,
      })
    )

    if (data) {
      cookiesValues.set("my-custom-session", data.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
    }

    if (error) {
      if (error instanceof AppwriteException) {
        throw new Error(error.message ?? "An unexpected server error occurred")
      }

      throw new Error(error.message ?? "An unexpected error occurred")
    }

    return { id: data.$id, success: true }
  })

export const signOut = actionClient.action(async () => {
  const { account } = await createSessionClient()
  const cookiesValues = await cookies()

  cookiesValues.delete("my-custom-session")
  await account.deleteSession({ sessionId: "current" })

  redirect("/")
})

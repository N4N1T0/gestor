import * as z from "zod"

const serverEnv = z.object({
  NEXT_APPWRITE_KEY: z.string(),
})

const clientEnv = z.object({
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_APPWRITE_PROJECT_NAME: z.string(),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.url(),
})

export const env = {
  ...serverEnv.parse(process.env),
  ...clientEnv.parse(process.env),
}

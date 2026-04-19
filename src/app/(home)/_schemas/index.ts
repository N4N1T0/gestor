import * as z from "zod"

export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const loginUserResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
})

export type LoginUserSchema = z.infer<typeof loginUserSchema>

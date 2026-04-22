import { Client, ID, Storage } from "appwrite"

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

export const storage = new Storage(client)

// HELPERS FUNCTIONS
export const uploadFile = async (file: File | null) => {
  if (!file) return undefined

  const response = await storage.createFile({
    bucketId: process.env.NEXT_PUBLIC_BUCKET_ID!,
    fileId: ID.unique(),
    file: file,
  })

  return response.$id
}

export const getFilePreviewUrl = (fileId: string) => {
  const result = storage.getFileView({
    bucketId: process.env.NEXT_PUBLIC_BUCKET_ID!,
    fileId: fileId,
  })

  return result
}

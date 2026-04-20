import { PageParams } from "@/types"
import { notFound } from "next/navigation"
import ClientPage from "./_components/client-page"

export default async function Page({ params }: PageParams) {
  const { id } = await params

  if (typeof id !== "string") {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ClientPage id={id} />
    </div>
  )
}

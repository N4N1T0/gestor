import { SecondSidebarCardData } from "@/types"
import Link from "next/link"

interface SecondSidebarCardProps {
  data: SecondSidebarCardData
  baseUrl: string
}

export default function SecondSidebarCard({
  data,
  baseUrl,
}: SecondSidebarCardProps) {
  return (
    <Link
      key={data.id}
      href={`${baseUrl}/${data.slug}`}
      className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-muted transition-colors duration-200 ease-in"
    >
      <div className="flex w-full items-center gap-2">
        <span className="font-medium">{data.title}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {data.meta}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {data.description || "No description"}
      </span>
    </Link>
  )
}

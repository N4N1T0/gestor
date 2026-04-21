"use client"

import { usePathname } from "next/navigation"
import CreateClientSheet from "./create-client-sheet"

export default function ClientLayoutSheet() {
  const pathname = usePathname()

  if (pathname !== "/clients") {
    return null
  }

  return <CreateClientSheet />
}

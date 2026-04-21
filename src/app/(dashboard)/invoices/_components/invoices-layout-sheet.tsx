"use client"

import { usePathname } from "next/navigation"
import CreateInvoiceSheet from "./create-invoice-sheet"

export default function InvoicesLayoutSheet() {
  const pathname = usePathname()

  if (pathname !== "/invoices") {
    return null
  }

  return <CreateInvoiceSheet />
}

"use client"

import { CreateNewDataBtn } from "@/app/(dashboard)/_components/create-new-data-btn"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetInvoiceById } from "@/features/tanstack/hooks/invoices"
import { getFilePreviewUrl } from "@/lib/appwrite/client"
import { NavMainItems, NewDataAction } from "@/types"
import CreateInvoiceSheet from "@dashboard/invoices/_components/create-invoice-sheet"
import InvoiceFilePreviewCard from "./invoice-file-preview-card"
import InvoiceFinancialCard from "./invoice-financial-card"
import InvoiceMainCard from "./invoice-main-card"

interface InvoicePageProps {
  id: string
}

export default function InvoicePage({ id }: InvoicePageProps) {
  const {
    data: invoice,
    isPending,
    isError,
    error,
  } = useGetInvoiceById({
    id,
    enabled: Boolean(id),
  })

  const filePreviewUrl = invoice?.file_url
    ? getFilePreviewUrl(invoice.file_url)
    : null

  if (isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !invoice) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "No se pudo cargar la factura"}
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{invoice.invoice_number}</h1>
          <p className="text-sm text-muted-foreground">
            Información de la factura
          </p>
        </div>

        <CreateNewDataBtn
          dataSource={NavMainItems.INVOICES}
          action={NewDataAction.EDIT}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CreateInvoiceSheet invoice={invoice} key={invoice.$id} />
        <InvoiceFilePreviewCard filePreviewUrl={filePreviewUrl} />
        <div className="col-span-1 flex flex-col gap-4">
          <InvoiceMainCard invoice={invoice} />
          <InvoiceFinancialCard invoice={invoice} />
        </div>
      </div>
    </>
  )
}

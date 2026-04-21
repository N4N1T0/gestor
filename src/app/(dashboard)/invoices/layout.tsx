import InvoicesLayoutSheet from "./_components/invoices-layout-sheet"

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <InvoicesLayoutSheet />
      {children}
    </>
  )
}

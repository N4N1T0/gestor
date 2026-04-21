import ClientLayoutSheet from "./_components/client-layout-sheet"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayoutSheet />
      {children}
    </>
  )
}

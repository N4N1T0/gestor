import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { redirect } from "next/navigation"
import CreateClientSheet from "./clients/_components/create-client-sheet"
import CreateExpenseSheet from "./expenses/_components/create-expense-sheet"
import CreateInvoiceSheet from "./invoices/_components/create-invoice-sheet"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getLoggedInUser()

  if (!user) redirect("/")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} />
      <SidebarInset>
        <CreateInvoiceSheet />
        <CreateExpenseSheet />
        <CreateClientSheet />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

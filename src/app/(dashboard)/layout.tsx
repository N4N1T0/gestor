import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { redirect } from "next/navigation"
import MainHeader from "./_components/main-header"

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
        <MainHeader />

        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

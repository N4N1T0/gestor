"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetClients } from "@/features/tanstack/hooks/clients"
import { useGetExpenses } from "@/features/tanstack/hooks/expenses"
import { useGetInvoices } from "@/features/tanstack/hooks/invoices"
import { useDataSearch } from "@/hooks/use-data-search"
import { filterSearchData } from "@/lib/utils"
import { NavMainItem } from "@/types"
import { useMemo } from "react"
import { CreateNewDataBtn } from "./create-new-data-btn"
import SecondSidebarCard from "./second-sidebar-card"

interface SecondSidebarProps {
  activeItem: NavMainItem
}

export default function SecondSidebar({ activeItem }: SecondSidebarProps) {
  const { search, setSearch } = useDataSearch()
  const isClientsSection = activeItem?.url === "/clients"
  const isExpensesSection = activeItem?.url === "/expenses"
  const isInvoicesSection = activeItem?.url === "/invoices"

  const {
    data: clients = [],
    error: clientsError,
    isError: isClientsError,
    isLoading: isClientsLoading,
  } = useGetClients({
    enabled: isClientsSection,
  })

  const {
    data: expenses = [],
    error: expensesError,
    isError: isExpensesError,
    isLoading: isExpensesLoading,
  } = useGetExpenses({
    enabled: isExpensesSection,
  })

  const {
    data: invoices = [],
    error: invoicesError,
    isError: isInvoicesError,
    isLoading: isInvoicesLoading,
  } = useGetInvoices({
    enabled: isInvoicesSection,
  })

  const data = useMemo(() => {
    return isClientsSection
      ? clients
      : isInvoicesSection
        ? invoices
        : isExpensesSection
          ? expenses
          : []
  }, [
    clients,
    expenses,
    invoices,
    isClientsSection,
    isExpensesSection,
    isInvoicesSection,
  ])

  const isLoading = isClientsSection
    ? isClientsLoading
    : isInvoicesSection
      ? isInvoicesLoading
      : isExpensesSection
        ? isExpensesLoading
        : false
  const isError = isClientsSection
    ? isClientsError
    : isInvoicesSection
      ? isInvoicesError
      : isExpensesSection
        ? isExpensesError
        : false
  const error = isClientsSection
    ? clientsError
    : isInvoicesSection
      ? invoicesError
      : isExpensesSection
        ? expensesError
        : null

  // COMPUTED
  const filteredItems = useMemo(
    () => filterSearchData(data, search),
    [data, search]
  )

  // HANDLERS
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground flex-1">
            {activeItem?.title}
          </div>

          <CreateNewDataBtn dataSource={activeItem.title} />
        </div>
        <SidebarInput
          placeholder="Type to search..."
          value={search}
          onChange={handleSearchChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {!isClientsSection && !isInvoicesSection && !isExpensesSection && (
              <div className="p-4 text-sm text-muted-foreground">
                No data source configured for this section yet.
              </div>
            )}

            {(isClientsSection || isInvoicesSection || isExpensesSection) &&
              isLoading && (
                <div className="space-y-0">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border-b p-4 last:border-b-0">
                      <Skeleton className="mb-2 h-4 w-1/2" />
                      <Skeleton className="mb-2 h-3 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              )}

            {(isClientsSection || isInvoicesSection || isExpensesSection) &&
              isError && (
                <div className="p-4 text-sm text-destructive">
                  {(error as Error).message || "Error loading data."}
                </div>
              )}

            {(isClientsSection || isInvoicesSection || isExpensesSection) &&
              !isLoading &&
              !isError &&
              filteredItems.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  No se encontraron resultados.
                </div>
              )}

            {(isClientsSection || isInvoicesSection || isExpensesSection) &&
              !isLoading &&
              !isError &&
              filteredItems.map((item) => (
                <SecondSidebarCard
                  key={item.id}
                  baseUrl={activeItem.url}
                  data={item}
                />
              ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

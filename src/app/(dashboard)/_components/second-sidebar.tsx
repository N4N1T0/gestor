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
import { NavMainItem } from "@/types"
import type { Clients } from "@/types/appwrite"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, useState } from "react"

interface SecondSidebarProps {
  activeItem: NavMainItem
}

type ClientListItem = Pick<Clients, "name" | "email" | "address" | "tax_id"> & {
  $id: string
}

async function fetchClients() {
  const response = await fetch("/api/clients")

  if (!response.ok) {
    throw new Error("Unable to fetch clients")
  }

  const payload = (await response.json()) as { data: ClientListItem[] }
  return payload.data
}

export default function SecondSidebar({ activeItem }: SecondSidebarProps) {
  const [search, setSearch] = useState("")
  const isClientsSection = activeItem?.url === "/clients"

  const {
    data: clients = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    enabled: isClientsSection,
  })

  const filteredClients = useMemo(() => {
    if (!search) return clients

    const needle = search.toLowerCase()
    return clients.filter((client) => {
      const name = client.name.toLowerCase()
      const email = client.email?.toLowerCase() ?? ""
      const address = client.address.toLowerCase()
      const taxId = client.tax_id.toLowerCase()

      return (
        name.includes(needle) ||
        email.includes(needle) ||
        address.includes(needle) ||
        taxId.includes(needle)
      )
    })
  }, [clients, search])

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            {activeItem?.title}
          </div>

          {/* TODO: MAKE A POPOVER OR A SELECT FOR FILTERING */}
        </div>
        <SidebarInput
          placeholder="Type to search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {!isClientsSection && (
              <div className="p-4 text-sm text-muted-foreground">
                No data source configured for this section yet.
              </div>
            )}

            {isClientsSection && isLoading && (
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

            {isClientsSection && isError && (
              <div className="p-4 text-sm text-destructive">
                {(error as Error).message || "Error loading clients."}
              </div>
            )}

            {isClientsSection &&
              !isLoading &&
              !isError &&
              filteredClients.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  No clients found.
                </div>
              )}

            {isClientsSection &&
              !isLoading &&
              !isError &&
              filteredClients.map((client) => (
                <Link
                  key={client.$id}
                  href={`${activeItem?.url}/${client.$id}`}
                  className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-muted transition-colors duration-200 ease-in"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium">{client.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {client.tax_id}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {client.email || "No email"}
                  </span>
                  <span className="line-clamp-2 w-65 text-xs whitespace-break-spaces">
                    {client.address}
                  </span>
                </Link>
              ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export interface NavMainItem {
  title: NavMainItems
  url: string
  icon: React.ReactNode
  isActive: boolean
}

export interface BreadcrumbItemData {
  label: string
  href: string
}

export interface SecondSidebarCardData {
  id: string
  slug: string
  title: string
  meta: string
  description: string
}

export enum NavMainItems {
  INVOICES = "Facturas",
  EXPENSES = "Gastos",
  CLIENTS = "Clientes",
  SUPPLIERS = "Proveedores",
}

// COMMON
export interface PageParams {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}

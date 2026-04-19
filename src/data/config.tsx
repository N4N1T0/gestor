import { NavMainItem } from "@/types"
import { BanknoteArrowDown, Contact, ReceiptEuro, Truck } from "lucide-react"

export const navMain: NavMainItem[] = [
  {
    title: "Facturas",
    url: "/invoices",
    icon: <ReceiptEuro />,
    isActive: true,
  },
  {
    title: "Gastos",
    url: "/expenses",
    icon: <BanknoteArrowDown />,
    isActive: false,
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: <Contact />,
    isActive: false,
  },
  {
    title: "Proveedores",
    url: "/suppliers",
    icon: <Truck />,
    isActive: false,
  },
]

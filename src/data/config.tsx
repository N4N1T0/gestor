import { NavMainItem, NavMainItems } from "@/types"
import { BanknoteArrowDown, Contact, ReceiptEuro, Truck } from "lucide-react"

export const navMain: NavMainItem[] = [
  {
    title: NavMainItems.INVOICES,
    url: "/invoices",
    icon: <ReceiptEuro />,
    isActive: true,
  },
  {
    title: NavMainItems.EXPENSES,
    url: "/expenses",
    icon: <BanknoteArrowDown />,
    isActive: false,
  },
  {
    title: NavMainItems.CLIENTS,
    url: "/clients",
    icon: <Contact />,
    isActive: false,
  },
  {
    title: NavMainItems.SUPPLIERS,
    url: "/suppliers",
    icon: <Truck />,
    isActive: false,
  },
]

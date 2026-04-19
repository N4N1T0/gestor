"use client"

import { signOut } from "@/app/_actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, LogOutIcon, Moon, Sun } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Models } from "node-appwrite"
import { toast } from "sonner"

interface NavUserProps {
  user: Models.User
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const route = useRouter()
  const { setTheme, theme } = useTheme()

  const { execute, isExecuting } = useAction(signOut, {
    onSuccess: () => {
      toast.success("Logged out successfully")
      setTimeout(() => {
        route.push("/")
      }, 300)
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "An unexpected error occurred")
    },
  })

  const handleSignOut = () => {
    execute()
  }

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="md:h-8 md:p-0 hover:bg-transparent data-[state=open]:bg-transparent"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-accent text-accent-foreground">
                  {user.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-accent text-accent-foreground">
                    {user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleThemeToggle}>
              {theme === "dark" ? <Moon /> : <Sun />}
              Cambiar el Tema
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isExecuting}>
              <LogOutIcon />
              {isExecuting ? "Cerrando sesión..." : "Cerrar sesión"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

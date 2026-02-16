
"use client"

import * as React from "react"
import { LayoutDashboard, ShoppingCart, List, History, LogOut, Smartphone } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Point of Sale", url: "/checkout", icon: Smartphone },
  { title: "Product Catalog", url: "/catalog", icon: List },
  { title: "Transaction History", url: "/history", icon: History },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">PristinePay</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-4 py-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Package, ShoppingCart, BarChart3, Settings, Bell, User, Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "대시보드", href: "/", icon: Home },
  { name: "재고 관리", href: "/inventory", icon: Package },
  { name: "발주 관리", href: "/orders", icon: ShoppingCart },
  { name: "매출 분석", href: "/analytics", icon: BarChart3 },
  { name: "설정", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-sidebar-primary" />
              <span className="text-lg font-bold text-sidebar-foreground font-heading">재고관리</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Home className="h-8 w-8 text-sidebar-primary" />
            <span className="ml-2 text-lg font-bold text-sidebar-foreground font-heading">재고관리</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={cn(
                            "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium leading-6 transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">관리자</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-sm text-muted-foreground">© 2024 재고관리 시스템. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  고객지원
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  이용약관
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  개인정보처리방침
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

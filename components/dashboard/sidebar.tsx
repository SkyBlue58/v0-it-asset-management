"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  TicketIcon,
  Package,
  Calendar,
  FileText,
  Printer,
  Users,
  Building2,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Briefcase,
  DollarSign,
  BookOpen,
  Megaphone,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavItem[] = [
  { title: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  { title: "แจ้งซ่อม", href: "/dashboard/tickets", icon: TicketIcon },
  { title: "ทรัพย์สิน", href: "/dashboard/assets", icon: Package },
  { title: "ยืม-คืน", href: "/dashboard/borrow", icon: FileText },
  { title: "PM Schedule", href: "/dashboard/pm", icon: Calendar },
  { title: "ตลับหมึก", href: "/dashboard/toner", icon: Printer },
  { title: "ผู้ใช้งาน", href: "/dashboard/users", icon: Users },
  { title: "แผนก", href: "/dashboard/departments", icon: Building2 },
  { title: "สัญญา", href: "/dashboard/contracts", icon: Briefcase },
  { title: "ซอฟต์แวร์", href: "/dashboard/licenses", icon: BookOpen },
  { title: "งบประมาณ", href: "/dashboard/budget", icon: DollarSign },
  { title: "การฝึกอบรม", href: "/dashboard/training", icon: GraduationCap },
  { title: "ประกาศ", href: "/dashboard/announcements", icon: Megaphone },
  { title: "Knowledge Base", href: "/dashboard/kb", icon: HelpCircle },
  { title: "รายงาน", href: "/dashboard/reports", icon: FileBarChart },
  { title: "ตั้งค่า", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-semibold">IT Asset Mgmt</span>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

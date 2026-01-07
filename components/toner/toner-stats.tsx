"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingDown, Printer } from "lucide-react"

interface TonerModel {
  min_stock_level: number
  is_active: boolean
  stock?: Array<{
    quantity: number
    reserved_quantity: number
  }>
  [key: string]: any
}

interface TonerStatsProps {
  tonerModels: TonerModel[]
}

export function TonerStats({ tonerModels }: TonerStatsProps) {
  const activeModels = tonerModels.filter((t) => t.is_active)

  const totalStock = activeModels.reduce((sum, model) => {
    const stockQty = model.stock?.reduce((s, stock) => s + stock.quantity, 0) || 0
    return sum + stockQty
  }, 0)

  const lowStockCount = activeModels.filter((model) => {
    const stockQty = model.stock?.reduce((s, stock) => s + stock.quantity, 0) || 0
    return stockQty <= model.min_stock_level
  }).length

  const reservedStock = activeModels.reduce((sum, model) => {
    const reservedQty = model.stock?.reduce((s, stock) => s + stock.reserved_quantity, 0) || 0
    return sum + reservedQty
  }, 0)

  const stats = [
    {
      title: "รุ่นทั้งหมด",
      value: activeModels.length,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "สต็อกทั้งหมด",
      value: totalStock,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "สต็อกต่ำ",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "จองแล้ว",
      value: reservedStock,
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

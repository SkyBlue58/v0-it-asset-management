"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle2, AlertTriangle } from "lucide-react"

interface Asset {
  status: string
  condition: string
  [key: string]: any
}

interface AssetStatsProps {
  assets: Asset[]
}

export function AssetStats({ assets }: AssetStatsProps) {
  const stats = {
    total: assets.length,
    available: assets.filter((a) => a.status === "available").length,
    inUse: assets.filter((a) => a.status === "in_use").length,
    maintenance: assets.filter((a) => a.status === "maintenance").length,
    retired: assets.filter((a) => a.status === "retired").length,
  }

  const statCards = [
    {
      title: "ทรัพย์สินทั้งหมด",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "พร้อมใช้งาน",
      value: stats.available,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "กำลังใช้งาน",
      value: stats.inUse,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "ซ่อมบำรุง",
      value: stats.maintenance,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
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

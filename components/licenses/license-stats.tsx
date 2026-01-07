import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

export async function LicenseStats() {
  const supabase = await createServerClient()

  const { count: totalCount } = await supabase.from("software_licenses").select("*", { count: "exact", head: true })

  const { count: activeCount } = await supabase
    .from("software_licenses")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: expiringCount } = await supabase
    .from("software_licenses")
    .select("*", { count: "exact", head: true })
    .gte("expiry_date", new Date().toISOString())
    .lte("expiry_date", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
    .eq("status", "active")

  const { data: licensesData } = await supabase.from("software_licenses").select("total_licenses, used_licenses")

  const totalAvailable = licensesData?.reduce((sum, l) => sum + (l.total_licenses - l.used_licenses), 0) || 0

  const stats = [
    {
      title: "ใบอนุญาตทั้งหมด",
      value: totalCount || 0,
      icon: Key,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "ใช้งานอยู่",
      value: activeCount || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "ใกล้หมดอายุ (30 วัน)",
      value: expiringCount || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "License ว่าง",
      value: totalAvailable,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

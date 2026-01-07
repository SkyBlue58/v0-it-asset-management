import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wrench,
  Package,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Printer,
  Key,
  GraduationCap,
} from "lucide-react"

export async function ReportDashboard() {
  const supabase = await createServerClient()

  // Tickets stats
  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true })
  const { count: openTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")
  const { count: inProgressTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress")
  const { count: closedTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "closed")

  // Assets stats
  const { count: totalAssets } = await supabase.from("assets").select("*", { count: "exact", head: true })
  const { count: inUseAssets } = await supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_use")
  const { count: availableAssets } = await supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("status", "available")
  const { count: maintenanceAssets } = await supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("status", "maintenance")

  // Borrow stats
  const { count: activeBorrows } = await supabase
    .from("borrow_return")
    .select("*", { count: "exact", head: true })
    .eq("status", "borrowed")

  // PM stats
  const { count: overduePM } = await supabase
    .from("preventive_maintenance")
    .select("*", { count: "exact", head: true })
    .eq("status", "overdue")

  // Toner stats
  const { count: lowStockToner } = await supabase
    .from("toner_models")
    .select("*, current_stock, min_stock_level", { count: "exact", head: true })
    .lt("current_stock", 10)

  // Budget stats
  const currentYear = new Date().getFullYear()
  const { data: budgets } = await supabase.from("budget_categories").select("*").eq("fiscal_year", currentYear)
  const totalBudget = budgets?.reduce((sum, b) => sum + b.allocated_amount, 0) || 0
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spent_amount, 0) || 0

  // Contracts stats
  const { count: activeContracts } = await supabase
    .from("contracts")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Licenses stats
  const { count: activeLicenses } = await supabase
    .from("software_licenses")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Training stats
  const { count: totalTraining } = await supabase.from("training_records").select("*", { count: "exact", head: true })

  // Knowledge base stats
  const { count: totalKB } = await supabase
    .from("knowledge_base")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  const mainStats = [
    {
      title: "แจ้งซ่อมทั้งหมด",
      value: totalTickets || 0,
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: `เปิด: ${openTickets || 0}, กำลังดำเนินการ: ${inProgressTickets || 0}, ปิด: ${closedTickets || 0}`,
    },
    {
      title: "ทรัพย์สินทั้งหมด",
      value: totalAssets || 0,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `ใช้งาน: ${inUseAssets || 0}, ว่าง: ${availableAssets || 0}, ซ่อม: ${maintenanceAssets || 0}`,
    },
    {
      title: "กำลังยืมอยู่",
      value: activeBorrows || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "รายการยืมที่ยังไม่ได้คืน",
    },
    {
      title: "PM เลยกำหนด",
      value: overduePM || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "บำรุงรักษาที่เลยกำหนด",
    },
  ]

  const additionalStats = [
    {
      title: "ตลับหมึกสต็อกต่ำ",
      value: lowStockToner || 0,
      icon: Printer,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "งบประมาณคงเหลือ",
      value: `฿${(totalBudget - totalSpent).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: `จาก ฿${totalBudget.toLocaleString()}`,
    },
    {
      title: "สัญญาที่ใช้งาน",
      value: activeContracts || 0,
      icon: FileText,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      title: "License ที่ใช้งาน",
      value: activeLicenses || 0,
      icon: Key,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "บันทึกการฝึกอบรม",
      value: totalTraining || 0,
      icon: GraduationCap,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "บทความคลังความรู้",
      value: totalKB || 0,
      icon: FileText,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
  ]

  // Calculate performance metrics
  const ticketResolutionRate = totalTickets ? ((closedTickets || 0) / totalTickets) * 100 : 0
  const assetUtilizationRate = totalAssets ? ((inUseAssets || 0) / totalAssets) * 100 : 0
  const budgetUtilizationRate = totalBudget ? (totalSpent / totalBudget) * 100 : 0

  const performanceStats = [
    {
      title: "อัตราการแก้ไขแจ้งซ่อม",
      value: `${ticketResolutionRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: ticketResolutionRate >= 80 ? "text-green-600" : "text-orange-600",
      bgColor: ticketResolutionRate >= 80 ? "bg-green-100" : "bg-orange-100",
    },
    {
      title: "อัตราการใช้งานทรัพย์สิน",
      value: `${assetUtilizationRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: assetUtilizationRate >= 70 ? "text-green-600" : "text-orange-600",
      bgColor: assetUtilizationRate >= 70 ? "bg-green-100" : "bg-orange-100",
    },
    {
      title: "การใช้งบประมาณ",
      value: `${budgetUtilizationRate.toFixed(1)}%`,
      icon: DollarSign,
      color: budgetUtilizationRate < 90 ? "text-green-600" : "text-red-600",
      bgColor: budgetUtilizationRate < 90 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "ทรัพย์สินรอซ่อม",
      value: maintenanceAssets || 0,
      icon: Clock,
      color: (maintenanceAssets || 0) > 5 ? "text-red-600" : "text-green-600",
      bgColor: (maintenanceAssets || 0) > 5 ? "bg-red-100" : "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">สถิติหลัก</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mainStats.map((stat) => {
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
                  {stat.description && <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">ประสิทธิภาพ</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performanceStats.map((stat) => {
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
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">ข้อมูลเพิ่มเติม</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {additionalStats.map((stat) => {
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
                  <div className="text-xl font-bold">{stat.value}</div>
                  {stat.description && <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Alert section for critical issues */}
      {((overduePM || 0) > 0 || (lowStockToner || 0) > 0 || budgetUtilizationRate > 90) && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-600">แจ้งเตือนสำคัญ</h2>
          <div className="space-y-3">
            {(overduePM || 0) > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-3 pt-6">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">มีการบำรุงรักษาเลยกำหนด {overduePM} รายการ</p>
                    <p className="text-sm text-red-700">กรุณาดำเนินการบำรุงรักษาโดยเร็ว</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(lowStockToner || 0) > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="flex items-center gap-3 pt-6">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">ตลับหมึกสต็อกต่ำ {lowStockToner} รายการ</p>
                    <p className="text-sm text-orange-700">ควรสั่งซื้อเพิ่มเติม</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {budgetUtilizationRate > 90 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-3 pt-6">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">งบประมาณใกล้หมด ({budgetUtilizationRate.toFixed(1)}%)</p>
                    <p className="text-sm text-red-700">คงเหลือเพียง ฿{(totalBudget - totalSpent).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

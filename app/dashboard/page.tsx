import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, Package, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch dashboard statistics
  const [ticketsResult, assetsResult, borrowResult] = await Promise.all([
    supabase.from("tickets").select("id, status", { count: "exact" }),
    supabase.from("assets").select("id, status", { count: "exact" }),
    supabase.from("borrow_requests").select("id, status", { count: "exact" }),
  ])

  const stats = [
    {
      title: "แจ้งซ่อมทั้งหมด",
      value: ticketsResult.count || 0,
      icon: TicketIcon,
      description: "รายการทั้งหมดในระบบ",
      trend: "+12%",
    },
    {
      title: "ทรัพย์สินทั้งหมด",
      value: assetsResult.count || 0,
      icon: Package,
      description: "ทรัพย์สินในระบบ",
      trend: "+5%",
    },
    {
      title: "รอดำเนินการ",
      value: ticketsResult.data?.filter((t) => t.status === "open" || t.status === "in_progress").length || 0,
      icon: AlertCircle,
      description: "ต้องดำเนินการ",
      trend: "-8%",
    },
    {
      title: "เสร็จสิ้นวันนี้",
      value: ticketsResult.data?.filter((t) => t.status === "resolved").length || 0,
      icon: CheckCircle2,
      description: "งานที่เสร็จแล้ว",
      trend: "+23%",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          ยินดีต้อนรับ, {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-muted-foreground">ภาพรวมของระบบ IT Asset Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <span className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>แจ้งซ่อมล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketsResult.data && ticketsResult.data.length > 0 ? (
                ticketsResult.data.slice(0, 5).map((ticket, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <TicketIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ticket #{ticket.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">สถานะ: {ticket.status}</p>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">ยังไม่มีรายการแจ้งซ่อม</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ทรัพย์สินที่ต้องบำรุงรักษา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetsResult.data && assetsResult.data.length > 0 ? (
                assetsResult.data.slice(0, 5).map((asset, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Asset #{asset.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">สถานะ: {asset.status}</p>
                    </div>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">ไม่มีทรัพย์สินที่ต้องบำรุงรักษา</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>การดำเนินการด่วน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/dashboard/tickets/new"
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <TicketIcon className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">แจ้งซ่อม</span>
            </a>
            <a
              href="/dashboard/assets/new"
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">เพิ่มทรัพย์สิน</span>
            </a>
            <a
              href="/dashboard/borrow/new"
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <Clock className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">ขอยืมอุปกรณ์</span>
            </a>
            <a
              href="/dashboard/reports"
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">ดูรายงาน</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportDashboard } from "@/components/reports/report-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ReportsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">รายงานและการวิเคราะห์</h1>
        <p className="text-muted-foreground mt-1">ภาพรวมและสถิติของระบบ IT Asset Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="tickets">แจ้งซ่อม</TabsTrigger>
          <TabsTrigger value="assets">ทรัพย์สิน</TabsTrigger>
          <TabsTrigger value="budget">งบประมาณ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Suspense fallback={<div>กำลังโหลด...</div>}>
            <ReportDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="text-center py-12 text-muted-foreground">รายงานแจ้งซ่อม - กำลังพัฒนา</div>
        </TabsContent>

        <TabsContent value="assets">
          <div className="text-center py-12 text-muted-foreground">รายงานทรัพย์สิน - กำลังพัฒนา</div>
        </TabsContent>

        <TabsContent value="budget">
          <div className="text-center py-12 text-muted-foreground">รายงานงบประมาณ - กำลังพัฒนา</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

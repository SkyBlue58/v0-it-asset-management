import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Wrench } from "lucide-react"
import Link from "next/link"
import { PMActions } from "@/components/pm/pm-actions"

export default async function PMDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: pm } = await supabase
    .from("pm_schedules")
    .select(`
      *,
      asset:assets(asset_number, name, brand, model),
      technician:users(full_name, email)
    `)
    .eq("id", params.id)
    .single()

  if (!pm) {
    notFound()
  }

  const statusColors = {
    scheduled: "bg-blue-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
    overdue: "bg-orange-500",
  }

  const isOverdue = pm.status === "scheduled" && new Date(pm.scheduled_date) < new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pm">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">รายละเอียด PM</h1>
            <p className="text-muted-foreground">{pm.pm_number}</p>
          </div>
        </div>
        <PMActions pm={pm} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              ข้อมูลการบำรุงรักษา
            </CardTitle>
            <CardDescription>รายละเอียดงาน PM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">หมายเลข PM</p>
              <p className="text-lg font-semibold font-mono">{pm.pm_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ประเภทงาน</p>
              <p className="text-lg">{pm.pm_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สถานะ</p>
              <Badge className={isOverdue ? "bg-orange-500" : statusColors[pm.status as keyof typeof statusColors]}>
                {isOverdue
                  ? "เลยกำหนด"
                  : pm.status === "scheduled"
                    ? "กำหนดการ"
                    : pm.status === "in_progress"
                      ? "กำลังดำเนินการ"
                      : pm.status === "completed"
                        ? "เสร็จสิ้น"
                        : "ยกเลิก"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ช่างผู้รับผิดชอบ</p>
              <p className="text-lg">{pm.technician?.full_name || "ยังไม่ระบุ"}</p>
              {pm.technician?.email && <p className="text-sm text-muted-foreground">{pm.technician.email}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              ข้อมูลอุปกรณ์
            </CardTitle>
            <CardDescription>รายละเอียดทรัพย์สินที่ต้องบำรุงรักษา</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ชื่ออุปกรณ์</p>
              <p className="text-lg font-semibold">{pm.asset?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">รหัสทรัพย์สิน</p>
              <p className="text-lg font-mono">{pm.asset?.asset_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ยี่ห้อ/รุ่น</p>
              <p className="text-lg">
                {pm.asset?.brand || "-"} {pm.asset?.model || ""}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>กำหนดการ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">วันที่กำหนด</p>
              <p className="text-lg font-semibold">
                {new Date(pm.scheduled_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {pm.completed_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">วันที่เสร็จสิ้น</p>
                <p className="text-lg text-green-600">
                  {new Date(pm.completed_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {pm.next_pm_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">PM ครั้งถัดไป</p>
                <p className="text-lg text-blue-600">
                  {new Date(pm.next_pm_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดเพิ่มเติม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pm.checklist && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">รายการตรวจสอบ</p>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{pm.checklist}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {pm.description && (
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{pm.description}</p>
          </CardContent>
        </Card>
      )}

      {pm.notes && (
        <Card>
          <CardHeader>
            <CardTitle>บันทึกหลังการบำรุงรักษา</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{pm.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

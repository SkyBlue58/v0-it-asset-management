import { createServerClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Calendar, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"

export async function TrainingList() {
  const supabase = await createServerClient()

  const { data: trainings } = await supabase
    .from("training_records")
    .select("*, user:users(full_name)")
    .order("training_date", { ascending: false })
    .limit(50)

  const { count: totalCount } = await supabase.from("training_records").select("*", { count: "exact", head: true })

  const { count: completedCount } = await supabase
    .from("training_records")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { data: uniqueCourses } = await supabase.from("training_records").select("course_name")

  const courseCount = new Set(uniqueCourses?.map((t) => t.course_name)).size

  const stats = [
    {
      title: "หลักสูตรทั้งหมด",
      value: courseCount,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "บันทึกการฝึกอบรม",
      value: totalCount || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "อบรมเสร็จสิ้น",
      value: completedCount || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "ผู้เข้าร่วม (ทั้งหมด)",
      value: trainings?.length || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      completed: { label: "เสร็จสิ้น", variant: "default" },
      in_progress: { label: "กำลังอบรม", variant: "secondary" },
      cancelled: { label: "ยกเลิก", variant: "destructive" },
    }
    const config = variants[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หลักสูตร</TableHead>
              <TableHead>ผู้เข้าร่วม</TableHead>
              <TableHead>วันที่อบรม</TableHead>
              <TableHead>ระยะเวลา (ชั่วโมง)</TableHead>
              <TableHead>หน่วยงานจัด</TableHead>
              <TableHead>ใบประกาศนียบัตร</TableHead>
              <TableHead>สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings && trainings.length > 0 ? (
              trainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.course_name}</TableCell>
                  <TableCell>{training.user?.full_name || "ไม่ระบุ"}</TableCell>
                  <TableCell>
                    {new Date(training.training_date).toLocaleDateString("th-TH")}
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(training.training_date), {
                        addSuffix: true,
                        locale: th,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{training.duration_hours} ชม.</TableCell>
                  <TableCell>{training.provider || "ไม่ระบุ"}</TableCell>
                  <TableCell>
                    {training.certificate_issued ? (
                      <Badge variant="outline">มี</Badge>
                    ) : (
                      <Badge variant="secondary">ไม่มี</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(training.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  ไม่มีข้อมูลการฝึกอบรม
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

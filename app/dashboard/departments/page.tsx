import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Users } from "lucide-react"
import Link from "next/link"

export default async function DepartmentsPage() {
  const supabase = await createServerClient()

  const { data: departments } = await supabase
    .from("departments")
    .select(`
      *,
      manager:users!departments_manager_id_fkey(first_name, last_name),
      employee_count:users(count)
    `)
    .order("name")

  const totalDepts = departments?.length || 0
  const activeDepts = departments?.filter((d) => d.is_active).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">แผนก</h1>
          <p className="text-muted-foreground">จัดการแผนกและหน่วยงาน</p>
        </div>
        <Link href="/dashboard/departments/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            เพิ่มแผนก
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardDescription>แผนกทั้งหมด</CardDescription>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">{totalDepts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">แผนกในระบบทั้งหมด</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardDescription>ใช้งานอยู่</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">{activeDepts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">แผนกที่เปิดใช้งาน</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardDescription>พนักงานเฉลี่ย</CardDescription>
            <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">
              {totalDepts > 0
                ? Math.round(
                    (departments?.reduce((sum, d) => sum + (d.employee_count?.[0]?.count || 0), 0) || 0) / totalDepts,
                  )
                : 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ต่อแผนก</p>
          </CardContent>
        </Card>
      </div>

      {/* Departments List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments?.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </div>
                <Badge variant={dept.is_active ? "default" : "secondary"}>{dept.is_active ? "ใช้งาน" : "ปิดใช้งาน"}</Badge>
              </div>
              {dept.code && <CardDescription className="font-mono text-xs">รหัส: {dept.code}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3">
              {dept.description && <p className="text-sm text-muted-foreground">{dept.description}</p>}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{dept.employee_count?.[0]?.count || 0} พนักงาน</span>
              </div>
              {dept.manager && (
                <p className="text-sm">
                  <span className="text-muted-foreground">ผู้จัดการ:</span>{" "}
                  <span className="font-medium">
                    {dept.manager.first_name} {dept.manager.last_name}
                  </span>
                </p>
              )}
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href={`/dashboard/departments/${dept.id}`}>ดูรายละเอียด</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

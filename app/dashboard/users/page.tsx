import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { UserFilters } from "@/components/users/user-filters"

export default async function UsersPage() {
  const supabase = await createServerClient()

  const { data: users } = await supabase
    .from("users")
    .select("*, departments(name)")
    .order("created_at", { ascending: false })

  const { data: stats } = await supabase.from("users").select("role, is_active")

  const totalUsers = stats?.length || 0
  const activeUsers = stats?.filter((u) => u.is_active).length || 0
  const adminUsers = stats?.filter((u) => u.role === "admin").length || 0
  const technicianUsers = stats?.filter((u) => u.role === "technician").length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ผู้ใช้งาน</h1>
          <p className="text-muted-foreground">จัดการผู้ใช้งานในระบบ</p>
        </div>
        <Link href="/dashboard/users/new">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            เพิ่มผู้ใช้งาน
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardDescription>ผู้ใช้ทั้งหมด</CardDescription>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ผู้ใช้ในระบบทั้งหมด</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardDescription>ใช้งานอยู่</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">{activeUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">บัญชีที่เปิดใช้งาน</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardDescription>ผู้ดูแลระบบ</CardDescription>
            <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">{adminUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">สิทธิ์ Admin</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-2">
            <CardDescription>ช่างเทคนิค</CardDescription>
            <CardTitle className="text-3xl text-orange-600 dark:text-orange-400">{technicianUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">สิทธิ์ Technician</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้งาน</CardTitle>
          <CardDescription>ผู้ใช้งานทั้งหมดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสพนักงาน</TableHead>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.employee_id}</TableCell>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.departments?.name || "-"}</TableCell>
                  <TableCell>{user.position || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "technician" ? "secondary" : "outline"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "ใช้งาน" : "ปิดใช้งาน"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/users/${user.id}`}>ดูรายละเอียด</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

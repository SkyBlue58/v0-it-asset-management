import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, AlertCircle, Info, Wrench, Sparkles } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { th } from "date-fns/locale"

const typeIcons = {
  info: Info,
  warning: AlertCircle,
  maintenance: Wrench,
  update: Sparkles,
}

const typeColors = {
  info: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
  warning: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900",
  maintenance: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900",
  update: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900",
}

export default async function AnnouncementsPage() {
  const supabase = await createServerClient()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, author:users!announcements_author_id_fkey(first_name, last_name)")
    .order("created_at", { ascending: false })

  const totalAnnouncements = announcements?.length || 0
  const activeAnnouncements = announcements?.filter((a) => a.is_active).length || 0
  const highPriority = announcements?.filter((a) => a.priority === "high").length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ประกาศ</h1>
          <p className="text-muted-foreground">จัดการประกาศและข่าวสารในระบบ</p>
        </div>
        <Link href="/dashboard/announcements/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            เพิ่มประกาศ
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardDescription>ประกาศทั้งหมด</CardDescription>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">{totalAnnouncements}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ประกาศในระบบทั้งหมด</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardDescription>กำลังแสดง</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">{activeAnnouncements}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ประกาศที่เปิดใช้งาน</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardDescription>สำคัญมาก</CardDescription>
            <CardTitle className="text-3xl text-red-600 dark:text-red-400">{highPriority}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ประกาศลำดับความสำคัญสูง</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements?.map((announcement) => {
          const TypeIcon = typeIcons[announcement.type as keyof typeof typeIcons] || Info
          const typeColor = typeColors[announcement.type as keyof typeof typeColors] || typeColors.info

          return (
            <Card key={announcement.id} className={`hover:shadow-lg transition-shadow ${typeColor}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <TypeIcon className="h-5 w-5 mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <Badge variant={announcement.priority === "high" ? "destructive" : "secondary"}>
                          {announcement.priority === "high"
                            ? "สำคัญมาก"
                            : announcement.priority === "normal"
                              ? "ปกติ"
                              : "ต่ำ"}
                        </Badge>
                        <Badge variant={announcement.is_active ? "default" : "secondary"}>
                          {announcement.is_active ? "กำลังแสดง" : "ปิดการแสดง"}
                        </Badge>
                      </div>
                      <CardDescription>
                        โดย {announcement.author?.first_name} {announcement.author?.last_name} •{" "}
                        {format(new Date(announcement.created_at), "d MMMM yyyy, HH:mm", { locale: th })}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>เริ่ม: {format(new Date(announcement.start_date), "d MMM yyyy, HH:mm", { locale: th })}</span>
                  {announcement.end_date && (
                    <span>สิ้นสุด: {format(new Date(announcement.end_date), "d MMM yyyy, HH:mm", { locale: th })}</span>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/announcements/${announcement.id}`}>ดูรายละเอียด</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}

        {!announcements?.length && (
          <Card className="text-center py-12">
            <CardContent>
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">ยังไม่มีประกาศ</h3>
              <p className="text-muted-foreground mb-4">เริ่มต้นสร้างประกาศแรกของคุณ</p>
              <Button asChild>
                <Link href="/dashboard/announcements/new">เพิ่มประกาศ</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

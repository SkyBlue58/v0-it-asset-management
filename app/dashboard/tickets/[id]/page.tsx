import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Package, User, Clock, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { TicketComments } from "@/components/tickets/ticket-comments"
import { TicketActions } from "@/components/tickets/ticket-actions"

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  open: "เปิดใหม่",
  in_progress: "กำลังดำเนินการ",
  pending: "รอดำเนินการ",
  resolved: "แก้ไขแล้ว",
  closed: "ปิดแล้ว",
  cancelled: "ยกเลิก",
}

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch ticket details
  const { data: ticket } = await supabase
    .from("tickets")
    .select(
      `
      *,
      requester:users!tickets_requester_id_fkey(first_name, last_name, email, employee_id, department),
      assigned:users!tickets_assigned_to_fkey(first_name, last_name, email),
      priority:ticket_priorities(name, level, color),
      location:locations(building, floor, room),
      asset:assets(asset_code, name, model)
    `,
    )
    .eq("id", params.id)
    .single()

  if (!ticket) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from("ticket_comments")
    .select(
      `
      *,
      user:users(first_name, last_name, role)
    `,
    )
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true })

  // Fetch technicians for assignment
  const { data: technicians } = await supabase
    .from("users")
    .select("id, first_name, last_name")
    .in("role", ["admin", "technician"])
    .eq("is_active", true)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{ticket.ticket_number}</h1>
            <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
            {ticket.priority && (
              <Badge variant="outline" style={{ borderColor: ticket.priority.color }}>
                {ticket.priority.name}
              </Badge>
            )}
          </div>
          <h2 className="mt-2 text-xl text-muted-foreground">{ticket.title}</h2>
        </div>
        <div className="flex gap-2">
          <TicketActions
            ticketId={ticket.id}
            currentStatus={ticket.status}
            technicians={technicians || []}
            currentAssignee={ticket.assigned_to}
            userRole={profile?.role || "user"}
          />
          {(profile?.role === "admin" || profile?.role === "technician" || ticket.requester_id === user.id) && (
            <Button asChild variant="outline">
              <Link href={`/dashboard/tickets/${ticket.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                แก้ไข
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">คำอธิบาย</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{ticket.description}</p>
              </div>

              {ticket.category && (
                <div>
                  <h3 className="mb-2 font-medium">หมวดหมู่</h3>
                  <Badge variant="secondary">{ticket.category}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>ความคิดเห็นและการอัพเดท</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketComments ticketId={ticket.id} comments={comments || []} userId={user.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">ผู้แจ้ง</p>
                  {ticket.requester && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {ticket.requester.first_name} {ticket.requester.last_name}
                      </p>
                      <p>{ticket.requester.email}</p>
                      <p>
                        {ticket.requester.employee_id} - {ticket.requester.department}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">ผู้รับผิดชอบ</p>
                  {ticket.assigned ? (
                    <p className="text-sm text-muted-foreground">
                      {ticket.assigned.first_name} {ticket.assigned.last_name}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">ยังไม่ได้มอบหมาย</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">วันที่สร้าง</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(ticket.created_at), "dd MMMM yyyy HH:mm", { locale: th })}
                  </p>
                </div>
              </div>

              {ticket.updated_at !== ticket.created_at && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">อัพเดทล่าสุด</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(ticket.updated_at), "dd MMMM yyyy HH:mm", { locale: th })}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {ticket.location && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">สถานที่</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.location.building} - ชั้น {ticket.location.floor} - ห้อง {ticket.location.room}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {ticket.asset && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">ทรัพย์สินที่เกี่ยวข้อง</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.asset.asset_code} - {ticket.asset.name}
                      </p>
                      {ticket.asset.model && <p className="text-xs text-muted-foreground">{ticket.asset.model}</p>}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

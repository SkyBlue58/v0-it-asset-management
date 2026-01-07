import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TicketList } from "@/components/tickets/ticket-list"
import { TicketStats } from "@/components/tickets/ticket-stats"

export default async function TicketsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch tickets based on user role
  let ticketsQuery = supabase
    .from("tickets")
    .select(
      `
      *,
      requester:users!tickets_requester_id_fkey(first_name, last_name, email),
      assigned:users!tickets_assigned_to_fkey(first_name, last_name, email),
      priority:ticket_priorities(name, level, color)
    `,
    )
    .order("created_at", { ascending: false })

  // If user is not admin/technician, only show their tickets
  if (profile?.role !== "admin" && profile?.role !== "technician") {
    ticketsQuery = ticketsQuery.or(`requester_id.eq.${user.id},assigned_to.eq.${user.id}`)
  }

  const { data: tickets } = await ticketsQuery

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">แจ้งซ่อม</h1>
          <p className="text-muted-foreground">จัดการและติดตามการแจ้งซ่อมทั้งหมด</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            สร้างรายการแจ้งซ่อม
          </Link>
        </Button>
      </div>

      <TicketStats tickets={tickets || []} />

      <Card>
        <CardHeader>
          <CardTitle>รายการแจ้งซ่อมทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList tickets={tickets || []} userRole={profile?.role || "user"} />
        </CardContent>
      </Card>
    </div>
  )
}

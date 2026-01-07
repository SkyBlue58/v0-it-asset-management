import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketForm } from "@/components/tickets/ticket-form"

export default async function NewTicketPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch priorities
  const { data: priorities } = await supabase.from("ticket_priorities").select("*").order("level")

  // Fetch locations
  const { data: locations } = await supabase.from("locations").select("*")

  // Fetch assets
  const { data: assets } = await supabase.from("assets").select("id, asset_code, name").eq("status", "in_use")

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">สร้างรายการแจ้งซ่อม</h1>
        <p className="text-muted-foreground">กรอกข้อมูลเพื่อแจ้งปัญหาหรือขอความช่วยเหลือ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดการแจ้งซ่อม</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm
            userId={user.id}
            priorities={priorities || []}
            locations={locations || []}
            assets={assets || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

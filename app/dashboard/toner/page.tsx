import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TonerList } from "@/components/toner/toner-list"
import { TonerStats } from "@/components/toner/toner-stats"

export default async function TonerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch toner models with stock
  const { data: tonerModels } = await supabase.from("toner_models").select(
    `
      *,
      stock:toner_stock(
        id,
        quantity,
        reserved_quantity,
        location:locations(building, floor, room)
      )
    `,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการตลับหมึก</h1>
          <p className="text-muted-foreground">ติดตามและจัดการคลังตลับหมึก</p>
        </div>
        {(profile?.role === "admin" || profile?.role === "technician") && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/toner/transactions">ประวัติการเบิก-จ่าย</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/toner/new">
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มรุ่นตลับหมึก
              </Link>
            </Button>
          </div>
        )}
      </div>

      <TonerStats tonerModels={tonerModels || []} />

      <Card>
        <CardHeader>
          <CardTitle>รายการตลับหมึกทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <TonerList tonerModels={tonerModels || []} userRole={profile?.role || "user"} />
        </CardContent>
      </Card>
    </div>
  )
}

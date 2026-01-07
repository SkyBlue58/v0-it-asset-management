import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BorrowList } from "@/components/borrow/borrow-list"
import { BorrowStats } from "@/components/borrow/borrow-stats"

export default async function BorrowPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  let borrowQuery = supabase
    .from("borrow_requests")
    .select(
      `
      *,
      asset:assets(asset_code, name, model),
      requester:users!borrow_requests_requester_id_fkey(first_name, last_name, employee_id),
      approver:users!borrow_requests_approved_by_fkey(first_name, last_name)
    `,
    )
    .order("created_at", { ascending: false })

  if (profile?.role !== "admin" && profile?.role !== "technician") {
    borrowQuery = borrowQuery.eq("requester_id", user.id)
  }

  const { data: requests } = await borrowQuery

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ยืม-คืนอุปกรณ์</h1>
          <p className="text-muted-foreground">จัดการการยืมและคืนอุปกรณ์ IT</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/borrow/new">
            <Plus className="mr-2 h-4 w-4" />
            ขอยืมอุปกรณ์
          </Link>
        </Button>
      </div>

      <BorrowStats requests={requests || []} />

      <Card>
        <CardHeader>
          <CardTitle>รายการยืม-คืน</CardTitle>
        </CardHeader>
        <CardContent>
          <BorrowList requests={requests || []} userRole={profile?.role || "user"} />
        </CardContent>
      </Card>
    </div>
  )
}

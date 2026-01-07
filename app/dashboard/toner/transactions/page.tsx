import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TransactionList } from "@/components/toner/transaction-list"

export default async function TonerTransactionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: transactions } = await supabase
    .from("toner_transactions")
    .select(
      `
      *,
      toner_model:toner_models(model_number, name, color),
      requester:users!toner_transactions_requester_id_fkey(first_name, last_name, employee_id),
      approver:users!toner_transactions_approved_by_fkey(first_name, last_name),
      from_location:locations!toner_transactions_from_location_id_fkey(building, floor, room),
      to_location:locations!toner_transactions_to_location_id_fkey(building, floor, room)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ประวัติการเบิก-จ่ายตลับหมึก</h1>
          <p className="text-muted-foreground">ติดตามการเคลื่อนไหวของตลับหมึก</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/toner/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            บันทึกรายการใหม่
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions || []} />
        </CardContent>
      </Card>
    </div>
  )
}

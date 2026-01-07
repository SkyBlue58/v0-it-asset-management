import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BudgetOverview } from "@/components/budget/budget-overview"
import { BudgetList } from "@/components/budget/budget-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function BudgetPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">งบประมาณ IT</h1>
          <p className="text-muted-foreground mt-1">จัดการงบประมาณและค่าใช้จ่ายด้าน IT</p>
        </div>
        <Link href="/dashboard/budget/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มรายการงบประมาณ
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <BudgetOverview />
      </Suspense>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <BudgetList />
      </Suspense>
    </div>
  )
}

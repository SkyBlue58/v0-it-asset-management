import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ContractStats } from "@/components/contracts/contract-stats"
import { ContractList } from "@/components/contracts/contract-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ContractsPage() {
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
          <h1 className="text-3xl font-bold">สัญญา</h1>
          <p className="text-muted-foreground mt-1">จัดการสัญญาบริการ ซ่อมบำรุง และสัญญาต่างๆ</p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มสัญญาใหม่
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <ContractStats />
      </Suspense>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <ContractList />
      </Suspense>
    </div>
  )
}

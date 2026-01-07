import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LicenseStats } from "@/components/licenses/license-stats"
import { LicenseList } from "@/components/licenses/license-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function LicensesPage() {
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
          <h1 className="text-3xl font-bold">ใบอนุญาตซอฟต์แวร์</h1>
          <p className="text-muted-foreground mt-1">จัดการใบอนุญาตซอฟต์แวร์และการใช้งาน</p>
        </div>
        <Link href="/dashboard/licenses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มใบอนุญาตใหม่
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <LicenseStats />
      </Suspense>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <LicenseList />
      </Suspense>
    </div>
  )
}

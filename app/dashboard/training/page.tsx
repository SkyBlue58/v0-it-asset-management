import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TrainingList } from "@/components/training/training-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function TrainingPage() {
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
          <h1 className="text-3xl font-bold">การฝึกอบรม</h1>
          <p className="text-muted-foreground mt-1">จัดการหลักสูตรและบันทึกการฝึกอบรมพนักงาน</p>
        </div>
        <Link href="/dashboard/training/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มหลักสูตรใหม่
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <TrainingList />
      </Suspense>
    </div>
  )
}

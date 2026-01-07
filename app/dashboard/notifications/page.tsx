import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotificationList } from "@/components/notifications/notification-list"

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">การแจ้งเตือน</h1>
        <p className="text-muted-foreground mt-1">แจ้งเตือนและกิจกรรมในระบบ</p>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <NotificationList />
      </Suspense>
    </div>
  )
}

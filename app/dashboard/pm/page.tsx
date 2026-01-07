import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PMList } from "@/components/pm/pm-list"

export default async function PMPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: schedules } = await supabase
    .from("pm_schedules")
    .select(
      `
      *,
      asset:assets(asset_code, name, model, category:asset_categories(name)),
      assigned_user:users!pm_schedules_assigned_to_fkey(first_name, last_name)
    `,
    )
    .order("next_pm_date", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preventive Maintenance</h1>
          <p className="text-muted-foreground">กำหนดการบำรุงรักษาเชิงป้องกัน</p>
        </div>
        {(profile?.role === "admin" || profile?.role === "technician") && (
          <Button asChild>
            <Link href="/dashboard/pm/new">
              <Plus className="mr-2 h-4 w-4" />
              สร้างกำหนดการ PM
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>กำหนดการ PM ทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <PMList schedules={schedules || []} userRole={profile?.role || "user"} />
        </CardContent>
      </Card>
    </div>
  )
}

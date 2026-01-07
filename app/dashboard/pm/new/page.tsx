import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PMForm } from "@/components/pm/pm-form"

export default async function NewPMPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "technician") {
    redirect("/dashboard/pm")
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_code, name, model")
    .in("status", ["available", "in_use"])

  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name")
    .eq("is_active", true)
    .in("role", ["admin", "technician"])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">สร้างกำหนดการ PM</h1>
        <p className="text-muted-foreground">กำหนดการบำรุงรักษาเชิงป้องกัน</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดกำหนดการ</CardTitle>
        </CardHeader>
        <CardContent>
          <PMForm assets={assets || []} users={users || []} />
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TonerModelForm } from "@/components/toner/toner-model-form"

export default async function NewTonerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "technician") {
    redirect("/dashboard/toner")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">เพิ่มรุ่นตลับหมึก</h1>
        <p className="text-muted-foreground">เพิ่มรุ่นตลับหมึกใหม่เข้าสู่ระบบ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลรุ่นตลับหมึก</CardTitle>
        </CardHeader>
        <CardContent>
          <TonerModelForm />
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssetForm } from "@/components/assets/asset-form"

export default async function NewAssetPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "technician") {
    redirect("/dashboard/assets")
  }

  // Fetch categories
  const { data: categories } = await supabase.from("asset_categories").select("*").eq("is_active", true)

  // Fetch locations
  const { data: locations } = await supabase.from("locations").select("*")

  // Fetch users for assignment
  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name, employee_id")
    .eq("is_active", true)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">เพิ่มทรัพย์สิน</h1>
        <p className="text-muted-foreground">กรอกข้อมูลทรัพย์สินใหม่</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลทรัพย์สิน</CardTitle>
        </CardHeader>
        <CardContent>
          <AssetForm categories={categories || []} locations={locations || []} users={users || []} />
        </CardContent>
      </Card>
    </div>
  )
}

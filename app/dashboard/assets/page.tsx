import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AssetList } from "@/components/assets/asset-list"
import { AssetStats } from "@/components/assets/asset-stats"

export default async function AssetsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch assets with related data
  const { data: assets } = await supabase
    .from("assets")
    .select(
      `
      *,
      category:asset_categories(name, code),
      location:locations(building, floor, room),
      assigned_user:users!assets_assigned_to_fkey(first_name, last_name, employee_id)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการทรัพย์สิน</h1>
          <p className="text-muted-foreground">ติดตามและจัดการทรัพย์สิน IT ทั้งหมด</p>
        </div>
        {(profile?.role === "admin" || profile?.role === "technician") && (
          <Button asChild>
            <Link href="/dashboard/assets/new">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มทรัพย์สิน
            </Link>
          </Button>
        )}
      </div>

      <AssetStats assets={assets || []} />

      <Card>
        <CardHeader>
          <CardTitle>รายการทรัพย์สินทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <AssetList assets={assets || []} userRole={profile?.role || "user"} />
        </CardContent>
      </Card>
    </div>
  )
}

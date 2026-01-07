import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BorrowForm } from "@/components/borrow/borrow-form"

export default async function NewBorrowPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_code, name, model, category:asset_categories(name)")
    .eq("status", "available")

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ขอยืมอุปกรณ์</h1>
        <p className="text-muted-foreground">กรอกข้อมูลเพื่อขอยืมอุปกรณ์</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดการยืม</CardTitle>
        </CardHeader>
        <CardContent>
          <BorrowForm userId={user.id} assets={assets || []} />
        </CardContent>
      </Card>
    </div>
  )
}

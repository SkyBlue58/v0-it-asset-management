import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { KnowledgeBaseList } from "@/components/kb/kb-list"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default async function KnowledgeBasePage() {
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
          <h1 className="text-3xl font-bold">คลังความรู้</h1>
          <p className="text-muted-foreground mt-1">ฐานข้อมูลความรู้ บทความ และคำแนะนำการแก้ปัญหา</p>
        </div>
        <Link href="/dashboard/kb/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มบทความใหม่
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ค้นหาบทความ..." className="pl-10" />
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <KnowledgeBaseList />
      </Suspense>
    </div>
  )
}

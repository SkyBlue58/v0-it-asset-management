import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { KBForm } from "@/components/kb/kb-form"

export default function NewKBPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/kb">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">เพิ่มบทความใหม่</h1>
          <p className="text-muted-foreground">สร้างบทความในคลังความรู้</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลบทความ</CardTitle>
          <CardDescription>กรุณากรอกรายละเอียดบทความให้ครบถ้วน</CardDescription>
        </CardHeader>
        <CardContent>
          <KBForm />
        </CardContent>
      </Card>
    </div>
  )
}

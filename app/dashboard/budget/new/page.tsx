import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BudgetForm } from "@/components/budget/budget-form"

export default function NewBudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/budget">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">เพิ่มงบประมาณใหม่</h1>
          <p className="text-muted-foreground">กำหนดงบประมาณสำหรับหมวดหมู่ต่างๆ</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลงบประมาณ</CardTitle>
          <CardDescription>กรุณากรอกรายละเอียดงบประมาณให้ครบถ้วน</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm />
        </CardContent>
      </Card>
    </div>
  )
}

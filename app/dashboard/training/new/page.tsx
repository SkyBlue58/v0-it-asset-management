import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TrainingForm } from "@/components/training/training-form"

export default function NewTrainingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/training">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">สร้างหลักสูตรฝึกอบรม</h1>
          <p className="text-muted-foreground">เพิ่มหลักสูตรอบรมใหม่</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลหลักสูตร</CardTitle>
          <CardDescription>กรุณากรอกรายละเอียดหลักสูตรให้ครบถ้วน</CardDescription>
        </CardHeader>
        <CardContent>
          <TrainingForm />
        </CardContent>
      </Card>
    </div>
  )
}

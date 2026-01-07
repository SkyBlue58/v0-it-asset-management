import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LicenseForm } from "@/components/licenses/license-form"

export default function NewLicensePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/licenses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">เพิ่มใบอนุญาตซอฟต์แวร์</h1>
          <p className="text-muted-foreground">กรอกข้อมูลใบอนุญาตซอฟต์แวร์</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลใบอนุญาต</CardTitle>
          <CardDescription>กรุณากรอกรายละเอียดใบอนุญาตให้ครบถ้วน</CardDescription>
        </CardHeader>
        <CardContent>
          <LicenseForm />
        </CardContent>
      </Card>
    </div>
  )
}

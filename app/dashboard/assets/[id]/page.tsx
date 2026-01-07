import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, History } from "lucide-react"
import Link from "next/link"

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: asset } = await supabase
    .from("assets")
    .select("*, locations(name), asset_categories(name)")
    .eq("id", params.id)
    .single()

  if (!asset) {
    notFound()
  }

  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    maintenance: "bg-yellow-500",
    retired: "bg-red-500",
  }

  const conditionColors = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    fair: "bg-yellow-500",
    poor: "bg-orange-500",
    broken: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/assets">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
            <p className="text-muted-foreground">{asset.asset_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            ลบ
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลทั่วไป</CardTitle>
            <CardDescription>รายละเอียดพื้นฐานของทรัพย์สิน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">หมายเลขทรัพย์สิน</p>
              <p className="text-lg font-semibold">{asset.asset_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ชื่อทรัพย์สิน</p>
              <p className="text-lg">{asset.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">หมวดหมู่</p>
              <p className="text-lg">{asset.asset_categories?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สถานะ</p>
              <Badge className={statusColors[asset.status as keyof typeof statusColors]}>
                {asset.status === "active" && "ใช้งาน"}
                {asset.status === "inactive" && "ไม่ใช้งาน"}
                {asset.status === "maintenance" && "ซ่อมบำรุง"}
                {asset.status === "retired" && "เลิกใช้"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สภาพ</p>
              <Badge className={conditionColors[asset.condition as keyof typeof conditionColors]}>
                {asset.condition === "excellent" && "ดีเยี่ยม"}
                {asset.condition === "good" && "ดี"}
                {asset.condition === "fair" && "ปานกลาง"}
                {asset.condition === "poor" && "แย่"}
                {asset.condition === "broken" && "ชำรุด"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
            <CardDescription>รายละเอียดและสถานที่</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ยี่ห้อ/รุ่น</p>
              <p className="text-lg">
                {asset.brand || "-"} {asset.model || ""}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
              <p className="text-lg font-mono">{asset.serial_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สถานที่</p>
              <p className="text-lg">{asset.locations?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">วันที่ซื้อ</p>
              <p className="text-lg">
                {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString("th-TH") : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ราคา</p>
              <p className="text-lg font-semibold text-green-600">
                {asset.purchase_price ? `฿${asset.purchase_price.toLocaleString()}` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.description && (
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียด</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{asset.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            ประวัติการใช้งาน
          </CardTitle>
          <CardDescription>บันทึกการซ่อมบำรุงและการเปลี่ยนแปลง</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">ยังไม่มีประวัติ</p>
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { BorrowActions } from "@/components/borrow/borrow-actions"

export default async function BorrowDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: borrow } = await supabase
    .from("borrow_requests")
    .select(`
      *,
      borrower:users!borrow_requests_borrower_id_fkey(full_name, email),
      asset:assets(asset_number, name),
      approver:users!borrow_requests_approved_by_fkey(full_name)
    `)
    .eq("id", params.id)
    .single()

  if (!borrow) {
    notFound()
  }

  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    returned: "bg-blue-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/borrow">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">รายละเอียดการยืม-คืน</h1>
            <p className="text-muted-foreground">รหัส: {borrow.id}</p>
          </div>
        </div>
        <BorrowActions borrow={borrow} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              ข้อมูลการยืม
            </CardTitle>
            <CardDescription>รายละเอียดการขอยืมอุปกรณ์</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ผู้ขอยืม</p>
              <p className="text-lg font-semibold">{borrow.borrower?.full_name}</p>
              <p className="text-sm text-muted-foreground">{borrow.borrower?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">อุปกรณ์</p>
              <p className="text-lg">{borrow.asset?.name}</p>
              <p className="text-sm text-muted-foreground">รหัส: {borrow.asset?.asset_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สถานะ</p>
              <Badge className={statusColors[borrow.status as keyof typeof statusColors]}>
                {borrow.status === "pending" && "รออนุมัติ"}
                {borrow.status === "approved" && "อนุมัติแล้ว"}
                {borrow.status === "rejected" && "ปฏิเสธ"}
                {borrow.status === "returned" && "คืนแล้ว"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>วันที่และเวลา</CardTitle>
            <CardDescription>กำหนดการยืมและคืน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">วันที่ขอยืม</p>
              <p className="text-lg">
                {new Date(borrow.borrow_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">กำหนดคืน</p>
              <p className="text-lg font-semibold text-orange-600">
                {new Date(borrow.due_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {borrow.return_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">วันที่คืนจริง</p>
                <p className="text-lg text-green-600">
                  {new Date(borrow.return_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {borrow.approved_by && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">ผู้อนุมัติ</p>
                <p className="text-lg">{borrow.approver?.full_name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {borrow.purpose && (
        <Card>
          <CardHeader>
            <CardTitle>วัตถุประสงค์</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{borrow.purpose}</p>
          </CardContent>
        </Card>
      )}

      {borrow.notes && (
        <Card>
          <CardHeader>
            <CardTitle>หมายเหตุ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{borrow.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

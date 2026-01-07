import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Package, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { TonerStockDialog } from "@/components/toner/toner-stock-dialog"

export default async function TonerDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: toner } = await supabase.from("toner_models").select("*").eq("id", params.id).single()

  if (!toner) {
    notFound()
  }

  const { data: transactions } = await supabase
    .from("toner_transactions")
    .select("*, user:users(full_name)")
    .eq("toner_model_id", params.id)
    .order("transaction_date", { ascending: false })
    .limit(10)

  const stockPercentage = (toner.current_stock / toner.max_stock) * 100
  const isLowStock = toner.current_stock <= toner.min_stock

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/toner">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{toner.model_name}</h1>
            <p className="text-muted-foreground">{toner.brand}</p>
          </div>
        </div>
        <TonerStockDialog tonerId={toner.id} currentStock={toner.current_stock} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สต็อกปัจจุบัน</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {toner.current_stock}
              <span className="text-lg font-normal text-muted-foreground"> / {toner.max_stock}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isLowStock ? "bg-red-500" : stockPercentage > 50 ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
            {isLowStock && (
              <Badge className="mt-2 bg-red-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                สต็อกต่ำ
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สต็อกขั้นต่ำ</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{toner.min_stock}</div>
            <p className="text-xs text-muted-foreground mt-1">แจ้งเตือนเมื่อต่ำกว่าจำนวนนี้</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จอง/ใช้งาน</CardTitle>
            <Printer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{toner.reserved_stock || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">จำนวนที่ถูกจองไว้</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            ข้อมูลตลับหมึก
          </CardTitle>
          <CardDescription>รายละเอียดของตลับหมึกรุ่นนี้</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ยี่ห้อ</p>
              <p className="text-lg font-semibold">{toner.brand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">รุ่น</p>
              <p className="text-lg font-semibold">{toner.model_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">สี</p>
              <p className="text-lg">{toner.color || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">เข้ากันได้กับเครื่อง</p>
              <p className="text-lg">{toner.compatible_printers || "-"}</p>
            </div>
          </div>
          {toner.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">รายละเอียด</p>
              <p className="text-muted-foreground">{toner.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ประวัติการเคลื่อนไหว</CardTitle>
          <CardDescription>รายการเบิก-จ่าย 10 รายการล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.transaction_type === "in"
                          ? "bg-green-100 text-green-600"
                          : tx.transaction_type === "out"
                            ? "bg-red-100 text-red-600"
                            : tx.transaction_type === "return"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tx.transaction_type === "in" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : tx.transaction_type === "out" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.transaction_type === "in"
                          ? "รับเข้า"
                          : tx.transaction_type === "out"
                            ? "เบิกออก"
                            : tx.transaction_type === "return"
                              ? "คืน"
                              : "ปรับปรุง"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        โดย {tx.user?.full_name} • {new Date(tx.transaction_date).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.transaction_type === "in" ? "text-green-600" : "text-red-600"}`}>
                      {tx.transaction_type === "in" ? "+" : "-"}
                      {tx.quantity}
                    </p>
                    {tx.notes && <p className="text-xs text-muted-foreground">{tx.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีรายการเคลื่อนไหว</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

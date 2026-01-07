import { createServerClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export async function BudgetList() {
  const supabase = await createServerClient()

  const currentYear = new Date().getFullYear()

  const { data: budgets } = await supabase
    .from("budget_categories")
    .select("*, department:departments(name)")
    .eq("fiscal_year", currentYear)
    .order("name")

  const formatCategoryName = (name: string) => {
    return name || "ไม่ระบุ"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อหมวดหมู่</TableHead>
            <TableHead>รหัส</TableHead>
            <TableHead>แผนก</TableHead>
            <TableHead>งบประมาณ</TableHead>
            <TableHead>ใช้ไปแล้ว</TableHead>
            <TableHead>คงเหลือ</TableHead>
            <TableHead>การใช้งาน</TableHead>
            <TableHead>สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets && budgets.length > 0 ? (
            budgets.map((budget) => {
              const spentPercent = (budget.spent_amount / budget.allocated_amount) * 100
              const remaining = budget.allocated_amount - budget.spent_amount

              let statusVariant: "default" | "secondary" | "destructive" = "default"
              let statusLabel = "ปกติ"

              if (spentPercent >= 90) {
                statusVariant = "destructive"
                statusLabel = "ใกล้หมด"
              } else if (spentPercent >= 75) {
                statusVariant = "secondary"
                statusLabel = "ควรระวัง"
              }

              return (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{formatCategoryName(budget.name)}</TableCell>
                  <TableCell>{budget.code || "-"}</TableCell>
                  <TableCell>{budget.department?.name || "ไม่ระบุ"}</TableCell>
                  <TableCell>฿{budget.allocated_amount.toLocaleString()}</TableCell>
                  <TableCell>฿{budget.spent_amount.toLocaleString()}</TableCell>
                  <TableCell>฿{remaining.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[150px]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{Math.round(spentPercent)}%</span>
                      </div>
                      <Progress value={spentPercent} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                ไม่มีข้อมูลงบประมาณสำหรับปี {currentYear}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

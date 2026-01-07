import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export async function BudgetOverview() {
  const supabase = await createServerClient()

  const currentYear = new Date().getFullYear()

  const { data: budgets } = await supabase.from("budget_categories").select("*").eq("fiscal_year", currentYear)

  const totalBudget = budgets?.reduce((sum, b) => sum + b.allocated_amount, 0) || 0
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spent_amount, 0) || 0
  const remaining = totalBudget - totalSpent
  const spentPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const stats = [
    {
      title: "งบประมาณรวม",
      value: `฿${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "ใช้ไปแล้ว",
      value: `฿${totalSpent.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      subtitle: `${spentPercent.toFixed(1)}% ของงบประมาณ`,
    },
    {
      title: "คงเหลือ",
      value: `฿${remaining.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: `${(100 - spentPercent).toFixed(1)}% ของงบประมาณ`,
    },
    {
      title: "หมวดหมู่",
      value: budgets?.length || 0,
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>การใช้งบประมาณปี {currentYear}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>ใช้ไปแล้ว: ฿{totalSpent.toLocaleString()}</span>
            <span className="text-muted-foreground">{spentPercent.toFixed(1)}%</span>
          </div>
          <Progress value={spentPercent} className="h-3" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>คงเหลือ: ฿{remaining.toLocaleString()}</span>
            <span>งบรวม: ฿{totalBudget.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

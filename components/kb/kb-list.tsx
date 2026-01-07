import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ThumbsUp, FileText } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"

export async function KnowledgeBaseList() {
  const supabase = await createServerClient()

  const { data: articles } = await supabase
    .from("knowledge_base")
    .select("*, author:users(full_name)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(20)

  const { count: totalCount } = await supabase
    .from("knowledge_base")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { label: string; color: string }> = {
      hardware: { label: "ฮาร์ดแวร์", color: "bg-blue-100 text-blue-800" },
      software: { label: "ซอฟต์แวร์", color: "bg-purple-100 text-purple-800" },
      network: { label: "เครือข่าย", color: "bg-green-100 text-green-800" },
      security: { label: "ความปลอดภัย", color: "bg-red-100 text-red-800" },
      guide: { label: "คู่มือ", color: "bg-orange-100 text-orange-800" },
      faq: { label: "คำถามที่พบบ่อย", color: "bg-yellow-100 text-yellow-800" },
    }
    const config = categories[category] || { label: category, color: "bg-gray-100 text-gray-800" }
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const stats = [
    {
      title: "บทความทั้งหมด",
      value: totalCount || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <div className="space-y-6">
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {getCategoryBadge(article.category)}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(article.created_at), {
                      addSuffix: true,
                      locale: th,
                    })}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{article.content?.substring(0, 150)}...</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{article.helpful_count || 0}</span>
                    </div>
                  </div>
                  <span className="text-xs">โดย {article.author?.full_name || "ไม่ระบุ"}</span>
                </div>

                <Link href={`/dashboard/kb/${article.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    อ่านบทความ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-8 text-muted-foreground">ไม่มีบทความในคลังความรู้</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

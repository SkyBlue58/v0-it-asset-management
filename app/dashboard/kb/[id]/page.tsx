import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Eye, ThumbsUp, Bookmark } from "lucide-react"
import Link from "next/link"
import { incrementKBViews } from "@/lib/actions/kb"

export default async function KBArticlePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Increment view count
  await incrementKBViews(params.id)

  const { data: article } = await supabase
    .from("kb_articles")
    .select("*, author:users(full_name)")
    .eq("id", params.id)
    .single()

  if (!article) {
    notFound()
  }

  const statusColors = {
    draft: "bg-gray-500",
    published: "bg-green-500",
    archived: "bg-orange-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/kb">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={statusColors[article.status as keyof typeof statusColors]}>
                {article.status === "draft" ? "ฉบับร่าง" : article.status === "published" ? "เผยแพร่แล้ว" : "เก็บถาวร"}
              </Badge>
              <Badge variant="outline">{article.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>โดย {article.author?.full_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.view_count || 0} ครั้ง
              </span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString("th-TH")}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            บันทึก
          </Button>
          <Button variant="outline" size="sm">
            <ThumbsUp className="h-4 w-4 mr-2" />
            มีประโยชน์
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap leading-relaxed">{article.content}</div>
          </div>
        </CardContent>
      </Card>

      {article.tags && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">แท็ก</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {article.tags.split(",").map((tag: string, i: number) => (
                <Badge key={i} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {article.related_articles && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">บทความที่เกี่ยวข้อง</CardTitle>
            <CardDescription>บทความอื่นๆ ที่น่าสนใจ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Loading related articles...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

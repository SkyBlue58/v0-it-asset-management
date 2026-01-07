"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createKBArticle } from "@/lib/actions/kb"
import { Loader2 } from "lucide-react"

export function KBForm({ article }: { article?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createKBArticle(formData)

    if (result.success) {
      router.push("/dashboard/kb")
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาด: " + result.error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">ชื่อบทความ *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={article?.title}
            placeholder="เช่น: วิธีการ Reset Password"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">หมวดหมู่ *</Label>
          <Select name="category" defaultValue={article?.category || "general"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">ทั่วไป</SelectItem>
              <SelectItem value="hardware">ฮาร์ดแวร์</SelectItem>
              <SelectItem value="software">ซอฟต์แวร์</SelectItem>
              <SelectItem value="network">เครือข่าย</SelectItem>
              <SelectItem value="security">ความปลอดภัย</SelectItem>
              <SelectItem value="troubleshooting">แก้ไขปัญหา</SelectItem>
              <SelectItem value="howto">วิธีการใช้งาน</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">สถานะ *</Label>
          <Select name="status" defaultValue={article?.status || "draft"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">ฉบับร่าง</SelectItem>
              <SelectItem value="published">เผยแพร่</SelectItem>
              <SelectItem value="archived">เก็บถาวร</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">แท็ก</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={article?.tags}
            placeholder="แยกด้วยเครื่องหมายจุลภาค เช่น: password, account, login"
          />
          <p className="text-xs text-muted-foreground">ใช้เครื่องหมายจุลภาค (,) คั่นระหว่างแท็ก</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">เนื้อหาบทความ *</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={article?.content}
          placeholder="เขียนเนื้อหาของบทความที่นี่..."
          rows={12}
          required
        />
        <p className="text-xs text-muted-foreground">รองรับ Markdown สำหรับการจัดรูปแบบข้อความ</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="related_articles">บทความที่เกี่ยวข้อง</Label>
        <Input
          id="related_articles"
          name="related_articles"
          defaultValue={article?.related_articles}
          placeholder="ID ของบทความ คั่นด้วยเครื่องหมายจุลภาค"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {article ? "บันทึกการแก้ไข" : "สร้างบทความ"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}

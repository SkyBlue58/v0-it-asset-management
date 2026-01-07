"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBudget } from "@/lib/actions/budget"
import { Loader2 } from "lucide-react"

export function BudgetForm({ budget }: { budget?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createBudget(formData)

    if (result.success) {
      router.push("/dashboard/budget")
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาด: " + result.error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">หมวดหมู่ *</Label>
          <Input
            id="category"
            name="category"
            defaultValue={budget?.category}
            placeholder="เช่น: ฮาร์ดแวร์, ซอฟต์แวร์, บำรุงรักษา"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiscal_year">ปีงบประมาณ *</Label>
          <Input
            id="fiscal_year"
            name="fiscal_year"
            type="number"
            defaultValue={budget?.fiscal_year || new Date().getFullYear() + 543}
            min="2020"
            max="2100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allocated_amount">งบประมาณที่ได้รับ (บาท) *</Label>
          <Input
            id="allocated_amount"
            name="allocated_amount"
            type="number"
            step="0.01"
            defaultValue={budget?.allocated_amount}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spent_amount">งบประมาณที่ใช้ไป (บาท)</Label>
          <Input
            id="spent_amount"
            name="spent_amount"
            type="number"
            step="0.01"
            defaultValue={budget?.spent_amount || 0}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="status">สถานะ *</Label>
          <Select name="status" defaultValue={budget?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">ใช้งาน</SelectItem>
              <SelectItem value="depleted">ใช้หมดแล้ว</SelectItem>
              <SelectItem value="closed">ปิดแล้ว</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียด</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={budget?.description}
          placeholder="รายละเอียดเกี่ยวกับงบประมาณนี้..."
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {budget ? "บันทึกการแก้ไข" : "สร้างงบประมาณ"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}

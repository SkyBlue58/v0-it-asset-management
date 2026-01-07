"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTraining } from "@/lib/actions/training"
import { Loader2 } from "lucide-react"

export function TrainingForm({ training }: { training?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTraining(formData)

    if (result.success) {
      router.push("/dashboard/training")
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
          <Label htmlFor="title">ชื่อหลักสูตร *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={training?.title}
            placeholder="เช่น: การใช้งาน Microsoft 365"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">วิทยากร</Label>
          <Input id="instructor" name="instructor" defaultValue={training?.instructor} placeholder="ชื่อวิทยากร" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="training_type">ประเภท *</Label>
          <Select name="training_type" defaultValue={training?.training_type || "internal"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">อบรมภายใน</SelectItem>
              <SelectItem value="external">อบรมภายนอก</SelectItem>
              <SelectItem value="online">อบรมออนไลน์</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="training_date">วันที่อบรม *</Label>
          <Input id="training_date" name="training_date" type="date" defaultValue={training?.training_date} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_hours">ระยะเวลา (ชั่วโมง)</Label>
          <Input
            id="duration_hours"
            name="duration_hours"
            type="number"
            step="0.5"
            defaultValue={training?.duration_hours || 1}
            min="0.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">สถานที่</Label>
          <Input id="location" name="location" defaultValue={training?.location} placeholder="ห้องประชุม, ออนไลน์, ฯลฯ" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants">จำนวนผู้เข้าร่วมสูงสุด</Label>
          <Input
            id="max_participants"
            name="max_participants"
            type="number"
            defaultValue={training?.max_participants}
            min="1"
            placeholder="ไม่จำกัด"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">ค่าใช้จ่าย (บาท)</Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            defaultValue={training?.cost || 0}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">สถานะ *</Label>
          <Select name="status" defaultValue={training?.status || "scheduled"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">กำหนดการ</SelectItem>
              <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
              <SelectItem value="completed">เสร็จสิ้น</SelectItem>
              <SelectItem value="cancelled">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียดหลักสูตร</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={training?.description}
          placeholder="รายละเอียดเกี่ยวกับหลักสูตรนี้..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectives">วัตถุประสงค์</Label>
        <Textarea
          id="objectives"
          name="objectives"
          defaultValue={training?.objectives}
          placeholder="วัตถุประสงค์ของหลักสูตร..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {training ? "บันทึกการแก้ไข" : "สร้างหลักสูตร"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}

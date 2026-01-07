"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLicense } from "@/lib/actions/licenses"
import { Loader2 } from "lucide-react"

export function LicenseForm({ license }: { license?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createLicense(formData)

    if (result.success) {
      router.push("/dashboard/licenses")
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
          <Label htmlFor="software_name">ชื่อซอฟต์แวร์ *</Label>
          <Input
            id="software_name"
            name="software_name"
            defaultValue={license?.software_name}
            placeholder="Microsoft Office 365"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">ผู้ให้บริการ *</Label>
          <Input id="vendor" name="vendor" defaultValue={license?.vendor} placeholder="Microsoft" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_key">License Key</Label>
          <Input
            id="license_key"
            name="license_key"
            defaultValue={license?.license_key}
            placeholder="XXXXX-XXXXX-XXXXX"
            type="password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_type">ประเภทใบอนุญาต *</Label>
          <Select name="license_type" defaultValue={license?.license_type || "subscription"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perpetual">ถาวร</SelectItem>
              <SelectItem value="subscription">รายปี</SelectItem>
              <SelectItem value="volume">Volume License</SelectItem>
              <SelectItem value="trial">ทดลองใช้</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_licenses">จำนวนใบอนุญาตทั้งหมด *</Label>
          <Input
            id="total_licenses"
            name="total_licenses"
            type="number"
            defaultValue={license?.total_licenses || 1}
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="used_licenses">จำนวนที่ใช้งาน</Label>
          <Input
            id="used_licenses"
            name="used_licenses"
            type="number"
            defaultValue={license?.used_licenses || 0}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_date">วันที่ซื้อ</Label>
          <Input id="purchase_date" name="purchase_date" type="date" defaultValue={license?.purchase_date} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry_date">วันที่หมดอายุ</Label>
          <Input id="expiry_date" name="expiry_date" type="date" defaultValue={license?.expiry_date} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">ราคา (บาท)</Label>
          <Input id="cost" name="cost" type="number" step="0.01" defaultValue={license?.cost} placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">สถานะ *</Label>
          <Select name="status" defaultValue={license?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">ใช้งาน</SelectItem>
              <SelectItem value="expiring_soon">ใกล้หมดอายุ</SelectItem>
              <SelectItem value="expired">หมดอายุ</SelectItem>
              <SelectItem value="cancelled">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">หมายเหตุ</Label>
        <Textarea id="notes" name="notes" defaultValue={license?.notes} placeholder="หมายเหตุเพิ่มเติม..." rows={4} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {license ? "บันทึกการแก้ไข" : "สร้างใบอนุญาต"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}

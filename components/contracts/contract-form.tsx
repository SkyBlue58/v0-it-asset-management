"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createContract } from "@/lib/actions/contracts"
import { Loader2 } from "lucide-react"

export function ContractForm({ contract }: { contract?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createContract(formData)

    if (result.success) {
      router.push("/dashboard/contracts")
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
          <Label htmlFor="contract_number">หมายเลขสัญญา *</Label>
          <Input
            id="contract_number"
            name="contract_number"
            defaultValue={contract?.contract_number}
            placeholder="CT-2024-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor_name">ผู้ให้บริการ/ผู้ขาย *</Label>
          <Input
            id="vendor_name"
            name="vendor_name"
            defaultValue={contract?.vendor_name}
            placeholder="บริษัท ABC จำกัด"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_type">ประเภทสัญญา *</Label>
          <Select name="contract_type" defaultValue={contract?.contract_type || "service"}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">บริการ</SelectItem>
              <SelectItem value="maintenance">บำรุงรักษา</SelectItem>
              <SelectItem value="lease">เช่า</SelectItem>
              <SelectItem value="purchase">ซื้อ</SelectItem>
              <SelectItem value="subscription">สมัครสมาชิก</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">สถานะ *</Label>
          <Select name="status" defaultValue={contract?.status || "active"}>
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

        <div className="space-y-2">
          <Label htmlFor="start_date">วันที่เริ่มต้น *</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={contract?.start_date} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">วันที่สิ้นสุด *</Label>
          <Input id="end_date" name="end_date" type="date" defaultValue={contract?.end_date} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_value">มูลค่าสัญญา (บาท)</Label>
          <Input
            id="contract_value"
            name="contract_value"
            type="number"
            step="0.01"
            defaultValue={contract?.contract_value}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_terms">เงื่อนไขการชำระเงิน</Label>
          <Input
            id="payment_terms"
            name="payment_terms"
            defaultValue={contract?.payment_terms}
            placeholder="เช่น: รายเดือน, รายปี"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียด</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={contract?.description}
          placeholder="รายละเอียดของสัญญา..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">หมายเหตุ</Label>
        <Textarea id="notes" name="notes" defaultValue={contract?.notes} placeholder="หมายเหตุเพิ่มเติม..." rows={3} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {contract ? "บันทึกการแก้ไข" : "สร้างสัญญา"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface AssetFormProps {
  categories: any[]
  locations: any[]
  users: any[]
  asset?: any
}

interface AssetFormData {
  asset_code: string
  name: string
  category_id: string
  serial_number?: string
  model?: string
  manufacturer?: string
  purchase_date?: string
  purchase_price?: string
  warranty_end_date?: string
  location_id?: string
  assigned_to?: string
  status: string
  condition: string
  description?: string
  notes?: string
}

export function AssetForm({ categories, locations, users, asset }: AssetFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AssetFormData>({
    defaultValues: asset
      ? {
          asset_code: asset.asset_code,
          name: asset.name,
          category_id: asset.category_id || "",
          serial_number: asset.serial_number || "",
          model: asset.model || "",
          manufacturer: asset.manufacturer || "",
          purchase_date: asset.purchase_date || "",
          purchase_price: asset.purchase_price?.toString() || "",
          warranty_end_date: asset.warranty_end_date || "",
          location_id: asset.location_id || "",
          assigned_to: asset.assigned_to || "",
          status: asset.status || "available",
          condition: asset.condition || "good",
          description: asset.description || "",
          notes: asset.notes || "",
        }
      : {
          asset_code: "",
          name: "",
          category_id: "",
          status: "available",
          condition: "good",
        },
  })

  const onSubmit = async (data: AssetFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const assetData = {
        ...data,
        purchase_price: data.purchase_price ? Number.parseFloat(data.purchase_price) : null,
        purchase_date: data.purchase_date || null,
        warranty_end_date: data.warranty_end_date || null,
        location_id: data.location_id || null,
        assigned_to: data.assigned_to || null,
        serial_number: data.serial_number || null,
        model: data.model || null,
        manufacturer: data.manufacturer || null,
        description: data.description || null,
        notes: data.notes || null,
      }

      if (asset) {
        const { error: updateError } = await supabase.from("assets").update(assetData).eq("id", asset.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("assets").insert([assetData])
        if (insertError) throw insertError
      }

      router.push("/dashboard/assets")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="asset_code"
            rules={{ required: "กรุณากรอกรหัสทรัพย์สิน" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสทรัพย์สิน *</FormLabel>
                <FormControl>
                  <Input placeholder="AST-001" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>รหัสเฉพาะสำหรับทรัพย์สิน</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            rules={{ required: "กรุณากรอกชื่อทรัพย์สิน" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อทรัพย์สิน *</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น Dell Laptop Latitude 5420" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            rules={{ required: "กรุณาเลือกหมวดหมู่" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมวดหมู่ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="S/N" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รุ่น</FormLabel>
                <FormControl>
                  <Input placeholder="Model" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ผู้ผลิต</FormLabel>
                <FormControl>
                  <Input placeholder="Dell, HP, Lenovo..." {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่จัดซื้อ</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ราคา (บาท)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warranty_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันหมดประกัน</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานที่</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานที่" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.building} - {location.floor} - {location.room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>มอบหมายให้</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกผู้ใช้งาน" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.employee_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            rules={{ required: "กรุณาเลือกสถานะ" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">พร้อมใช้งาน</SelectItem>
                    <SelectItem value="in_use">กำลังใช้งาน</SelectItem>
                    <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
                    <SelectItem value="retired">เลิกใช้งาน</SelectItem>
                    <SelectItem value="lost">สูญหาย</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            rules={{ required: "กรุณาเลือกสภาพ" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>สภาพ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="excellent">ดีเยี่ยม</SelectItem>
                    <SelectItem value="good">ดี</SelectItem>
                    <SelectItem value="fair">พอใช้</SelectItem>
                    <SelectItem value="poor">ต้องซ่อม</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับทรัพย์สิน..." rows={3} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หมายเหตุ</FormLabel>
              <FormControl>
                <Textarea placeholder="บันทึกเพิ่มเติม..." rows={2} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "กำลังบันทึก..." : asset ? "บันทึกการแก้ไข" : "เพิ่มทรัพย์สิน"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Form>
  )
}

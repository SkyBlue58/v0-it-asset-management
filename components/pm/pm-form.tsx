"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface PMFormProps {
  assets: any[]
  users: any[]
  schedule?: any
}

interface PMFormData {
  asset_id: string
  name: string
  description?: string
  frequency_days: string
  next_pm_date: string
  assigned_to?: string
  is_active: boolean
}

export function PMForm({ assets, users, schedule }: PMFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PMFormData>({
    defaultValues: schedule
      ? {
          asset_id: schedule.asset_id,
          name: schedule.name,
          description: schedule.description || "",
          frequency_days: schedule.frequency_days.toString(),
          next_pm_date: schedule.next_pm_date,
          assigned_to: schedule.assigned_to || "",
          is_active: schedule.is_active,
        }
      : {
          asset_id: "",
          name: "",
          description: "",
          frequency_days: "30",
          next_pm_date: "",
          assigned_to: "",
          is_active: true,
        },
  })

  const onSubmit = async (data: PMFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const pmData = {
        ...data,
        frequency_days: Number.parseInt(data.frequency_days),
        assigned_to: data.assigned_to || null,
        description: data.description || null,
      }

      if (schedule) {
        const { error: updateError } = await supabase.from("pm_schedules").update(pmData).eq("id", schedule.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("pm_schedules").insert([pmData])
        if (insertError) throw insertError
      }

      router.push("/dashboard/pm")
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
        <FormField
          control={form.control}
          name="asset_id"
          rules={{ required: "กรุณาเลือกทรัพย์สิน" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ทรัพย์สิน *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกทรัพย์สิน" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.asset_code} - {asset.name}
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
          name="name"
          rules={{ required: "กรุณากรอกชื่อกำหนดการ" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อกำหนดการ *</FormLabel>
              <FormControl>
                <Input placeholder="เช่น การทำความสะอาดและตรวจสอบเครื่องพิมพ์" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea placeholder="รายละเอียดงานที่ต้องทำ..." rows={3} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="frequency_days"
            rules={{ required: "กรุณากรอกความถี่" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ความถี่ (วัน) *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="30" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>ระบุความถี่ในการทำ PM เป็นวัน</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_pm_date"
            rules={{ required: "กรุณาเลือกวันที่" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>PM ครั้งถัดไป *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
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
                      <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
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
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>ใช้งาน</FormLabel>
                  <FormDescription>เปิดใช้งานกำหนดการนี้</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "กำลังบันทึก..." : schedule ? "บันทึกการแก้ไข" : "สร้างกำหนดการ"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Form>
  )
}

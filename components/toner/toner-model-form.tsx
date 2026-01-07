"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface TonerModelFormProps {
  tonerModel?: any
}

interface TonerModelFormData {
  model_number: string
  name: string
  manufacturer?: string
  color?: string
  type: string
  price?: string
  min_stock_level: string
  is_active: boolean
}

const tonerTypes = ["toner", "ink", "drum", "fuser"]
const tonerColors = ["Black", "Cyan", "Magenta", "Yellow", "Color"]

export function TonerModelForm({ tonerModel }: TonerModelFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TonerModelFormData>({
    defaultValues: tonerModel
      ? {
          model_number: tonerModel.model_number,
          name: tonerModel.name,
          manufacturer: tonerModel.manufacturer || "",
          color: tonerModel.color || "",
          type: tonerModel.type || "toner",
          price: tonerModel.price?.toString() || "",
          min_stock_level: tonerModel.min_stock_level.toString(),
          is_active: tonerModel.is_active,
        }
      : {
          model_number: "",
          name: "",
          manufacturer: "",
          color: "",
          type: "toner",
          price: "",
          min_stock_level: "5",
          is_active: true,
        },
  })

  const onSubmit = async (data: TonerModelFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const modelData = {
        ...data,
        price: data.price ? Number.parseFloat(data.price) : null,
        min_stock_level: Number.parseInt(data.min_stock_level),
        manufacturer: data.manufacturer || null,
        color: data.color || null,
      }

      if (tonerModel) {
        const { error: updateError } = await supabase.from("toner_models").update(modelData).eq("id", tonerModel.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("toner_models").insert([modelData])
        if (insertError) throw insertError
      }

      router.push("/dashboard/toner")
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
            name="model_number"
            rules={{ required: "กรุณากรอกรหัสรุ่น" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสรุ่น *</FormLabel>
                <FormControl>
                  <Input placeholder="CF283A" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            rules={{ required: "กรุณากรอกชื่อ" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ *</FormLabel>
                <FormControl>
                  <Input placeholder="HP 83A Black LaserJet Toner" {...field} disabled={isLoading} />
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
                  <Input placeholder="HP, Canon, Brother..." {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สี</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสี" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tonerColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
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
            name="type"
            rules={{ required: "กรุณาเลือกประเภท" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภท *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tonerTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="price"
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
            name="min_stock_level"
            rules={{ required: "กรุณากรอกสต็อกขั้นต่ำ" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>สต็อกขั้นต่ำ *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="5" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>แจ้งเตือนเมื่อสต็อกต่ำกว่าค่านี้</FormDescription>
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
                  <FormDescription>เปิดใช้งานรุ่นนี้</FormDescription>
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
            {isLoading ? "กำลังบันทึก..." : tonerModel ? "บันทึกการแก้ไข" : "เพิ่มรุ่นตลับหมึก"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Form>
  )
}

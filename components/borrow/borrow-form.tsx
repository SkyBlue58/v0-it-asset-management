"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface BorrowFormProps {
  userId: string
  assets: any[]
}

interface BorrowFormData {
  asset_id: string
  borrow_date: string
  expected_return_date: string
  purpose: string
  notes?: string
}

export function BorrowForm({ userId, assets }: BorrowFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BorrowFormData>({
    defaultValues: {
      asset_id: "",
      borrow_date: new Date().toISOString().split("T")[0],
      expected_return_date: "",
      purpose: "",
      notes: "",
    },
  })

  const onSubmit = async (data: BorrowFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const requestData = {
        ...data,
        requester_id: userId,
        status: "pending",
      }

      const { error: insertError } = await supabase.from("borrow_requests").insert([requestData])

      if (insertError) throw insertError

      router.push("/dashboard/borrow")
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
          rules={{ required: "กรุณาเลือกอุปกรณ์" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>อุปกรณ์ที่ต้องการยืม *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอุปกรณ์" />
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

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="borrow_date"
            rules={{ required: "กรุณาระบุวันที่ยืม" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่ยืม *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_return_date"
            rules={{ required: "กรุณาระบุวันที่คืน" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่กำหนดคืน *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="purpose"
          rules={{ required: "กรุณาระบุวัตถุประสงค์" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>วัตถุประสงค์ *</FormLabel>
              <FormControl>
                <Textarea placeholder="ระบุวัตถุประสงค์การยืม..." rows={3} {...field} disabled={isLoading} />
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
                <Textarea placeholder="หมายเหตุเพิ่มเติม..." rows={2} {...field} disabled={isLoading} />
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
            {isLoading ? "กำลังส่งคำขอ..." : "ส่งคำขอยืม"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Form>
  )
}

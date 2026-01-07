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

interface TicketFormProps {
  userId: string
  priorities: any[]
  locations: any[]
  assets: any[]
}

interface TicketFormData {
  title: string
  description: string
  category: string
  priority_id: string
  location_id?: string
  asset_id?: string
}

const categories = ["Hardware", "Software", "Network", "Printer", "Email", "Account", "Security", "Other"]

export function TicketForm({ userId, priorities, locations, assets }: TicketFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TicketFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority_id: "",
      location_id: "",
      asset_id: "",
    },
  })

  const onSubmit = async (data: TicketFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const ticketData = {
        ...data,
        requester_id: userId,
        status: "open",
        location_id: data.location_id || null,
        asset_id: data.asset_id || null,
      }

      const { error: insertError } = await supabase.from("tickets").insert([ticketData])

      if (insertError) throw insertError

      router.push("/dashboard/tickets")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสร้างรายการแจ้งซ่อม")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "กรุณากรอกหัวข้อ" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>หัวข้อ *</FormLabel>
              <FormControl>
                <Input placeholder="เช่น เครื่องพิมพ์ไม่สามารถพิมพ์ได้" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "กรุณากรอกรายละเอียด" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียด *</FormLabel>
              <FormControl>
                <Textarea placeholder="อธิบายปัญหาโดยละเอียด..." rows={5} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
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
                      <SelectItem key={category} value={category}>
                        {category}
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
            name="priority_id"
            rules={{ required: "กรุณาเลือกความสำคัญ" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ความสำคัญ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกความสำคัญ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id}>
                        {priority.name}
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
            name="asset_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ทรัพย์สินที่เกี่ยวข้อง</FormLabel>
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
            {isLoading ? "กำลังสร้าง..." : "สร้างรายการแจ้งซ่อม"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Form>
  )
}

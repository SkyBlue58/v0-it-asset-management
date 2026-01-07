"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTonerStock } from "@/lib/actions/toner"
import { AlertCircle, Loader2, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TonerStockDialogProps {
  modelId: string
  modelName: string
  currentStock: number
}

export function TonerStockDialog({ modelId, modelName, currentStock }: TonerStockDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "adjust">("in")
  const [quantity, setQuantity] = useState("")

  const handleSubmit = async () => {
    if (!quantity || Number(quantity) <= 0) {
      setError("กรุณาระบุจำนวนที่ถูกต้อง")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await updateTonerStock(modelId, Number(quantity), transactionType)
      setIsOpen(false)
      setQuantity("")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="mr-2 h-4 w-4" />
          จัดการสต็อก
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>จัดการสต็อก - {modelName}</DialogTitle>
          <DialogDescription>สต็อกปัจจุบัน: {currentStock} ชิ้น</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">ประเภทรายการ</Label>
            <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">รับเข้า</SelectItem>
                <SelectItem value="out">เบิกออก</SelectItem>
                <SelectItem value="return">คืน</SelectItem>
                <SelectItem value="adjust">ปรับปรุง</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">{transactionType === "adjust" ? "สต็อกใหม่" : "จำนวน"}</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

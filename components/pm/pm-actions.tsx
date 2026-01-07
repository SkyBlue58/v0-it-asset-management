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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { completePM, updatePMStatus } from "@/lib/actions/pm"
import { AlertCircle, CheckCircle, Loader2, Play } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PMActionsProps {
  scheduleId: string
  status: string
  userId: string
  userRole: string
}

export function PMActions({ scheduleId, status, userId, userRole }: PMActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  const canManage = userRole === "admin" || userRole === "technician"

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await completePM(scheduleId, userId, notes)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStart = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updatePMStatus(scheduleId, "in_progress")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!canManage) return null

  if (status === "pending") {
    return (
      <Button size="sm" onClick={handleStart} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
        เริ่มงาน
      </Button>
    )
  }

  if (status === "in_progress") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            เสร็จสิ้น
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>บันทึกการทำ PM</DialogTitle>
            <DialogDescription>กรุณาระบุรายละเอียดการทำงาน</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">หมายเหตุ</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="บันทึกรายละเอียดการทำ PM..."
                rows={4}
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
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึกเสร็จสิ้น
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}

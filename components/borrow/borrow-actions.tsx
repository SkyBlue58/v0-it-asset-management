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
import { approveBorrowRequest, rejectBorrowRequest, returnBorrowRequest } from "@/lib/actions/borrow"
import { AlertCircle, CheckCircle, Loader2, XCircle, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BorrowActionsProps {
  requestId: string
  status: string
  userId: string
  userRole: string
}

export function BorrowActions({ requestId, status, userId, userRole }: BorrowActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const canApprove = userRole === "admin" || userRole === "technician"

  const handleApprove = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await approveBorrowRequest(requestId, userId)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await rejectBorrowRequest(requestId, userId, rejectReason)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await returnBorrowRequest(requestId)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "pending" && canApprove) {
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={handleApprove} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          อนุมัติ
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              ปฏิเสธ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ปฏิเสธคำขอยืม</DialogTitle>
              <DialogDescription>กรุณาระบุเหตุผลในการปฏิเสธ</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">เหตุผล</Label>
                <Textarea
                  id="reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="ระบุเหตุผล..."
                  rows={3}
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
              <Button onClick={handleReject} disabled={isLoading} variant="destructive">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ยืนยันปฏิเสธ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (status === "approved" && canApprove) {
    return (
      <Button size="sm" onClick={handleReturn} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
        บันทึกการคืน
      </Button>
    )
  }

  return null
}

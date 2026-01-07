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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { updateTicketStatus, assignTicket } from "@/lib/actions/tickets"
import { AlertCircle, CheckCircle, Loader2, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TicketActionsProps {
  ticketId: string
  currentStatus: string
  technicians: any[]
  currentAssignee?: string
  userRole: string
}

export function TicketActions({ ticketId, currentStatus, technicians, currentAssignee, userRole }: TicketActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState(currentAssignee || "")
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const canManage = userRole === "admin" || userRole === "technician"

  const handleStatusChange = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateTicketStatus(ticketId, selectedStatus)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await assignTicket(ticketId, selectedTechnician)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!canManage) return null

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            เปลี่ยนสถานะ
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เปลี่ยนสถานะแจ้งซ่อม</DialogTitle>
            <DialogDescription>เลือกสถานะใหม่สำหรับแจ้งซ่อมนี้</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">สถานะ</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">เปิดใหม่</SelectItem>
                  <SelectItem value="assigned">มอบหมายแล้ว</SelectItem>
                  <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                  <SelectItem value="resolved">แก้ไขแล้ว</SelectItem>
                  <SelectItem value="closed">ปิดแล้ว</SelectItem>
                  <SelectItem value="cancelled">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleStatusChange} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            มอบหมายงาน
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>มอบหมายงานให้ช่าง</DialogTitle>
            <DialogDescription>เลือกช่างที่จะรับผิดชอบแจ้งซ่อมนี้</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="technician">ช่าง</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="เลือกช่าง" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.first_name} {tech.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAssign} disabled={isLoading || !selectedTechnician}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              มอบหมาย
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

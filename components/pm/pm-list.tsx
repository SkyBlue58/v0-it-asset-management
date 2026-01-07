"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { format, isPast, differenceInDays } from "date-fns"
import { th } from "date-fns/locale"

interface PMSchedule {
  id: string
  name: string
  next_pm_date: string
  last_pm_date?: string
  frequency_days: number
  is_active: boolean
  asset?: {
    asset_code: string
    name: string
    model?: string
    category?: {
      name: string
    }
  }
  assigned_user?: {
    first_name: string
    last_name: string
  }
}

interface PMListProps {
  schedules: PMSchedule[]
  userRole: string
}

export function PMList({ schedules, userRole }: PMListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อกำหนดการ</TableHead>
            <TableHead>ทรัพย์สิน</TableHead>
            <TableHead>ความถี่ (วัน)</TableHead>
            <TableHead>PM ครั้งล่าสุด</TableHead>
            <TableHead>PM ครั้งถัดไป</TableHead>
            <TableHead>ผู้รับผิดชอบ</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                ไม่มีกำหนดการ PM
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => {
              const daysUntilPM = differenceInDays(new Date(schedule.next_pm_date), new Date())
              const isOverdue = isPast(new Date(schedule.next_pm_date))
              const isDueSoon = daysUntilPM <= 7 && !isOverdue

              return (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell>
                    {schedule.asset && (
                      <div>
                        <div className="font-medium">{schedule.asset.name}</div>
                        <div className="text-xs text-muted-foreground">{schedule.asset.asset_code}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{schedule.frequency_days} วัน</TableCell>
                  <TableCell className="text-sm">
                    {schedule.last_pm_date
                      ? format(new Date(schedule.last_pm_date), "dd MMM yyyy", { locale: th })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      {isOverdue && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {format(new Date(schedule.next_pm_date), "dd MMM yyyy", { locale: th })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {schedule.assigned_user ? (
                      <div className="text-sm">
                        {schedule.assigned_user.first_name} {schedule.assigned_user.last_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!schedule.is_active ? (
                      <Badge variant="outline">ไม่ใช้งาน</Badge>
                    ) : isOverdue ? (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">เลยกำหนด</Badge>
                    ) : isDueSoon ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        ใกล้ถึงกำหนด
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        ปกติ
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon-sm" variant="ghost" asChild>
                        <Link href={`/dashboard/pm/${schedule.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {(userRole === "admin" || userRole === "technician") && (
                        <Button size="icon-sm" variant="ghost" asChild>
                          <Link href={`/dashboard/pm/${schedule.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

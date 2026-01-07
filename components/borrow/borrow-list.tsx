"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface BorrowRequest {
  id: string
  request_number: string
  status: string
  borrow_date: string
  expected_return_date: string
  actual_return_date?: string
  asset?: {
    asset_code: string
    name: string
  }
  requester?: {
    first_name: string
    last_name: string
    employee_id: string
  }
  [key: string]: any
}

interface BorrowListProps {
  requests: BorrowRequest[]
  userRole: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  borrowed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  returned: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  pending: "รอการอนุมัติ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
  borrowed: "กำลังยืม",
  returned: "คืนแล้ว",
  overdue: "เกินกำหนด",
}

export function BorrowList({ requests, userRole }: BorrowListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่</TableHead>
            <TableHead>ทรัพย์สิน</TableHead>
            <TableHead>ผู้ยืม</TableHead>
            <TableHead>วันที่ยืม</TableHead>
            <TableHead>กำหนดคืน</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                ไม่มีรายการ
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.request_number}</TableCell>
                <TableCell>
                  {request.asset && (
                    <div>
                      <div className="font-medium">{request.asset.name}</div>
                      <div className="text-xs text-muted-foreground">{request.asset.asset_code}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {request.requester && (
                    <div>
                      <div className="text-sm">
                        {request.requester.first_name} {request.requester.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground">{request.requester.employee_id}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(request.borrow_date), "dd MMM yyyy", { locale: th })}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(request.expected_return_date), "dd MMM yyyy", { locale: th })}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[request.status]}>{statusLabels[request.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon-sm" variant="ghost" asChild>
                    <Link href={`/dashboard/borrow/${request.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

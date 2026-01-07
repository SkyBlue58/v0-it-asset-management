"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface Ticket {
  id: string
  ticket_number: string
  title: string
  status: string
  category?: string
  created_at: string
  requester?: {
    first_name: string
    last_name: string
    email: string
  }
  assigned?: {
    first_name: string
    last_name: string
  }
  priority?: {
    name: string
    color?: string
  }
}

interface TicketListProps {
  tickets: Ticket[]
  userRole: string
}

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  open: "เปิดใหม่",
  in_progress: "กำลังดำเนินการ",
  pending: "รอดำเนินการ",
  resolved: "แก้ไขแล้ว",
  closed: "ปิดแล้ว",
  cancelled: "ยกเลิก",
}

export function TicketList({ tickets, userRole }: TicketListProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "all") return true
    if (activeTab === "my") return ticket.status === "open" || ticket.status === "in_progress"
    return ticket.status === activeTab
  })

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">ทั้งหมด ({tickets.length})</TabsTrigger>
          <TabsTrigger value="my">
            ของฉัน ({tickets.filter((t) => t.status === "open" || t.status === "in_progress").length})
          </TabsTrigger>
          <TabsTrigger value="open">เปิดใหม่ ({tickets.filter((t) => t.status === "open").length})</TabsTrigger>
          <TabsTrigger value="in_progress">
            กำลังดำเนินการ ({tickets.filter((t) => t.status === "in_progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">แก้ไขแล้ว ({tickets.filter((t) => t.status === "resolved").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">ไม่มีรายการแจ้งซ่อม</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่</TableHead>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>ความสำคัญ</TableHead>
                    <TableHead>ผู้แจ้ง</TableHead>
                    <TableHead>ผู้รับผิดชอบ</TableHead>
                    <TableHead>วันที่แจ้ง</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.title}</div>
                          {ticket.category && <div className="text-xs text-muted-foreground">{ticket.category}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.priority && (
                          <Badge variant="outline" style={{ borderColor: ticket.priority.color }}>
                            {ticket.priority.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.requester ? (
                          <div className="text-sm">
                            {ticket.requester.first_name} {ticket.requester.last_name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.assigned ? (
                          <div className="text-sm">
                            {ticket.assigned.first_name} {ticket.assigned.last_name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">ยังไม่ได้มอบหมาย</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(ticket.created_at), "dd MMM yyyy HH:mm", { locale: th })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon-sm" variant="ghost" asChild>
                            <Link href={`/dashboard/tickets/${ticket.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(userRole === "admin" || userRole === "technician") && (
                            <Button size="icon-sm" variant="ghost" asChild>
                              <Link href={`/dashboard/tickets/${ticket.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

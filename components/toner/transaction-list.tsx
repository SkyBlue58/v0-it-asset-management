"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { ArrowRight, Package, TrendingDown, TrendingUp } from "lucide-react"

interface Transaction {
  id: string
  transaction_number: string
  transaction_type: string
  quantity: number
  notes?: string
  created_at: string
  toner_model?: {
    model_number: string
    name: string
    color?: string
  }
  requester?: {
    first_name: string
    last_name: string
    employee_id: string
  }
  from_location?: {
    building: string
    floor: string
    room: string
  }
  to_location?: {
    building: string
    floor: string
    room: string
  }
}

interface TransactionListProps {
  transactions: Transaction[]
}

const typeColors: Record<string, string> = {
  receive: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  issue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  return: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  adjust: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const typeLabels: Record<string, string> = {
  receive: "รับเข้า",
  issue: "เบิกออก",
  return: "คืน",
  adjust: "ปรับปรุง",
}

const typeIcons: Record<string, any> = {
  receive: TrendingUp,
  issue: TrendingDown,
  return: Package,
  adjust: ArrowRight,
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>รุ่นตลับหมึก</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>ผู้ทำรายการ</TableHead>
            <TableHead>สถานที่</TableHead>
            <TableHead>วันที่</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                ไม่มีรายการ
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const TypeIcon = typeIcons[transaction.transaction_type]

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.transaction_number}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[transaction.transaction_type]}>
                      <TypeIcon className="mr-1 h-3 w-3" />
                      {typeLabels[transaction.transaction_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.toner_model && (
                      <div>
                        <div className="font-medium">{transaction.toner_model.name}</div>
                        <div className="text-xs text-muted-foreground">{transaction.toner_model.model_number}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.quantity}</TableCell>
                  <TableCell>
                    {transaction.requester && (
                      <div className="text-sm">
                        {transaction.requester.first_name} {transaction.requester.last_name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transaction.from_location && (
                        <div>
                          จาก: {transaction.from_location.building} - {transaction.from_location.room}
                        </div>
                      )}
                      {transaction.to_location && (
                        <div>
                          ไป: {transaction.to_location.building} - {transaction.to_location.room}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.created_at), "dd MMM yyyy HH:mm", { locale: th })}
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

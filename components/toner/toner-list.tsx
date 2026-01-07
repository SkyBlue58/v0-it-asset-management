"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface TonerModel {
  id: string
  model_number: string
  name: string
  manufacturer?: string
  color?: string
  type?: string
  price?: number
  min_stock_level: number
  is_active: boolean
  stock?: Array<{
    id: string
    quantity: number
    reserved_quantity: number
    location?: {
      building: string
      floor: string
      room: string
    }
  }>
}

interface TonerListProps {
  tonerModels: TonerModel[]
  userRole: string
}

export function TonerList({ tonerModels, userRole }: TonerListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredModels = tonerModels.filter(
    (model) =>
      model.model_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาด้วยรหัสรุ่นหรือชื่อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสรุ่น</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>ผู้ผลิต</TableHead>
              <TableHead>สี/ประเภท</TableHead>
              <TableHead>สต็อกคงเหลือ</TableHead>
              <TableHead>สต็อกขั้นต่ำ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  ไม่พบรุ่นตลับหมึก
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model) => {
                const totalStock = model.stock?.reduce((sum, stock) => sum + stock.quantity, 0) || 0
                const isLowStock = totalStock <= model.min_stock_level

                return (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.model_number}</TableCell>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{model.manufacturer || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {model.color && <Badge variant="outline">{model.color}</Badge>}
                        {model.type && <Badge variant="secondary">{model.type}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        <span className={isLowStock ? "font-bold text-red-600" : ""}>{totalStock}</span>
                      </div>
                    </TableCell>
                    <TableCell>{model.min_stock_level}</TableCell>
                    <TableCell>
                      {model.is_active ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ใช้งาน
                        </Badge>
                      ) : (
                        <Badge variant="outline">ไม่ใช้งาน</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon-sm" variant="ghost" asChild>
                          <Link href={`/dashboard/toner/${model.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {(userRole === "admin" || userRole === "technician") && (
                          <Button size="icon-sm" variant="ghost" asChild>
                            <Link href={`/dashboard/toner/${model.id}/edit`}>
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
    </div>
  )
}

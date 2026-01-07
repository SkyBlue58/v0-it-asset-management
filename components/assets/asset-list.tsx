"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Search } from "lucide-react"
import Link from "next/link"

interface Asset {
  id: string
  asset_code: string
  name: string
  status: string
  condition: string
  serial_number?: string
  model?: string
  manufacturer?: string
  category?: {
    name: string
    code: string
  }
  location?: {
    building: string
    floor: string
    room: string
  }
  assigned_user?: {
    first_name: string
    last_name: string
    employee_id: string
  }
}

interface AssetListProps {
  assets: Asset[]
  userRole: string
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  in_use: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  retired: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  available: "พร้อมใช้งาน",
  in_use: "กำลังใช้งาน",
  maintenance: "ซ่อมบำรุง",
  retired: "เลิกใช้งาน",
  lost: "สูญหาย",
}

const conditionColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  fair: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  poor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const conditionLabels: Record<string, string> = {
  excellent: "ดีเยี่ยม",
  good: "ดี",
  fair: "พอใช้",
  poor: "ต้องซ่อม",
}

export function AssetList({ assets, userRole }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || asset.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาด้วยรหัส, ชื่อ, หรือ Serial Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="available">พร้อมใช้งาน</SelectItem>
            <SelectItem value="in_use">กำลังใช้งาน</SelectItem>
            <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
            <SelectItem value="retired">เลิกใช้งาน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">ไม่พบทรัพย์สิน</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสทรัพย์สิน</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>สภาพ</TableHead>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead>สถานที่</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.asset_code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      {asset.model && <div className="text-xs text-muted-foreground">{asset.model}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{asset.category ? <Badge variant="outline">{asset.category.name}</Badge> : "-"}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[asset.status]}>{statusLabels[asset.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={conditionColors[asset.condition]}>{conditionLabels[asset.condition]}</Badge>
                  </TableCell>
                  <TableCell>
                    {asset.assigned_user ? (
                      <div className="text-sm">
                        {asset.assigned_user.first_name} {asset.assigned_user.last_name}
                        <div className="text-xs text-muted-foreground">{asset.assigned_user.employee_id}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {asset.location ? (
                      <div className="text-sm">
                        {asset.location.building} - {asset.location.floor}/{asset.location.room}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon-sm" variant="ghost" asChild>
                        <Link href={`/dashboard/assets/${asset.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {(userRole === "admin" || userRole === "technician") && (
                        <Button size="icon-sm" variant="ghost" asChild>
                          <Link href={`/dashboard/assets/${asset.id}/edit`}>
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
    </div>
  )
}

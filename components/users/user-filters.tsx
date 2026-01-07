"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function UserFilters() {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน..." className="pl-9" />
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="แผนก" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทุกแผนก</SelectItem>
          <SelectItem value="it">IT</SelectItem>
          <SelectItem value="hr">HR</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="บทบาท" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทุกบทบาท</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="technician">Technician</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"

export async function ContractList() {
  const supabase = await createServerClient()

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, vendor:vendors(name)")
    .order("created_at", { ascending: false })
    .limit(50)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "ใช้งาน", variant: "default" },
      expired: { label: "หมดอายุ", variant: "destructive" },
      cancelled: { label: "ยกเลิก", variant: "secondary" },
    }
    const config = variants[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getContractTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      service: "บริการ",
      maintenance: "ซ่อมบำรุง",
      license: "ใบอนุญาต",
      support: "ซัพพอร์ต",
      other: "อื่นๆ",
    }
    return types[type] || type
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่สัญญา</TableHead>
            <TableHead>ชื่อสัญญา</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>ผู้ขาย/ผู้ให้บริการ</TableHead>
            <TableHead>วันที่เริ่มต้น</TableHead>
            <TableHead>วันที่สิ้นสุด</TableHead>
            <TableHead>มูลค่า</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts && contracts.length > 0 ? (
            contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.contract_number}</TableCell>
                <TableCell>{contract.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getContractTypeBadge(contract.contract_type)}</Badge>
                </TableCell>
                <TableCell>{contract.vendor?.name || "ไม่ระบุ"}</TableCell>
                <TableCell>{new Date(contract.start_date).toLocaleDateString("th-TH")}</TableCell>
                <TableCell>
                  {new Date(contract.end_date).toLocaleDateString("th-TH")}
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(contract.end_date), {
                      addSuffix: true,
                      locale: th,
                    })}
                  </div>
                </TableCell>
                <TableCell>฿{contract.value?.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(contract.status)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/contracts/${contract.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                ไม่มีข้อมูลสัญญา
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

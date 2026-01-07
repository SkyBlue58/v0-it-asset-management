import { createServerClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export async function LicenseList() {
  const supabase = await createServerClient()

  const { data: licenses } = await supabase
    .from("software_licenses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "ใช้งาน", variant: "default" },
      expired: { label: "หมดอายุ", variant: "destructive" },
      suspended: { label: "ระงับ", variant: "secondary" },
    }
    const config = variants[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getLicenseTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      perpetual: "ถาวร",
      subscription: "รายปี",
      trial: "ทดลองใช้",
    }
    return types[type] || type
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่ใบอนุญาต</TableHead>
            <TableHead>ซอฟต์แวร์</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>จำนวน License</TableHead>
            <TableHead>การใช้งาน</TableHead>
            <TableHead>วันหมดอายุ</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses && licenses.length > 0 ? (
            licenses.map((license) => {
              const usagePercent = (license.used_licenses / license.total_licenses) * 100
              return (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.license_number}</TableCell>
                  <TableCell>{license.software_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getLicenseTypeBadge(license.license_type)}</Badge>
                  </TableCell>
                  <TableCell>{license.total_licenses}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {license.used_licenses} / {license.total_licenses}
                        </span>
                        <span className="text-muted-foreground">{Math.round(usagePercent)}%</span>
                      </div>
                      <Progress value={usagePercent} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {license.expiry_date ? new Date(license.expiry_date).toLocaleDateString("th-TH") : "ไม่จำกัด"}
                  </TableCell>
                  <TableCell>{getStatusBadge(license.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/licenses/${license.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                ไม่มีข้อมูลใบอนุญาต
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

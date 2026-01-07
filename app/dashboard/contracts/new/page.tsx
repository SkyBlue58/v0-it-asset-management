import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ContractForm } from "@/components/contracts/contract-form"

export default function NewContractPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contracts">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">เพิ่มสัญญาใหม่</h1>
          <p className="text-muted-foreground">กรอกข้อมูลสัญญาและผู้ให้บริการ</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสัญญา</CardTitle>
          <CardDescription>กรุณากรอกรายละเอียดสัญญาให้ครบถ้วน</CardDescription>
        </CardHeader>
        <CardContent>
          <ContractForm />
        </CardContent>
      </Card>
    </div>
  )
}

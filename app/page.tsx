import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, TicketIcon, Calendar, FileText, Users, Settings, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: TicketIcon,
      title: "ระบบแจ้งซ่อม",
      description: "จัดการและติดตามการแจ้งซ่อมอย่างมีประสิทธิภาพ",
    },
    {
      icon: Package,
      title: "จัดการทรัพย์สิน",
      description: "ตรวจสอบและจัดการทรัพย์สิน IT ทั้งหมด",
    },
    {
      icon: Calendar,
      title: "PM Schedule",
      description: "กำหนดการบำรุงรักษาเชิงป้องกัน",
    },
    {
      icon: FileText,
      title: "ยืม-คืนอุปกรณ์",
      description: "จัดการการยืม-คืนอุปกรณ์อย่างเป็นระบบ",
    },
    {
      icon: Users,
      title: "จัดการผู้ใช้",
      description: "ระบบ HR และการจัดการพนักงาน",
    },
    {
      icon: BarChart3,
      title: "รายงานและวิเคราะห์",
      description: "สรุปข้อมูลและสถิติแบบ Real-time",
    },
    {
      icon: Settings,
      title: "คลังอะไหล่",
      description: "จัดการตลับหมึกและอะไหล่",
    },
    {
      icon: Shield,
      title: "ความปลอดภัย",
      description: "ระบบรักษาความปลอดภัยข้อมูล",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight lg:text-6xl">
            IT Asset Management System
          </h1>
          <p className="mb-8 text-pretty text-xl text-muted-foreground">
            ระบบจัดการทรัพย์สินและงาน IT ที่ครบครันสำหรับองค์กร
            <br />
            ตั้งแต่การแจ้งซ่อม การจัดการทรัพย์สิน ไปจนถึงการบำรุงรักษาเชิงป้องกัน
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-up">ลงทะเบียน</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">ฟีเจอร์ครบครัน 16 โมดูล</h2>
          <p className="text-lg text-muted-foreground">ทุกสิ่งที่คุณต้องการในการจัดการ IT ขององค์กร</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">99.9%</div>
              <h3 className="mb-2 font-semibold">ความพร้อมใช้งาน</h3>
              <p className="text-sm text-muted-foreground">ระบบทำงานได้ตลอด 24/7 พร้อมรองรับการใช้งานหนัก</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">50%</div>
              <h3 className="mb-2 font-semibold">ลดเวลาทำงาน</h3>
              <p className="text-sm text-muted-foreground">ประหยัดเวลาในการจัดการงาน IT ได้มากกว่า 50%</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">100%</div>
              <h3 className="mb-2 font-semibold">ติดตามได้ครบ</h3>
              <p className="text-sm text-muted-foreground">ตรวจสอบสถานะและประวัติได้อย่างละเอียดทุกรายการ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 IT Asset Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

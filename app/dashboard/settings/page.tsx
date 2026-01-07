import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ตั้งค่าระบบ</h1>
        <p className="text-muted-foreground mt-1">จัดการการตั้งค่าโปรไฟล์และระบบ</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">โปรไฟล์</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
          <TabsTrigger value="integrations">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              <CardDescription>อัพเดทข้อมูลส่วนตัวของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">ชื่อ-นามสกุล</Label>
                  <Input id="full_name" defaultValue={profile?.full_name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">รหัสพนักงาน</Label>
                  <Input id="employee_id" defaultValue={profile?.employee_id || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" defaultValue={profile?.phone || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>บทบาท</Label>
                <div>
                  <Badge>{profile?.role || "user"}</Badge>
                </div>
              </div>
              <Button>บันทึกการเปลี่ยนแปลง</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>ความปลอดภัย</CardTitle>
              <CardDescription>จัดการรหัสผ่านและการตั้งค่าความปลอดภัย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">รหัสผ่านปัจจุบัน</Label>
                <Input id="current_password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">รหัสผ่านใหม่</Label>
                <Input id="new_password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">ยืนยันรหัสผ่านใหม่</Label>
                <Input id="confirm_password" type="password" />
              </div>
              <Button>เปลี่ยนรหัสผ่าน</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>ตั้งค่าการแจ้งเตือนที่คุณต้องการรับ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">การตั้งค่าการแจ้งเตือนผ่านอีเมล, Telegram และการแจ้งเตือนในระบบ</p>
              <div className="text-center py-8 text-muted-foreground">กำลังพัฒนา</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration</CardTitle>
              <CardDescription>การเชื่อมต่อกับระบบภายนอก</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Active Directory / LDAP</p>
                    <p className="text-sm text-muted-foreground">เชื่อมต่อกับ AD สำหรับ Single Sign-On</p>
                  </div>
                  <Badge variant="secondary">กำลังพัฒนา</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Email SMTP</p>
                    <p className="text-sm text-muted-foreground">ตั้งค่า SMTP สำหรับส่งอีเมล</p>
                  </div>
                  <Badge variant="secondary">กำลังพัฒนา</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Telegram Bot</p>
                    <p className="text-sm text-muted-foreground">แจ้งเตือนผ่าน Telegram</p>
                  </div>
                  <Badge variant="secondary">กำลังพัฒนา</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

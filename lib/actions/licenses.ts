"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createLicense(formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    license_number: formData.get("license_number") as string,
    software_name: formData.get("software_name") as string,
    vendor: formData.get("vendor") as string,
    license_type: formData.get("license_type") as string,
    total_licenses: Number.parseInt(formData.get("total_licenses") as string),
    used_licenses: 0,
    purchase_date: formData.get("purchase_date") as string,
    expiry_date: formData.get("expiry_date") as string,
    cost: Number.parseFloat(formData.get("cost") as string),
    status: "active",
    description: formData.get("description") as string,
  }

  const { error } = await supabase.from("software_licenses").insert(data)

  if (error) {
    console.error("[v0] Error creating license:", error)
    throw new Error("ไม่สามารถสร้างใบอนุญาตได้")
  }

  revalidatePath("/dashboard/licenses")
  return { success: true }
}

export async function updateLicense(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    software_name: formData.get("software_name") as string,
    vendor: formData.get("vendor") as string,
    license_type: formData.get("license_type") as string,
    total_licenses: Number.parseInt(formData.get("total_licenses") as string),
    purchase_date: formData.get("purchase_date") as string,
    expiry_date: formData.get("expiry_date") as string,
    cost: Number.parseFloat(formData.get("cost") as string),
    description: formData.get("description") as string,
  }

  const { error } = await supabase.from("software_licenses").update(data).eq("id", id)

  if (error) {
    console.error("[v0] Error updating license:", error)
    throw new Error("ไม่สามารถอัปเดตใบอนุญาตได้")
  }

  revalidatePath("/dashboard/licenses")
  return { success: true }
}

export async function deleteLicense(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("software_licenses").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting license:", error)
    throw new Error("ไม่สามารถลบใบอนุญาตได้")
  }

  revalidatePath("/dashboard/licenses")
  return { success: true }
}

export async function assignLicense(licenseId: string, userId: string) {
  const supabase = await createServerClient()

  // เพิ่มจำนวน used_licenses
  const { data: license } = await supabase
    .from("software_licenses")
    .select("used_licenses, total_licenses")
    .eq("id", licenseId)
    .single()

  if (!license) {
    throw new Error("ไม่พบใบอนุญาต")
  }

  if (license.used_licenses >= license.total_licenses) {
    throw new Error("ใบอนุญาตเต็มแล้ว")
  }

  const { error } = await supabase
    .from("software_licenses")
    .update({ used_licenses: license.used_licenses + 1 })
    .eq("id", licenseId)

  if (error) {
    console.error("[v0] Error assigning license:", error)
    throw new Error("ไม่สามารถมอบหมายใบอนุญาตได้")
  }

  revalidatePath("/dashboard/licenses")
  return { success: true }
}

export async function unassignLicense(licenseId: string) {
  const supabase = await createServerClient()

  // ลดจำนวน used_licenses
  const { data: license } = await supabase
    .from("software_licenses")
    .select("used_licenses")
    .eq("id", licenseId)
    .single()

  if (!license || license.used_licenses <= 0) {
    throw new Error("ไม่สามารถยกเลิกการมอบหมายได้")
  }

  const { error } = await supabase
    .from("software_licenses")
    .update({ used_licenses: license.used_licenses - 1 })
    .eq("id", licenseId)

  if (error) {
    console.error("[v0] Error unassigning license:", error)
    throw new Error("ไม่สามารถยกเลิกการมอบหมายใบอนุญาตได้")
  }

  revalidatePath("/dashboard/licenses")
  return { success: true }
}

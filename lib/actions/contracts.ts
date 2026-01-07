"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createContract(formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    contract_number: formData.get("contract_number") as string,
    title: formData.get("title") as string,
    vendor: formData.get("vendor") as string,
    contract_type: formData.get("contract_type") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    amount: Number.parseFloat(formData.get("amount") as string),
    status: "active",
    description: formData.get("description") as string,
    contact_person: formData.get("contact_person") as string,
    contact_email: formData.get("contact_email") as string,
    contact_phone: formData.get("contact_phone") as string,
  }

  const { error } = await supabase.from("contracts").insert(data)

  if (error) {
    console.error("[v0] Error creating contract:", error)
    throw new Error("ไม่สามารถสร้างสัญญาได้")
  }

  revalidatePath("/dashboard/contracts")
  return { success: true }
}

export async function updateContract(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    title: formData.get("title") as string,
    vendor: formData.get("vendor") as string,
    contract_type: formData.get("contract_type") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    amount: Number.parseFloat(formData.get("amount") as string),
    description: formData.get("description") as string,
    contact_person: formData.get("contact_person") as string,
    contact_email: formData.get("contact_email") as string,
    contact_phone: formData.get("contact_phone") as string,
  }

  const { error } = await supabase.from("contracts").update(data).eq("id", id)

  if (error) {
    console.error("[v0] Error updating contract:", error)
    throw new Error("ไม่สามารถอัปเดตสัญญาได้")
  }

  revalidatePath("/dashboard/contracts")
  return { success: true }
}

export async function deleteContract(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting contract:", error)
    throw new Error("ไม่สามารถลบสัญญาได้")
  }

  revalidatePath("/dashboard/contracts")
  return { success: true }
}

export async function renewContract(id: string, newEndDate: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("contracts")
    .update({
      end_date: newEndDate,
      status: "active",
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error renewing contract:", error)
    throw new Error("ไม่สามารถต่ออายุสัญญาได้")
  }

  revalidatePath("/dashboard/contracts")
  return { success: true }
}

export async function updateContractStatus(id: string, status: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("contracts").update({ status }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating contract status:", error)
    throw new Error("ไม่สามารถอัปเดตสถานะสัญญาได้")
  }

  revalidatePath("/dashboard/contracts")
  return { success: true }
}

"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBudget(formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    fiscal_year: Number.parseInt(formData.get("fiscal_year") as string),
    allocated_amount: Number.parseFloat(formData.get("allocated_amount") as string),
    spent_amount: 0,
    department_id: (formData.get("department_id") as string) || null,
  }

  const { error } = await supabase.from("budget_categories").insert(data)

  if (error) {
    console.error("[v0] Error creating budget:", error)
    throw new Error("ไม่สามารถสร้างงบประมาณได้")
  }

  revalidatePath("/dashboard/budget")
  return { success: true }
}

export async function updateBudget(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    allocated_amount: Number.parseFloat(formData.get("allocated_amount") as string),
    department_id: (formData.get("department_id") as string) || null,
  }

  const { error } = await supabase.from("budget_categories").update(data).eq("id", id)

  if (error) {
    console.error("[v0] Error updating budget:", error)
    throw new Error("ไม่สามารถอัปเดตงบประมาณได้")
  }

  revalidatePath("/dashboard/budget")
  return { success: true }
}

export async function deleteBudget(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("budget_categories").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting budget:", error)
    throw new Error("ไม่สามารถลบงบประมาณได้")
  }

  revalidatePath("/dashboard/budget")
  return { success: true }
}

export async function recordExpense(budgetId: string, amount: number, description: string) {
  const supabase = await createServerClient()

  // ดึงข้อมูลงบประมาณปัจจุบัน
  const { data: budget } = await supabase
    .from("budget_categories")
    .select("spent_amount, allocated_amount")
    .eq("id", budgetId)
    .single()

  if (!budget) {
    throw new Error("ไม่พบงบประมาณ")
  }

  const newSpentAmount = budget.spent_amount + amount

  if (newSpentAmount > budget.allocated_amount) {
    throw new Error("ยอดใช้จ่ายเกินงบประมาณที่ตั้งไว้")
  }

  // อัปเดตยอดใช้จ่าย
  const { error } = await supabase.from("budget_categories").update({ spent_amount: newSpentAmount }).eq("id", budgetId)

  if (error) {
    console.error("[v0] Error recording expense:", error)
    throw new Error("ไม่สามารถบันทึกรายจ่ายได้")
  }

  revalidatePath("/dashboard/budget")
  return { success: true }
}

export async function adjustBudget(id: string, newAllocatedAmount: number) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("budget_categories")
    .update({ allocated_amount: newAllocatedAmount })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error adjusting budget:", error)
    throw new Error("ไม่สามารถปรับงบประมาณได้")
  }

  revalidatePath("/dashboard/budget")
  return { success: true }
}

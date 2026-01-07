"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPMSchedule(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("pm_schedules").insert([data])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/pm")
  return { success: true }
}

export async function updatePMStatus(scheduleId: string, status: string) {
  const supabase = await createClient()

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "completed") {
    updateData.last_maintenance_date = new Date().toISOString()
  }

  const { error } = await supabase.from("pm_schedules").update(updateData).eq("id", scheduleId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/pm")
  return { success: true }
}

export async function completePM(scheduleId: string, performedBy: string, notes?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("pm_schedules")
    .update({
      status: "completed",
      last_maintenance_date: new Date().toISOString(),
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", scheduleId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/pm")
  return { success: true }
}

export async function deletePMSchedule(scheduleId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("pm_schedules").delete().eq("id", scheduleId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/pm")
  return { success: true }
}

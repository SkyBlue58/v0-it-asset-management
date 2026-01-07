"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTraining(formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    trainer: formData.get("trainer") as string,
    training_type: formData.get("training_type") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    location: formData.get("location") as string,
    max_participants: Number.parseInt(formData.get("max_participants") as string),
    current_participants: 0,
    status: "planned",
    cost: Number.parseFloat((formData.get("cost") as string) || "0"),
  }

  const { error } = await supabase.from("training").insert(data)

  if (error) {
    console.error("[v0] Error creating training:", error)
    throw new Error("ไม่สามารถสร้างการฝึกอบรมได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

export async function updateTraining(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    trainer: formData.get("trainer") as string,
    training_type: formData.get("training_type") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    location: formData.get("location") as string,
    max_participants: Number.parseInt(formData.get("max_participants") as string),
    cost: Number.parseFloat((formData.get("cost") as string) || "0"),
  }

  const { error } = await supabase.from("training").update(data).eq("id", id)

  if (error) {
    console.error("[v0] Error updating training:", error)
    throw new Error("ไม่สามารถอัปเดตการฝึกอบรมได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

export async function deleteTraining(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("training").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting training:", error)
    throw new Error("ไม่สามารถลบการฝึกอบรมได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

export async function registerForTraining(trainingId: string, userId: string) {
  const supabase = await createServerClient()

  // ตรวจสอบจำนวนผู้เข้าร่วม
  const { data: training } = await supabase
    .from("training")
    .select("current_participants, max_participants")
    .eq("id", trainingId)
    .single()

  if (!training) {
    throw new Error("ไม่พบการฝึกอบรม")
  }

  if (training.current_participants >= training.max_participants) {
    throw new Error("การฝึกอบรมเต็มแล้ว")
  }

  // เพิ่มจำนวนผู้เข้าร่วม
  const { error } = await supabase
    .from("training")
    .update({ current_participants: training.current_participants + 1 })
    .eq("id", trainingId)

  if (error) {
    console.error("[v0] Error registering for training:", error)
    throw new Error("ไม่สามารถลงทะเบียนได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

export async function cancelRegistration(trainingId: string, userId: string) {
  const supabase = await createServerClient()

  // ลดจำนวนผู้เข้าร่วม
  const { data: training } = await supabase
    .from("training")
    .select("current_participants")
    .eq("id", trainingId)
    .single()

  if (!training || training.current_participants <= 0) {
    throw new Error("ไม่สามารถยกเลิกการลงทะเบียนได้")
  }

  const { error } = await supabase
    .from("training")
    .update({ current_participants: training.current_participants - 1 })
    .eq("id", trainingId)

  if (error) {
    console.error("[v0] Error canceling registration:", error)
    throw new Error("ไม่สามารถยกเลิกการลงทะเบียนได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

export async function updateTrainingStatus(id: string, status: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("training").update({ status }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating training status:", error)
    throw new Error("ไม่สามารถอัปเดตสถานะได้")
  }

  revalidatePath("/dashboard/training")
  return { success: true }
}

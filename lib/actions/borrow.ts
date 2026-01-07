"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBorrowRequest(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("borrow_requests").insert([{ ...data, status: "pending" }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/borrow")
  return { success: true }
}

export async function approveBorrowRequest(requestId: string, approverId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("borrow_requests")
    .update({
      status: "approved",
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", requestId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/borrow")
  return { success: true }
}

export async function rejectBorrowRequest(requestId: string, approverId: string, reason?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("borrow_requests")
    .update({
      status: "rejected",
      approved_by: approverId,
      approved_at: new Date().toISOString(),
      notes: reason,
    })
    .eq("id", requestId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/borrow")
  return { success: true }
}

export async function returnBorrowRequest(requestId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("borrow_requests")
    .update({
      status: "returned",
      actual_return_date: new Date().toISOString(),
    })
    .eq("id", requestId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/borrow")
  return { success: true }
}

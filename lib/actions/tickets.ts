"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/tickets")
  revalidatePath(`/dashboard/tickets/${ticketId}`)
  return { success: true }
}

export async function assignTicket(ticketId: string, technicianId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tickets")
    .update({
      assigned_to: technicianId,
      status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/tickets")
  revalidatePath(`/dashboard/tickets/${ticketId}`)
  return { success: true }
}

export async function addTicketComment(ticketId: string, userId: string, comment: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("ticket_comments").insert({
    ticket_id: ticketId,
    user_id: userId,
    comment,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/tickets/${ticketId}`)
  return { success: true }
}

export async function deleteTicket(ticketId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tickets").delete().eq("id", ticketId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/tickets")
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTonerModel(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("toner_models").insert([data])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/toner")
  return { success: true }
}

export async function updateTonerStock(modelId: string, quantity: number, type: "in" | "out" | "return" | "adjust") {
  const supabase = await createClient()

  // Get current stock
  const { data: model } = await supabase.from("toner_models").select("stock_quantity").eq("id", modelId).single()

  if (!model) {
    throw new Error("Toner model not found")
  }

  let newQuantity = model.stock_quantity
  if (type === "in" || type === "return") {
    newQuantity += quantity
  } else if (type === "out") {
    newQuantity -= quantity
  } else if (type === "adjust") {
    newQuantity = quantity
  }

  // Update stock
  const { error: updateError } = await supabase
    .from("toner_models")
    .update({ stock_quantity: newQuantity })
    .eq("id", modelId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Create transaction record
  const { error: transactionError } = await supabase.from("toner_transactions").insert({
    toner_model_id: modelId,
    transaction_type: type,
    quantity,
    user_id: user?.id,
  })

  if (transactionError) {
    throw new Error(transactionError.message)
  }

  revalidatePath("/dashboard/toner")
  revalidatePath("/dashboard/toner/transactions")
  return { success: true }
}

export async function deleteTonerModel(modelId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("toner_models").delete().eq("id", modelId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/toner")
  return { success: true }
}

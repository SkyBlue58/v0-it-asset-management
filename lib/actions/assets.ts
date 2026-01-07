"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAsset(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("assets").insert([data])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/assets")
  return { success: true }
}

export async function updateAsset(assetId: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("assets")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", assetId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/assets")
  revalidatePath(`/dashboard/assets/${assetId}`)
  return { success: true }
}

export async function updateAssetStatus(assetId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("assets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", assetId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/assets")
  return { success: true }
}

export async function deleteAsset(assetId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("assets").delete().eq("id", assetId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/assets")
  return { success: true }
}

export async function assignAsset(assetId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("assets")
    .update({
      assigned_to: userId,
      status: "in_use",
      updated_at: new Date().toISOString(),
    })
    .eq("id", assetId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/assets")
  return { success: true }
}

"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createKBArticle(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("กรุณาเข้าสู่ระบบ")
  }

  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()),
    status: "draft",
    author_id: user.id,
    views: 0,
  }

  const { error } = await supabase.from("knowledge_base").insert(data)

  if (error) {
    console.error("[v0] Error creating KB article:", error)
    throw new Error("ไม่สามารถสร้างบทความได้")
  }

  revalidatePath("/dashboard/kb")
  return { success: true }
}

export async function updateKBArticle(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()),
  }

  const { error } = await supabase.from("knowledge_base").update(data).eq("id", id)

  if (error) {
    console.error("[v0] Error updating KB article:", error)
    throw new Error("ไม่สามารถอัปเดตบทความได้")
  }

  revalidatePath("/dashboard/kb")
  return { success: true }
}

export async function deleteKBArticle(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("knowledge_base").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting KB article:", error)
    throw new Error("ไม่สามารถลบบทความได้")
  }

  revalidatePath("/dashboard/kb")
  return { success: true }
}

export async function publishKBArticle(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("knowledge_base").update({ status: "published" }).eq("id", id)

  if (error) {
    console.error("[v0] Error publishing KB article:", error)
    throw new Error("ไม่สามารถเผยแพร่บทความได้")
  }

  revalidatePath("/dashboard/kb")
  return { success: true }
}

export async function unpublishKBArticle(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("knowledge_base").update({ status: "draft" }).eq("id", id)

  if (error) {
    console.error("[v0] Error unpublishing KB article:", error)
    throw new Error("ไม่สามารถยกเลิกการเผยแพร่บทความได้")
  }

  revalidatePath("/dashboard/kb")
  return { success: true }
}

export async function incrementKBViews(id: string) {
  const supabase = await createServerClient()

  // ดึงจำนวน views ปัจจุบัน
  const { data: article } = await supabase.from("knowledge_base").select("views").eq("id", id).single()

  if (!article) {
    return { success: false }
  }

  // เพิ่มจำนวน views
  const { error } = await supabase
    .from("knowledge_base")
    .update({ views: article.views + 1 })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error incrementing views:", error)
    return { success: false }
  }

  return { success: true }
}

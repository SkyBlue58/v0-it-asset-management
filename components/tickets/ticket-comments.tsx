"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { Loader2, Send } from "lucide-react"

interface Comment {
  id: string
  comment: string
  is_internal: boolean
  created_at: string
  user?: {
    first_name: string
    last_name: string
    role: string
  }
}

interface TicketCommentsProps {
  ticketId: string
  comments: Comment[]
  userId: string
}

export function TicketComments({ ticketId, comments, userId }: TicketCommentsProps) {
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("ticket_comments").insert([
        {
          ticket_id: ticketId,
          user_id: userId,
          comment: newComment.trim(),
          is_internal: false,
        },
      ])

      if (error) throw error

      setNewComment("")
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">ยังไม่มีความคิดเห็น</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {comment.user?.first_name[0]}
                    {comment.user?.last_name[0]}
                  </div>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.user?.first_name} {comment.user?.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "dd MMM yyyy HH:mm", { locale: th })}
                    </span>
                    {comment.user?.role && (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{comment.user.role}</span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{comment.comment}</p>
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="เพิ่มความคิดเห็น..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              ส่งความคิดเห็น
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

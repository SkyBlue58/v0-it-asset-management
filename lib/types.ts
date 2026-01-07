export type UserRole = "admin" | "technician" | "user" | "manager"

export interface User {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  department?: string
  position?: string
  email: string
  phone?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string
  category?: string
  priority_id?: string
  status: "open" | "in_progress" | "pending" | "resolved" | "closed" | "cancelled"
  requester_id: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  asset_code: string
  name: string
  category_id?: string
  serial_number?: string
  model?: string
  manufacturer?: string
  status: "available" | "in_use" | "maintenance" | "retired" | "lost"
  condition: "excellent" | "good" | "fair" | "poor"
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

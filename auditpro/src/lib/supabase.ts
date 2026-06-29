import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'auditor' | 'client' | 'admin'

export type Profile = {
  id: string
  role: UserRole
  status: string
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  company_name?: string
  job_title?: string
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  profile_id?: string
  company_name: string
  trade_name?: string
  tin_number?: string
  industry: string
  status: string
  fiscal_year_end?: string
  address?: string
  city?: string
  country: string
  primary_contact_name?: string
  primary_contact_email?: string
  primary_contact_phone?: string
  notes?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export type Engagement = {
  id: string
  client_id: string
  title: string
  type: string
  status: string
  period_start?: string
  period_end?: string
  planned_start?: string
  planned_end?: string
  fee_amount?: number
  fee_currency: string
  billable_hours: number
  budgeted_hours?: number
  description?: string
  assigned_to?: string
  created_at: string
  updated_at: string
  client?: Client
}

export type Invoice = {
  id: string
  engagement_id?: string
  client_id: string
  invoice_number: string
  status: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  issue_date: string
  due_date?: string
  paid_date?: string
  notes?: string
  created_at: string
  updated_at: string
  client?: Client
}

export type Document = {
  id: string
  engagement_id?: string
  client_id?: string
  uploaded_by?: string
  name: string
  file_path: string
  file_size?: number
  file_type?: string
  document_type: string
  status: string
  version: number
  is_confidential: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  engagement_id?: string
  client_id?: string
  sender_id: string
  content: string
  is_read: boolean
  read_at?: string
  parent_id?: string
  created_at: string
  sender?: Profile
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message?: string
  link?: string
  is_read: boolean
  created_at: string
}

export type TimeEntry = {
  id: string
  engagement_id: string
  logged_by?: string
  description?: string
  hours: number
  date: string
  is_billable: boolean
  hourly_rate?: number
  created_at: string
}

export type PBCRequest = {
  id: string
  engagement_id: string
  title: string
  description?: string
  due_date?: string
  is_completed: boolean
  document_id?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  status: string
  tags?: string[]
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fwwrlcrplokatrkwwqqb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type UserRole = 'auditor' | 'client' | 'admin'

export type Profile = {
  id: string
  role: UserRole
  status: string
  full_name: string
  email: string
  phone?: string | null
  avatar_url?: string | null
  company_name?: string | null
  job_title?: string | null
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  profile_id?: string | null
  company_name: string
  trade_name?: string | null
  tin_number?: string | null
  registration_number?: string | null
  industry: string
  status: string
  fiscal_year_end?: string | null
  address?: string | null
  city?: string | null
  country: string
  website?: string | null
  primary_contact_name?: string | null
  primary_contact_email?: string | null
  primary_contact_phone?: string | null
  notes?: string | null
  tags?: string[] | null
  created_by?: string | null
  created_at: string
  updated_at: string
}

export type Engagement = {
  id: string
  client_id: string
  title: string
  type: string
  status: string
  period_start?: string | null
  period_end?: string | null
  planned_start?: string | null
  planned_end?: string | null
  actual_start?: string | null
  actual_end?: string | null
  fee_amount?: number | null
  fee_currency: string
  billable_hours: number
  budgeted_hours?: number | null
  progress: number
  description?: string | null
  scope?: string | null
  assigned_to?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
  client?: Client
}

export type Milestone = {
  id: string
  engagement_id: string
  title: string
  description?: string | null
  due_date?: string | null
  completed_at?: string | null
  is_completed: boolean
  sort_order: number
  created_at: string
}

export type DocumentRow = {
  id: string
  engagement_id?: string | null
  client_id?: string | null
  uploaded_by?: string | null
  name: string
  description?: string | null
  file_path: string
  file_size?: number | null
  file_type?: string | null
  document_type: string
  status: string
  version: number
  is_confidential: boolean
  notes?: string | null
  created_at: string
  updated_at: string
}

export type PBCRequest = {
  id: string
  engagement_id: string
  title: string
  description?: string | null
  due_date?: string | null
  is_completed: boolean
  completed_at?: string | null
  document_id?: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  engagement_id?: string | null
  client_id?: string | null
  sender_id?: string | null
  sender_name?: string | null
  sender_role?: string | null
  content: string
  is_read: boolean
  read_at?: string | null
  parent_id?: string | null
  created_at: string
}

export type Invoice = {
  id: string
  engagement_id?: string | null
  client_id: string
  invoice_number: string
  status: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  issue_date: string
  due_date?: string | null
  paid_date?: string | null
  payment_method?: string | null
  notes?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
  client?: Client
  engagement?: Engagement
}

export type InvoiceItem = {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  sort_order: number
}

export type TimeEntry = {
  id: string
  engagement_id?: string | null
  logged_by?: string | null
  description?: string | null
  hours: number
  date: string
  is_billable: boolean
  hourly_rate?: number | null
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message?: string | null
  link?: string | null
  is_read: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  cover_image?: string | null
  status: string
  tags?: string[] | null
  author_id?: string | null
  author_name?: string | null
  published_at?: string | null
  created_at: string
  updated_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service_interest?: string | null
  message: string
  is_read: boolean
  created_at: string
}

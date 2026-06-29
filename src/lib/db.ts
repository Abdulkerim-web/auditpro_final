'use client'
import { supabase } from './supabase'
import type {
  Client, Engagement, Milestone, DocumentRow, PBCRequest, Message,
  Invoice, InvoiceItem, TimeEntry, Notification, BlogPost, Profile,
} from './supabase'

// =============================================
// CLIENTS
// =============================================
export async function fetchClients(search = '', status = 'all'): Promise<Client[]> {
  let query = supabase.from('clients').select('*').order('created_at', { ascending: false })
  if (status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  let rows = data as Client[]
  if (search) {
    const s = search.toLowerCase()
    rows = rows.filter(c =>
      c.company_name.toLowerCase().includes(s) ||
      (c.primary_contact_name || '').toLowerCase().includes(s) ||
      (c.city || '').toLowerCase().includes(s)
    )
  }
  return rows
}

export async function fetchClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Client | null
}

// =============================================
// ENGAGEMENTS
// =============================================
export async function fetchEngagements(filters: { clientId?: string; status?: string; search?: string } = {}): Promise<Engagement[]> {
  let query = supabase.from('engagements').select('*, client:clients(*)').order('created_at', { ascending: false })
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  let rows = (data as Engagement[]) || []
  if (filters.search) {
    const s = filters.search.toLowerCase()
    rows = rows.filter(e =>
      e.title.toLowerCase().includes(s) ||
      (e.client?.company_name || '').toLowerCase().includes(s)
    )
  }
  return rows
}

export async function fetchEngagement(id: string): Promise<Engagement | null> {
  const { data, error } = await supabase
    .from('engagements')
    .select('*, client:clients(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Engagement | null
}

export async function fetchMilestones(engagementId: string): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as Milestone[]) || []
}

// =============================================
// DOCUMENTS
// =============================================
export async function fetchDocuments(filters: { clientId?: string; engagementId?: string } = {}): Promise<DocumentRow[]> {
  let query = supabase.from('documents').select('*').order('created_at', { ascending: false })
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  if (filters.engagementId) query = query.eq('engagement_id', filters.engagementId)
  const { data, error } = await query
  if (error) throw error
  return (data as DocumentRow[]) || []
}

// =============================================
// PBC REQUESTS
// =============================================
export async function fetchPBCRequests(engagementId: string): Promise<PBCRequest[]> {
  const { data, error } = await supabase
    .from('pbc_requests')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as PBCRequest[]) || []
}

export async function togglePBCRequest(id: string, isCompleted: boolean): Promise<void> {
  const { error } = await supabase
    .from('pbc_requests')
    .update({ is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) throw error
}

// =============================================
// MESSAGES
// =============================================
export async function fetchMessages(clientId?: string): Promise<Message[]> {
  let query = supabase.from('messages').select('*').order('created_at', { ascending: true })
  if (clientId) query = query.eq('client_id', clientId)
  const { data, error } = await query
  if (error) throw error
  return (data as Message[]) || []
}

export async function fetchMessagesByEngagement(engagementId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as Message[]) || []
}

export async function sendMessage(payload: {
  engagement_id?: string
  client_id?: string
  sender_id?: string
  sender_name: string
  sender_role: string
  content: string
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      engagement_id: payload.engagement_id,
      client_id: payload.client_id,
      sender_id: payload.sender_id,
      sender_name: payload.sender_name,
      sender_role: payload.sender_role,
      content: payload.content,
      is_read: false,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Message
}

// =============================================
// INVOICES
// =============================================
export async function fetchInvoices(filters: { status?: string; clientId?: string } = {}): Promise<Invoice[]> {
  let query = supabase
    .from('invoices')
    .select('*, client:clients(*), engagement:engagements(*)')
    .order('created_at', { ascending: false })
  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  const { data, error } = await query
  if (error) throw error
  return (data as Invoice[]) || []
}

export async function fetchInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as InvoiceItem[]) || []
}

// =============================================
// TIME ENTRIES
// =============================================
export async function fetchTimeEntries(engagementId?: string): Promise<TimeEntry[]> {
  let query = supabase.from('time_entries').select('*').order('date', { ascending: false })
  if (engagementId) query = query.eq('engagement_id', engagementId)
  const { data, error } = await query
  if (error) throw error
  return (data as TimeEntry[]) || []
}

// =============================================
// NOTIFICATIONS
// =============================================
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Notification[]) || []
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
}

// =============================================
// BLOG POSTS
// =============================================
export async function fetchBlogPosts(tag?: string): Promise<BlogPost[]> {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (tag && tag !== 'All') query = query.contains('tags', [tag])
  const { data, error } = await query
  if (error) throw error
  return (data as BlogPost[]) || []
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw error
  return data as BlogPost | null
}

// =============================================
// PROFILE
// =============================================
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as Profile | null
}

// =============================================
// CLIENT'S OWN RECORD (for client portal)
// =============================================
export async function fetchClientByProfileId(profileId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle()
  if (error) throw error
  return data as Client | null
}

// =============================================
// CONTACT SUBMISSIONS
// =============================================
export async function submitContactForm(payload: {
  name: string
  email: string
  phone?: string
  company?: string
  service_interest?: string
  message: string
}): Promise<void> {
  const { error } = await supabase.from('contact_submissions').insert({
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    company: payload.company || null,
    service_interest: payload.service_interest || null,
    message: payload.message,
    is_read: false,
  })
  if (error) throw error
}

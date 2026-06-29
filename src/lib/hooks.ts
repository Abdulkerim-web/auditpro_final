// Shared React hooks for data access
'use client'
import { useState, useEffect } from 'react'
import { CLIENTS, ENGAGEMENTS, INVOICES, DOCUMENTS, MESSAGES, TIME_ENTRIES, REPORTS, NOTIFICATIONS, PBC_REQUESTS, BLOG_POSTS } from './data'

export function useClients(search = '', status = 'all') {
  return CLIENTS.filter(c => {
    const s = search.toLowerCase()
    const matchSearch = !s || c.company_name.toLowerCase().includes(s) || c.primary_contact_name.toLowerCase().includes(s) || c.city.toLowerCase().includes(s)
    const matchStatus = status === 'all' || c.status === status
    return matchSearch && matchStatus
  })
}

export function useClient(id: string) {
  return CLIENTS.find(c => c.id === id) || null
}

export function useEngagements(filters: { clientId?: string; status?: string; search?: string } = {}) {
  return ENGAGEMENTS.filter(e => {
    if (filters.clientId && e.client_id !== filters.clientId) return false
    if (filters.status && filters.status !== 'all' && e.status !== filters.status) return false
    if (filters.search) {
      const s = filters.search.toLowerCase()
      const client = CLIENTS.find(c => c.id === e.client_id)
      if (!e.title.toLowerCase().includes(s) && !client?.company_name.toLowerCase().includes(s)) return false
    }
    return true
  }).map(e => ({ ...e, client: CLIENTS.find(c => c.id === e.client_id) }))
}

export function useEngagement(id: string) {
  const eng = ENGAGEMENTS.find(e => e.id === id)
  if (!eng) return null
  return { ...eng, client: CLIENTS.find(c => c.id === eng.client_id) }
}

export function useInvoices(status = 'all', clientId?: string) {
  return INVOICES.filter(i => {
    if (status !== 'all' && i.status !== status) return false
    if (clientId && i.client_id !== clientId) return false
    return true
  }).map(i => ({ ...i, client: CLIENTS.find(c => c.id === i.client_id), engagement: ENGAGEMENTS.find(e => e.id === i.engagement_id) }))
}

export function useDocuments(clientId?: string, engagementId?: string) {
  return DOCUMENTS.filter(d => {
    if (clientId && d.client_id !== clientId) return false
    if (engagementId && d.engagement_id !== engagementId) return false
    return true
  })
}

export function useMessages(clientId?: string) {
  const threads: Record<string, typeof MESSAGES> = {}
  const filtered = clientId ? MESSAGES.filter(m => m.client_id === clientId) : MESSAGES
  filtered.forEach(m => {
    if (!threads[m.thread_id]) threads[m.thread_id] = []
    threads[m.thread_id].push(m)
  })
  return Object.entries(threads).map(([threadId, msgs]) => {
    const last = msgs[msgs.length - 1]
    const client = CLIENTS.find(c => c.id === msgs[0].client_id)
    const engagement = ENGAGEMENTS.find(e => e.id === msgs[0].engagement_id)
    return { threadId, client, engagement, messages: msgs, lastMessage: last, unreadCount: msgs.filter(m => !m.read && m.sender_role === 'client').length }
  })
}

export function useTimeEntries(engagementId?: string) {
  return TIME_ENTRIES.filter(t => !engagementId || t.engagement_id === engagementId)
    .map(t => ({ ...t, engagement: ENGAGEMENTS.find(e => e.id === t.engagement_id), client: CLIENTS.find(c => c.id === ENGAGEMENTS.find(e => e.id === t.engagement_id)?.client_id) }))
}

export function useReports() { return REPORTS.map(r => ({ ...r, client: CLIENTS.find(c => c.id === r.client_id), engagement: ENGAGEMENTS.find(e => e.id === r.engagement_id) })) }

export function useNotifications() { return NOTIFICATIONS }

export function usePBCRequests(engagementId: string) { return PBC_REQUESTS.filter(p => p.engagement_id === engagementId) }

export function useBlogPosts(tag?: string) { return tag ? BLOG_POSTS.filter(p => p.tag === tag) : BLOG_POSTS }

export function useBlogPost(slug: string) { return BLOG_POSTS.find(p => p.slug === slug) || null }

export function useDashboardStats() {
  const activeClients = CLIENTS.filter(c => c.status === 'active').length
  const openEngagements = ENGAGEMENTS.filter(e => e.status !== 'completed' && e.status !== 'cancelled').length
  const revenueYTD = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)
  const billableHours = TIME_ENTRIES.filter(t => t.is_billable).reduce((s, t) => s + t.hours, 0)
  const overdueInvoices = INVOICES.filter(i => i.status === 'overdue').length
  const unreadMessages = MESSAGES.filter(m => !m.read && m.sender_role === 'client').length
  return { activeClients, openEngagements, revenueYTD, billableHours, overdueInvoices, unreadMessages }
}

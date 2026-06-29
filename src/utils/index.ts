import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatCurrency(amount: number, currency = 'ETB') {
  return `ETB ${amount.toLocaleString('en-ET', { minimumFractionDigits: 0 })}`
}

export function formatDate(date: string | Date | undefined | null, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', opts || { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date(); const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function formatFileSize(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  planning: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  fieldwork: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  review: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  reporting: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  on_hold: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
  draft: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  sent: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  overdue: 'bg-red-50 text-red-700 ring-red-600/20',
  uploaded: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  reviewed: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rejected: 'bg-red-50 text-red-700 ring-red-600/20',
  prospect: 'bg-purple-50 text-purple-700 ring-purple-600/20',
}

export const ENGAGEMENT_TYPE_LABELS: Record<string, string> = {
  statutory_audit: 'Statutory Audit', internal_audit: 'Internal Audit',
  tax_audit: 'Tax Audit', forensic_audit: 'Forensic Audit',
  compliance_review: 'Compliance Review', agreed_upon_procedures: 'AUP',
  compilation: 'Compilation', review: 'Review',
}

export const INDUSTRY_LABELS: Record<string, string> = {
  manufacturing: 'Manufacturing', retail: 'Retail',
  financial_services: 'Financial Services', healthcare: 'Healthcare',
  technology: 'Technology', real_estate: 'Real Estate',
  hospitality: 'Hospitality', ngo: 'NGO / Non-profit',
  government: 'Government', other: 'Other',
}

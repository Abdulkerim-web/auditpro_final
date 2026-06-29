'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit3, Eye, Trash2, Tag, Calendar } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { BLOG_POSTS } from '@/lib/data'
import { cn, STATUS_COLORS, formatDate } from '@/utils'

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState(BLOG_POSTS.map(p => ({ ...p, status: 'published' as string })))
  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Blog / Insights" subtitle="Manage your public articles and insights"
        action={{ label: 'New Article', onClick: () => {} }} />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="card float-card p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}><Tag size={9} />{post.tag}</span>
                <span className="badge ring-1 bg-emerald-50 text-emerald-700 ring-emerald-600/20">published</span>
              </div>
              <h3 className="font-bold text-sm leading-snug mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
              <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{formatDate(post.date)}</span>
                <div className="flex gap-1">
                  <Link href={`/blog/${post.slug}`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye size={13} style={{ color: 'var(--text-muted)' }} /></Link>
                  <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"><Edit3 size={13} className="text-blue-500" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

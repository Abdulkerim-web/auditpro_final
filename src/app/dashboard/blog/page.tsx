'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard as Edit3, Eye, Trash2, Tag, Calendar } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, formatDate } from '@/utils'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

export default function DashboardBlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (mounted) setPosts((data as BlogPost[]) || [])
      } catch (err) {
        console.error('Blog posts load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Blog / Insights" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Blog / Insights" subtitle="Manage your public articles and insights"
        action={{ label: 'New Article', onClick: () => {} }} />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No articles yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Create your first blog post to share insights with clients.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} className="card float-card p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  {(post.tags || []).map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}><Tag size={9} />{tag}</span>
                  ))}
                  <span className={cn('badge ring-1',
                    post.status === 'published' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-gray-100 text-gray-600 ring-gray-500/20')}>
                    {post.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-snug mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{formatDate(post.published_at || post.created_at)}</span>
                  <div className="flex gap-1">
                    <Link href={`/blog/${post.slug}`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye size={13} style={{ color: 'var(--text-muted)' }} /></Link>
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"><Edit3 size={13} className="text-blue-500" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

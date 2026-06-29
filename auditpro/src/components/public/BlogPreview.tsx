'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { fetchBlogPosts } from '@/lib/db'
import type { BlogPost } from '@/lib/supabase'

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const p = await fetchBlogPosts()
        if (mounted) setPosts(p.slice(0, 3))
      } catch (err) {
        console.error('Blog preview load failed:', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (posts.length === 0) return null

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border" style={{ background: 'var(--brand-50)', borderColor: 'var(--brand-100)', color: 'var(--brand-600)' }}>Insights</span>
            <h2 className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Latest from Beyan Omer</h2>
          </div>
          <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all" style={{ color: 'var(--brand-600)' }}>All articles <ArrowRight size={16} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover p-6 flex flex-col group">
              <div className="flex items-center gap-2 mb-4">
                {(post.tags || []).map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}><Tag size={9} />{tag}</span>
                ))}
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <h3 className="font-bold text-sm mb-3 leading-snug group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
              <div className="flex items-center gap-1 mt-5 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: 'var(--brand-600)' }}>Read more <ArrowRight size={12} /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

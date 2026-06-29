'use client'
import { useState, useEffect } from 'react'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { fetchBlogPost, fetchBlogPosts } from '@/lib/db'
import type { BlogPost } from '@/lib/supabase'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const p = await fetchBlogPost(params.slug)
        if (!mounted) return
        setPost(p)
        if (p) {
          const all = await fetchBlogPosts()
          if (mounted) {
            const r = all.filter(x => x.slug !== p.slug && (x.tags || []).some(t => (p.tags || []).includes(t))).slice(0, 2)
            setRelated(r)
          }
        }
      } catch (err) {
        console.error('Blog post load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [params.slug])

  if (loading) {
    return (
      <>
        <PublicNav />
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </main>
        <PublicFooter />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <PublicNav />
        <main className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Article not found</h1>
          <Link href="/blog" className="text-sm" style={{ color: 'var(--brand-600)' }}>Back to Insights</Link>
        </main>
        <PublicFooter />
      </>
    )
  }

  return (
    <>
      <PublicNav />
      <main>
        <section className="pt-32 pb-16 gradient-brand">
          <div className="max-w-3xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <ArrowLeft size={14} /> Back to Insights
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {(post.tags || []).map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}><Tag size={10} />{tag}</span>
              ))}
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}><Calendar size={11} />{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>{post.title}</h1>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-8 h-8 rounded-full gradient-brand border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold">BO</div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>By {post.author_name || 'Beyan Omer'}</span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="card p-8 mb-10">
              <div className="prose prose-gray max-w-none">
                {(post.content || '').split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>{para.replace('## ', '')}</h2>
                  return <p key={i} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{para}</p>
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-2xl" style={{ background: 'var(--brand-50)', border: '1px solid var(--brand-100)' }}>
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white text-xl font-bold flex-shrink-0">BO</div>
              <div>
                <div className="font-bold" style={{ color: 'var(--text-primary)' }}>Beyan Omer, CPA</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lead Auditor · ICPAE Member · 15+ years experience in Ethiopian audit & assurance</div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Related Articles</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map(r => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="card card-hover p-5 group">
                      <div className="text-xs mb-2 font-medium" style={{ color: 'var(--brand-600)' }}>{(r.tags || []).join(', ')}</div>
                      <h4 className="font-bold text-sm mb-2 group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>{r.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}

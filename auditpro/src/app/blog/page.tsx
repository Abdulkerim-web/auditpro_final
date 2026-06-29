import PublicNav from '@/components/public/PublicNav'
import AIChatbot from '@/components/AIChatbot'
import PublicFooter from '@/components/public/PublicFooter'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/data'

export const metadata = { title: 'Insights' }
const tags = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.tag)))]

export default function BlogPage() {
  return (
    <>
      <PublicNav />
      <main>
        <section className="pt-32 pb-16 gradient-brand">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>Insights</span>
            <h1 className="text-5xl font-extrabold text-white mb-5" style={{ letterSpacing: '-0.02em' }}>Audit & Finance Insights</h1>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.78)' }}>IFRS updates, tax changes, governance best practices — written for Ethiopian business leaders.</p>
          </div>
        </section>
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 mb-10">
              {tags.map(t => (
                <Link key={t} href={t === 'All' ? '/blog' : `/blog?tag=${t}`}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t}</Link>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {BLOG_POSTS.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover p-6 flex flex-col group">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}><Tag size={9} />{post.tag}</span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Clock size={10} />{post.read_time} min read</span>
                  </div>
                  <h2 className="font-bold text-base mb-3 leading-snug group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>{post.title}</h2>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>By {post.author}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: 'var(--brand-600)' }}>Read more <ArrowRight size={11} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <AIChatbot />
    </>
  )
}

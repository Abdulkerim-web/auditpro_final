import Link from 'next/link'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/data'

export default function BlogPreview() {
  const posts = BLOG_POSTS.slice(0, 3)
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
                <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}><Tag size={9} />{post.tag}</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
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

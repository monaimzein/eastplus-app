import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getServerLocale } from '@/lib/i18n/server'

export const metadata: Metadata = {
  title: 'المدونة | EAST PLUS — مقالات في البناء، السباكة، الكهرباء، العزل',
  description:
    'مقالات تقنية ودلائل متخصصة من EAST PLUS حول مواد البناء والسباكة والكهرباء والعزل في المملكة العربية السعودية. خبرة عملية ومعايير الجودة لاختيار المنتج المناسب لمشروعك.',
  alternates: {
    canonical: 'https://eastplus.sa/blog',
  },
  openGraph: {
    title: 'EAST PLUS Blog — Construction, Plumbing, Electrical, Insulation',
    description:
      'In-depth technical guides on building materials, plumbing, electrical and insulation tailored to the Saudi market.',
    type: 'website',
  },
}

const CATS_AR = [
  { slug: 'all', label: 'الكل' },
  { slug: 'مواد البناء', label: 'مواد البناء' },
  { slug: 'السباكة', label: 'السباكة' },
  { slug: 'الكهرباء', label: 'الكهرباء' },
  { slug: 'العزل', label: 'العزل' },
  { slug: 'الصيانة', label: 'الصيانة' },
]

const CATS_EN: Record<string, string> = {
  'all': 'All',
  'مواد البناء': 'Building Materials',
  'السباكة': 'Plumbing',
  'الكهرباء': 'Electrical',
  'العزل': 'Insulation',
  'الصيانة': 'Maintenance',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const locale = await getServerLocale()
  const isEN = locale === 'en'
  const supabase = await createClient()
  const activeCategory = params.category || 'all'

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory)
  }

  const { data: posts } = await query
  const Arrow = isEN ? ArrowRight : ArrowLeft

  return (
    <SiteShell>
      <PageHero
        eyebrow={isEN ? 'Blog' : 'المدونة'}
        title={isEN ? 'Insights & Guides' : 'مقالات وأدلة متخصصة'}
        subtitle={
          isEN
            ? 'Practical, in-depth content on construction materials, plumbing, electrical, insulation, and maintenance — built for the Saudi market.'
            : 'محتوى عملي متعمّق حول مواد البناء، السباكة، الكهرباء، العزل والصيانة — مُعَدّ خصيصاً للسوق السعودي.'
        }
      />

      <section className="section-tight">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATS_AR.map((cat) => {
              const active = activeCategory === cat.slug
              return (
                <Link
                  key={cat.slug}
                  href={cat.slug === 'all' ? '/blog' : `/blog?category=${encodeURIComponent(cat.slug)}`}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-colors border ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--primary-fg)] border-[var(--gold)]'
                      : 'bg-transparent text-[var(--fg-muted)] border-[var(--border)] hover:text-[var(--fg)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  {isEN ? CATS_EN[cat.slug] ?? cat.label : cat.label}
                </Link>
              )
            })}
          </div>

          {/* Posts */}
          {!posts || posts.length === 0 ? (
            <div className="text-center py-24 text-[var(--fg-muted)]">
              {isEN ? 'No articles yet.' : 'لا توجد مقالات بعد.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
              {posts.map((post) => {
                const title = isEN && post.title_en ? post.title_en : post.title
                const excerpt = isEN && post.excerpt_en ? post.excerpt_en : post.excerpt
                const category = isEN
                  ? post.category_en || CATS_EN[post.category] || post.category
                  : post.category
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-[var(--surface)] hover:bg-[var(--bg-2)] transition-colors p-6 flex flex-col"
                  >
                    {post.cover_image && (
                      <div className="img-frame mb-5 aspect-[16/9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image}
                          alt={title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3 text-[10px] tracking-widest uppercase text-[var(--fg-muted)]">
                      <span className="text-[var(--gold)]">{category}</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} strokeWidth={1.6} />
                        {new Date(post.created_at).toLocaleDateString(isEN ? 'en-GB' : 'ar-SA')}
                      </span>
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-[var(--fg)] mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h2>
                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-3 mb-5">
                      {excerpt}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[var(--gold)]">
                      {isEN ? 'Read more' : 'اقرأ المزيد'}
                      <Arrow size={13} strokeWidth={1.6} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/SiteShell'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerLocale } from '@/lib/i18n/server'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getServerLocale()
  const isEN = locale === 'en'
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: isEN ? 'Article not found' : 'مقال غير موجود' }

  const title =
    isEN && post.seo_title_en
      ? post.seo_title_en
      : isEN && post.title_en
      ? post.title_en
      : post.seo_title || post.title
  const description =
    isEN && post.seo_description_en
      ? post.seo_description_en
      : isEN && post.excerpt_en
      ? post.excerpt_en
      : post.seo_description || post.excerpt

  return {
    title: `${title} | EAST PLUS`,
    description,
    alternates: { canonical: `https://eastplus.sa/blog/${slug}` },
    openGraph: {
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
      locale: isEN ? 'en_US' : 'ar_SA',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getServerLocale()
  const isEN = locale === 'en'
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const title = isEN && post.title_en ? post.title_en : post.title
  const excerpt = isEN && post.excerpt_en ? post.excerpt_en : post.excerpt
  const content = isEN && post.content_en ? post.content_en : post.content
  const category = isEN ? post.category_en || post.category : post.category

  const Arrow = isEN ? ArrowRight : ArrowLeft
  const Back = isEN ? ArrowLeft : ArrowRight

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    inLanguage: isEN ? 'en' : 'ar',
    author: { '@type': 'Organization', name: 'EAST PLUS' },
    publisher: {
      '@type': 'Organization',
      name: 'EAST PLUS',
      logo: { '@type': 'ImageObject', url: 'https://eastplus.sa/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://eastplus.sa/blog/${slug}` },
  }

  return (
    <SiteShell>
      <main className="pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <article className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--gold)] mb-10 transition-colors"
          >
            <Back size={14} strokeWidth={1.6} />
            {isEN ? 'Back to blog' : 'العودة للمدونة'}
          </Link>

          <div className="flex items-center gap-3 mb-5 text-[10px] tracking-widest uppercase">
            <span className="text-[var(--gold)]">{category}</span>
            <span className="text-[var(--fg-muted)] inline-flex items-center gap-1">
              <Calendar size={12} strokeWidth={1.6} />
              {new Date(post.created_at).toLocaleDateString(isEN ? 'en-GB' : 'ar-SA')}
            </span>
          </div>

          <h1 className="text-3xl md:text-[2.5rem] font-semibold text-[var(--fg)] leading-tight mb-6">
            {title}
          </h1>

          <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-10">{excerpt}</p>

          {post.cover_image && (
            <div className="img-frame mb-12 aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none text-[var(--fg)] leading-relaxed
              prose-headings:text-[var(--fg)] prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[var(--fg-muted)] prose-p:leading-loose
              prose-li:text-[var(--fg-muted)]
              prose-a:text-[var(--gold)] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[var(--fg)]
              prose-img:rounded-xl prose-img:border prose-img:border-[var(--border)]"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="mt-16 surface-card p-8 hairline-top text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--fg)] mb-3">
              {isEN ? 'Need materials for your project?' : 'تحتاج مواد لمشروعك؟'}
            </h3>
            <p className="text-[var(--fg-muted)] text-sm mb-6">
              {isEN
                ? 'Get a tailored quotation within 24 hours.'
                : 'احصل على عرض سعر مخصص خلال 24 ساعة.'}
            </p>
            <Link href="/account/rfqs/new" className="btn-primary inline-flex">
              {isEN ? 'Request a quote' : 'طلب عرض سعر'}
              <Arrow size={15} strokeWidth={1.6} />
            </Link>
          </div>
        </article>
      </main>
    </SiteShell>
  )
}

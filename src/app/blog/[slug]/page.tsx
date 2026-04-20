import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'مقال غير موجود' }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
      locale: 'ar_SA',
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(company_name)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'EAST PLUS',
    },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#DCBE81] mb-8 transition-colors"
          >
            <ArrowRight size={16} />
            العودة للمدونة
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm px-3 py-1 rounded-full bg-[#DCBE81]/10 text-[#DCBE81] font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-10">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:text-[#1A1A1A] prose-headings:font-bold
              prose-a:text-[#DCBE81] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1A1A1A]
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl gold-gradient text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              تحتاج مواد لمشروعك؟
            </h3>
            <p className="text-white/80 mb-6">
              احصل على عرض سعر مخصص خلال 24 ساعة
            </p>
            <Link
              href="/rfq/new"
              className="inline-block px-8 py-3 bg-[#1A1A1A] text-white font-semibold rounded-xl hover:bg-[#2A2A2A] transition-colors"
            >
              طلب عرض سعر
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

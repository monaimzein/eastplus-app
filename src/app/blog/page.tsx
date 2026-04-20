import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المدونة | EAST PLUS',
  description: 'مقالات وأدلة متخصصة في مواد البناء والسباكة والكهرباء والعزل',
}

const categories = [
  { slug: 'all', label: 'الكل' },
  { slug: 'مواد البناء', label: 'مواد البناء' },
  { slug: 'السباكة', label: 'السباكة' },
  { slug: 'الكهرباء', label: 'الكهرباء' },
  { slug: 'العزل', label: 'العزل' },
]

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
              <span className="gold-text">المدونة</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
              مقالات وأدلة متخصصة تساعدك في اختيار المواد المناسبة لمشروعك
            </p>
          </div>

          {/* Categories */}
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={
                  cat.slug === 'all'
                    ? '/blog'
                    : `/blog?category=${encodeURIComponent(cat.slug)}`
                }
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.slug
                    ? 'gold-gradient text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#DCBE81]'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          {!posts || posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">لا توجد مقالات بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#DCBE81]/10 transition-all duration-500"
                >
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#DCBE81]/10 text-[#DCBE81] font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#DCBE81] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[#DCBE81] text-sm font-medium">
                      اقرأ المزيد
                      <ArrowLeft size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

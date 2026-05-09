-- ============================================
-- BLOG BILINGUAL MIGRATION
-- Adds English fields. AR is the primary; EN falls back to AR if missing.
-- Run in Supabase SQL Editor.
-- ============================================

alter table public.blog_posts
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists content_en text,
  add column if not exists seo_title_en text,
  add column if not exists seo_description_en text,
  add column if not exists category_en text;

create index if not exists blog_posts_published_created_idx
  on public.blog_posts (published, created_at desc);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

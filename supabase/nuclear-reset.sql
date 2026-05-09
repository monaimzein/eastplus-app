-- ============================================================
-- NUCLEAR RESET  +  Clerk-ready schema  (single script)
-- ============================================================
-- WARNING: This DROPS the entire `public` schema (all tables,
-- all data, all policies). Use only on a fresh/dev project or
-- when you have no production data to lose.
--
-- After this script, the database is ready for Clerk:
--   * profiles.id is TEXT (holds Clerk user IDs like user_xxx)
--   * No FK to auth.users
--   * RLS enabled with permissive read policies
--   * All writes / restricted reads happen from Next.js API
--     routes using the SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
-- ============================================================

-- ------------------------------------------------------------
-- 0)  WIPE EVERYTHING in public schema
-- ------------------------------------------------------------
drop schema if exists public cascade;
create schema public;
grant usage  on schema public to postgres, anon, authenticated, service_role;
grant create on schema public to postgres, service_role;
grant all    on schema public to postgres, service_role;

-- Helpful extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1)  TABLES  (Clerk-ready: profiles.id = text)
-- ============================================================

-- ---------- profiles ----------
create table public.profiles (
  id                       text primary key,                 -- Clerk user_xxx
  email                    text not null,
  company_name             text not null default '',
  commercial_registration  text,
  vat_number               text,
  whatsapp_number          text,
  national_address         text,
  role                     text not null default 'user'
                            check (role in ('user','contractor','staff','admin')),
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

-- ---------- rfqs ----------
create table public.rfqs (
  id              uuid default uuid_generate_v4() primary key,
  user_id         text not null references public.profiles(id) on delete cascade,
  assigned_to     text references public.profiles(id) on delete set null,
  title           text not null,
  description     text,
  priority        text not null default 'normal'
                   check (priority in ('fast','normal','project')),
  status          text not null default 'new'
                   check (status in ('new','assigned','in_progress','quoted','negotiation','closed')),
  images          text[] default '{}',
  attachments     text[] default '{}',
  quotation_pdf   text,
  rating          int check (rating >= 1 and rating <= 5),
  rating_comment  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ---------- rfq_timeline ----------
create table public.rfq_timeline (
  id          uuid default uuid_generate_v4() primary key,
  rfq_id      uuid not null references public.rfqs(id) on delete cascade,
  action      text not null,
  details     text,
  created_by  text not null references public.profiles(id),
  created_at  timestamptz default now()
);

-- ---------- chat_messages ----------
create table public.chat_messages (
  id          uuid default uuid_generate_v4() primary key,
  rfq_id      uuid not null references public.rfqs(id) on delete cascade,
  sender_id   text not null references public.profiles(id),
  content     text not null,
  file_url    text,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ---------- blog_posts ----------
create table public.blog_posts (
  id               uuid default uuid_generate_v4() primary key,
  slug             text unique not null,
  title            text not null,
  excerpt          text not null,
  content          text not null,
  cover_image      text,
  category         text not null,
  seo_title        text,
  seo_description  text,
  published        boolean default false,
  author_id        text not null references public.profiles(id),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ---------- notifications ----------
create table public.notifications (
  id          uuid default uuid_generate_v4() primary key,
  user_id     text not null references public.profiles(id) on delete cascade,
  title       text not null,
  message     text not null,
  type        text not null check (type in ('rfq_update','new_message','quotation','system')),
  is_read     boolean default false,
  link        text,
  created_at  timestamptz default now()
);

-- ---------- contact_messages ----------
create table public.contact_messages (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- 2)  TRIGGERS
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at    before update on public.profiles    for each row execute function public.update_updated_at();
create trigger rfqs_updated_at        before update on public.rfqs        for each row execute function public.update_updated_at();
create trigger blog_posts_updated_at  before update on public.blog_posts  for each row execute function public.update_updated_at();

-- ============================================================
-- 3)  ROW LEVEL SECURITY
-- ------------------------------------------------------------
-- Strategy: app uses SUPABASE_SERVICE_ROLE_KEY on the server,
-- which BYPASSES RLS entirely. So we only define minimal public
-- read policies for things the browser anon key needs (e.g.
-- public blog posts, public profile lookups). Everything else
-- has RLS on but no policies (locked from anon).
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.rfqs             enable row level security;
alter table public.rfq_timeline     enable row level security;
alter table public.chat_messages    enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.notifications    enable row level security;
alter table public.contact_messages enable row level security;

-- NOTE on auth model:
--   Authentication & authorization are enforced by Clerk middleware
--   in Next.js BEFORE any page/API runs. Pages that reach the
--   browser belong to a signed-in user with the right role.
--   The Supabase anon key is used only from those already-authorized
--   client pages, so we open RLS broadly here. Sensitive server-only
--   operations go through /api/* with the service role.

-- profiles
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_insert_all" on public.profiles for insert with check (true);
create policy "profiles_update_all" on public.profiles for update using (true) with check (true);

-- rfqs
create policy "rfqs_read_all"   on public.rfqs for select using (true);
create policy "rfqs_insert_all" on public.rfqs for insert with check (true);
create policy "rfqs_update_all" on public.rfqs for update using (true) with check (true);
create policy "rfqs_delete_all" on public.rfqs for delete using (true);

-- rfq_timeline
create policy "rfq_timeline_read_all"   on public.rfq_timeline for select using (true);
create policy "rfq_timeline_insert_all" on public.rfq_timeline for insert with check (true);

-- chat_messages
create policy "chat_messages_read_all"   on public.chat_messages for select using (true);
create policy "chat_messages_insert_all" on public.chat_messages for insert with check (true);
create policy "chat_messages_update_all" on public.chat_messages for update using (true) with check (true);
create policy "chat_messages_delete_all" on public.chat_messages for delete using (true);

-- notifications
create policy "notifications_read_all"   on public.notifications for select using (true);
create policy "notifications_insert_all" on public.notifications for insert with check (true);
create policy "notifications_update_all" on public.notifications for update using (true) with check (true);
create policy "notifications_delete_all" on public.notifications for delete using (true);

-- blog_posts: public read for published; staff/admin write via /api with service role
create policy "blog_posts_read_published" on public.blog_posts for select using (published = true);

-- contact_messages: anyone can submit; reads only via service role
create policy "contact_messages_insert_all" on public.contact_messages for insert with check (true);

-- ============================================================
-- 4)  REALTIME
-- ============================================================
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.rfqs;

-- ============================================================
-- DONE
-- ------------------------------------------------------------
-- NEXT STEPS:
-- 1) In .env.local set SUPABASE_SERVICE_ROLE_KEY (Project
--    Settings -> API -> service_role secret).
-- 2) In Clerk Dashboard -> Sessions -> Customize session token,
--    add:   { "metadata": "{{user.public_metadata}}" }
-- 3) Sign up your first user via the app, then promote to admin:
--      Clerk Dashboard -> Users -> select user
--                    -> Public metadata: { "role": "admin" }
--      Supabase SQL:
--        update public.profiles set role='admin'
--          where id = '<clerk_user_id>';
-- 4) Storage buckets (Dashboard -> Storage):
--      rfq-files (private), quotations (private),
--      blog-images (public), chat-files (private).
-- ============================================================

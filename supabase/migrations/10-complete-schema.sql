-- ============================================================
-- EAST PLUS — Complete Database Schema v2
-- Run this on a FRESH Supabase project (obthsldpphohfrjvdvbe)
-- Order: this file first, then 11-business-schema.sql,
--         then 12-storage-buckets.sql, optionally seed.sql
-- ============================================================

-- ============================================================
-- 0. Extensions
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. Helper: auto-update updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;$$;

-- ============================================================
-- 2. Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id, email, company_name, phone, role,
    notification_prefs, language, theme
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role','user'),
    '{"in_app":true,"email":true,"whatsapp":false}'::jsonb,
    'ar', 'dark'
  ) on conflict (id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id                      uuid references auth.users on delete cascade primary key,
  email                   text not null,
  company_name            text not null default '',
  commercial_registration text,
  vat_number              text,
  phone                   text,
  whatsapp_number         text,
  national_address        text,
  address                 text,
  tax_number              text,
  avatar_url              text,
  role                    text not null default 'user'
                            check (role in ('user','contractor','staff','admin')),
  notification_prefs      jsonb not null
                            default '{"in_app":true,"email":true,"whatsapp":false}'::jsonb,
  language                text not null default 'ar' check (language in ('ar','en')),
  theme                   text not null default 'dark' check (theme in ('dark','light','system')),
  last_seen_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_all"  on public.profiles for select using (true);
create policy "profiles_insert_own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);
create policy "profiles_admin_all"   on public.profiles for all
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role = 'admin'));

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. RFQS
-- ============================================================
create table if not exists public.rfqs (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  assigned_to  uuid references public.profiles(id) on delete set null,
  title        text not null,
  description  text,
  service_key  text check (service_key in
                 ('plumbing','electrical','construction','sanitary',
                  'insulation','maintenance','projects')),
  priority     text not null default 'normal'
                 check (priority in ('fast','normal','project')),
  status       text not null default 'new'
                 check (status in ('new','assigned','in_progress',
                                   'quoted','negotiation','closed')),
  budget_min   numeric(14,2),
  budget_max   numeric(14,2),
  location     text,
  deadline     date,
  quantity     text,
  notes        text,
  images       text[] default '{}',
  attachments  text[] default '{}',
  quotation_pdf text,
  rating       int  check (rating between 1 and 5),
  rating_comment text,
  deleted_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.rfqs enable row level security;
create policy "rfqs_select" on public.rfqs for select using (
  deleted_at is null and (
    auth.uid() = user_id or auth.uid() = assigned_to
    or exists (select 1 from public.profiles _p
               where _p.id = auth.uid() and _p.role in ('staff','admin'))
  )
);
create policy "rfqs_insert" on public.rfqs for insert with check (auth.uid() = user_id);
create policy "rfqs_update" on public.rfqs for update using (
  auth.uid() = user_id
  or exists (select 1 from public.profiles _p
             where _p.id = auth.uid() and _p.role in ('staff','admin'))
);
create policy "rfqs_delete_admin" on public.rfqs for delete
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role = 'admin'));

create index if not exists idx_rfqs_user    on public.rfqs(user_id);
create index if not exists idx_rfqs_assign  on public.rfqs(assigned_to);
create index if not exists idx_rfqs_status  on public.rfqs(status);
create index if not exists idx_rfqs_created on public.rfqs(created_at desc);

create trigger rfqs_updated_at before update on public.rfqs
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. RFQ TIMELINE
-- ============================================================
create table if not exists public.rfq_timeline (
  id          uuid default uuid_generate_v4() primary key,
  rfq_id      uuid references public.rfqs(id) on delete cascade not null,
  action      text not null,
  details     text,
  is_internal boolean not null default false,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.rfq_timeline enable row level security;
create policy "rfq_timeline_select" on public.rfq_timeline for select using (
  (not is_internal
   or exists (select 1 from public.profiles _p
              where _p.id = auth.uid() and _p.role in ('staff','admin')))
  and exists (
    select 1 from public.rfqs r where r.id = rfq_id
    and (r.user_id = auth.uid() or r.assigned_to = auth.uid()
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')))
  )
);
create policy "rfq_timeline_insert" on public.rfq_timeline for insert with check (
  exists (select 1 from public.profiles _p
          where _p.id = auth.uid() and _p.role in ('staff','admin'))
  or auth.uid() = created_by
);

create index if not exists idx_rfq_timeline_rfq on public.rfq_timeline(rfq_id, created_at);

-- ============================================================
-- 6. CHAT MESSAGES
-- ============================================================
create table if not exists public.chat_messages (
  id         uuid default uuid_generate_v4() primary key,
  rfq_id     uuid references public.rfqs(id) on delete cascade not null,
  sender_id  uuid references public.profiles(id) on delete set null not null,
  content    text not null,
  file_url   text,
  is_read    boolean not null default false,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
create policy "chat_select" on public.chat_messages for select using (
  exists (
    select 1 from public.rfqs r where r.id = rfq_id
    and (r.user_id = auth.uid() or r.assigned_to = auth.uid()
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')))
  )
);
create policy "chat_insert" on public.chat_messages for insert with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.rfqs r where r.id = rfq_id
    and (r.user_id = auth.uid() or r.assigned_to = auth.uid()
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')))
  )
);
create policy "chat_update_read" on public.chat_messages for update
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin'))
         or sender_id = auth.uid());

create index if not exists idx_chat_rfq     on public.chat_messages(rfq_id);
create index if not exists idx_chat_created on public.chat_messages(rfq_id, created_at asc);

-- ============================================================
-- 7. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  title      text not null,
  message    text not null default '',
  type       text not null check (type in
               ('rfq_update','new_message','quotation','system','invoice')),
  priority   text not null default 'normal'
               check (priority in ('low','normal','high')),
  is_read    boolean not null default false,
  read_at    timestamptz,
  link       text,
  metadata   jsonb default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "notif_select_own"  on public.notifications for select using (auth.uid() = user_id);
create policy "notif_update_own"  on public.notifications for update using (auth.uid() = user_id);
create policy "notif_delete_own"  on public.notifications for delete using (auth.uid() = user_id);
create policy "notif_insert"      on public.notifications for insert with check (true);

create index if not exists idx_notif_user on public.notifications(user_id, is_read, created_at desc);

-- ============================================================
-- 8. CONTACT MESSAGES
-- ============================================================
create table if not exists public.contact_messages (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  is_read     boolean not null default false,
  replied_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
create policy "contact_insert"       on public.contact_messages for insert with check (true);
create policy "contact_staff_select" on public.contact_messages for select
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "contact_staff_update" on public.contact_messages for update
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 9. BLOG POSTS (bilingual)
-- ============================================================
create table if not exists public.blog_posts (
  id               uuid default uuid_generate_v4() primary key,
  slug             text unique not null,
  title            text not null,
  excerpt          text not null default '',
  content          text not null default '',
  title_en         text,
  excerpt_en       text,
  content_en       text,
  cover_image      text,
  category         text not null default 'general',
  category_en      text,
  seo_title        text,
  seo_title_en     text,
  seo_description  text,
  seo_description_en text,
  published        boolean not null default false,
  published_at     timestamptz,
  author_id        uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
create policy "blog_select" on public.blog_posts for select
  using (published = true
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "blog_staff_all" on public.blog_posts for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

create index if not exists idx_blog_slug      on public.blog_posts(slug);
create index if not exists idx_blog_published on public.blog_posts(published, published_at desc);

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- 10. Realtime
-- ============================================================
alter publication supabase_realtime add table public.rfqs;
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.rfq_timeline;

-- ============================================================
-- EAST PLUS — Clean Account + Console Schema
-- Run after supabase-auth-reset.sql on a Supabase project.
-- Uses Supabase Auth, Postgres, Storage, and RLS.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- Clean reset for app-owned schema objects
-- ============================================================
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.chat_messages cascade;
drop table if exists public.rfq_timeline cascade;
drop table if exists public.quotations cascade;
drop table if exists public.rfq_files cascade;
drop table if exists public.notifications cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.rfqs cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.profiles cascade;

drop sequence if exists public.quotation_number_seq cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_quotation_number() cascade;
drop function if exists public.current_profile_role() cascade;
drop function if exists public.current_profile_active() cascade;
drop function if exists public.is_staff_or_admin() cascade;
drop function if exists public.is_admin() cascade;

-- ============================================================
-- Helpers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

-- ============================================================
-- Profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text not null default '',
  commercial_registration text,
  vat_number text,
  whatsapp_number text,
  national_address text,
  job_title text,
  role text not null default 'user' check (role in ('user', 'staff', 'admin')),
  is_active boolean not null default true,
  notification_prefs jsonb not null default '{"in_app":true,"email":true,"whatsapp":false}'::jsonb,
  language text not null default 'ar' check (language in ('ar', 'en')),
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_whatsapp_format check (whatsapp_number is null or whatsapp_number ~ '^05[0-9]{8}$')
);

create or replace function public.current_profile_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.current_profile_active()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(is_active, false) from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.is_staff_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_profile_active(), false)
    and public.current_profile_role() in ('staff', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_profile_active(), false)
    and public.current_profile_role() = 'admin';
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    company_name,
    commercial_registration,
    vat_number,
    whatsapp_number,
    national_address,
    job_title,
    role
  ) values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data->>'company_name', ''), ''),
    nullif(new.raw_user_meta_data->>'commercial_registration', ''),
    nullif(new.raw_user_meta_data->>'vat_number', ''),
    nullif(new.raw_user_meta_data->>'whatsapp_number', ''),
    nullif(new.raw_user_meta_data->>'national_address', ''),
    nullif(new.raw_user_meta_data->>'job_title', ''),
    'user'
  ) on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists profiles_select_own_or_staff on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_select_own_or_staff on public.profiles
  for select using (auth.uid() = id or public.is_staff_or_admin());
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id and role = 'user') with check (auth.uid() = id and role = 'user' and is_active = true);
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create index if not exists idx_profiles_role on public.profiles(role, is_active);

-- ============================================================
-- RFQs
-- ============================================================
create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'normal' check (priority in ('normal', 'fast', 'project')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'quote_sent', 'closed')),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rfqs enable row level security;
drop policy if exists rfqs_select_access on public.rfqs;
drop policy if exists rfqs_insert_customer on public.rfqs;
drop policy if exists rfqs_update_customer_staff on public.rfqs;
drop policy if exists rfqs_delete_admin on public.rfqs;
create policy rfqs_select_access on public.rfqs for select using (
  auth.uid() = user_id or auth.uid() = assigned_to or public.is_staff_or_admin()
);
create policy rfqs_insert_customer on public.rfqs for insert with check (
  auth.uid() = user_id and public.current_profile_role() = 'user' and public.current_profile_active()
);
create policy rfqs_update_customer_staff on public.rfqs for update using (
  auth.uid() = user_id or auth.uid() = assigned_to or public.is_staff_or_admin()
) with check (
  auth.uid() = user_id or auth.uid() = assigned_to or public.is_staff_or_admin()
);
create policy rfqs_delete_admin on public.rfqs for delete using (public.is_admin());

drop trigger if exists rfqs_updated_at on public.rfqs;
create trigger rfqs_updated_at before update on public.rfqs
  for each row execute function public.set_updated_at();

create index if not exists idx_rfqs_user on public.rfqs(user_id, created_at desc);
create index if not exists idx_rfqs_assigned on public.rfqs(assigned_to, created_at desc);
create index if not exists idx_rfqs_status on public.rfqs(status, created_at desc);

-- ============================================================
-- RFQ files
-- ============================================================
create table if not exists public.rfq_files (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  owner_type text not null check (owner_type in ('customer', 'company')),
  bucket text not null default 'rfq-files',
  path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

alter table public.rfq_files enable row level security;
drop policy if exists rfq_files_select_access on public.rfq_files;
drop policy if exists rfq_files_insert_access on public.rfq_files;
drop policy if exists rfq_files_delete_access on public.rfq_files;
create policy rfq_files_select_access on public.rfq_files for select using (
  exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);
create policy rfq_files_insert_access on public.rfq_files for insert with check (
  uploaded_by = auth.uid()
  and exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (
      (owner_type = 'customer' and r.user_id = auth.uid())
      or (owner_type = 'company' and (r.assigned_to = auth.uid() or public.is_staff_or_admin()))
    )
  )
);
create policy rfq_files_delete_access on public.rfq_files for delete using (
  public.is_admin() or uploaded_by = auth.uid()
);

create index if not exists idx_rfq_files_rfq on public.rfq_files(rfq_id, created_at desc);
create unique index if not exists idx_rfq_files_path on public.rfq_files(bucket, path);

-- ============================================================
-- Chat messages
-- ============================================================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  file_id uuid references public.rfq_files(id) on delete set null,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
drop policy if exists chat_messages_select_access on public.chat_messages;
drop policy if exists chat_messages_insert_access on public.chat_messages;
drop policy if exists chat_messages_update_read on public.chat_messages;
create policy chat_messages_select_access on public.chat_messages for select using (
  exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);
create policy chat_messages_insert_access on public.chat_messages for insert with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);
create policy chat_messages_update_read on public.chat_messages for update using (
  exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);

create index if not exists idx_chat_messages_rfq on public.chat_messages(rfq_id, created_at asc);

-- ============================================================
-- Timeline
-- ============================================================
create table if not exists public.rfq_timeline (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  status text check (status in ('new', 'in_progress', 'quote_sent', 'closed')),
  message text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.rfq_timeline enable row level security;
drop policy if exists rfq_timeline_select_access on public.rfq_timeline;
drop policy if exists rfq_timeline_insert_access on public.rfq_timeline;
create policy rfq_timeline_select_access on public.rfq_timeline for select using (
  (not is_internal or public.is_staff_or_admin())
  and exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);
create policy rfq_timeline_insert_access on public.rfq_timeline for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);

create index if not exists idx_rfq_timeline_rfq on public.rfq_timeline(rfq_id, created_at desc);

-- ============================================================
-- Quotations
-- ============================================================
create sequence if not exists public.quotation_number_seq start 1;

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  staff_id uuid references public.profiles(id) on delete set null,
  number text unique,
  file_id uuid references public.rfq_files(id) on delete set null,
  status text not null default 'sent' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  notes text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_quotation_number()
returns trigger language plpgsql as $$
begin
  if new.number is null then
    new.number := 'QT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quotation_number_seq')::text, 4, '0');
  end if;
  if new.status = 'sent' and new.sent_at is null then
    new.sent_at := now();
  end if;
  return new;
end;$$;

drop trigger if exists quotations_set_number on public.quotations;
create trigger quotations_set_number before insert on public.quotations
  for each row execute function public.set_quotation_number();
drop trigger if exists quotations_updated_at on public.quotations;
create trigger quotations_updated_at before update on public.quotations
  for each row execute function public.set_updated_at();

alter table public.quotations enable row level security;
drop policy if exists quotations_select_access on public.quotations;
drop policy if exists quotations_staff_all on public.quotations;
create policy quotations_select_access on public.quotations for select using (
  exists (
    select 1 from public.rfqs r
    where r.id = rfq_id and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
  )
);
create policy quotations_staff_all on public.quotations for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

create index if not exists idx_quotations_rfq on public.quotations(rfq_id, created_at desc);

-- ============================================================
-- Notifications
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null default '',
  type text not null default 'system' check (type in ('rfq_update', 'new_message', 'quotation', 'system', 'contact_message')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  is_read boolean not null default false,
  read_at timestamptz,
  link text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
drop policy if exists notifications_select_own on public.notifications;
drop policy if exists notifications_update_own on public.notifications;
drop policy if exists notifications_insert_staff on public.notifications;
create policy notifications_select_own on public.notifications for select using (auth.uid() = user_id);
create policy notifications_update_own on public.notifications for update using (auth.uid() = user_id);
create policy notifications_insert_staff on public.notifications for insert with check (public.is_staff_or_admin() or auth.uid() = user_id);

create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- ============================================================
-- Contact messages
-- ============================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  read_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
drop policy if exists contact_messages_insert_public on public.contact_messages;
drop policy if exists contact_messages_staff_select on public.contact_messages;
drop policy if exists contact_messages_staff_update on public.contact_messages;
create policy contact_messages_insert_public on public.contact_messages for insert with check (true);
create policy contact_messages_staff_select on public.contact_messages for select using (public.is_staff_or_admin());
create policy contact_messages_staff_update on public.contact_messages for update using (public.is_staff_or_admin());

create index if not exists idx_contact_messages_created on public.contact_messages(created_at desc);

-- ============================================================
-- Audit logs
-- ============================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
drop policy if exists audit_logs_admin_select on public.audit_logs;
drop policy if exists audit_logs_staff_insert on public.audit_logs;
create policy audit_logs_admin_select on public.audit_logs for select using (public.is_admin());
create policy audit_logs_staff_insert on public.audit_logs for insert with check (public.is_staff_or_admin());

create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- ============================================================
-- Public blog content
-- ============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  title_en text,
  excerpt_en text,
  content_en text,
  cover_image text,
  category text not null default 'مواد البناء',
  category_en text,
  seo_title text,
  seo_title_en text,
  seo_description text,
  seo_description_en text,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
drop policy if exists blog_posts_public_read on public.blog_posts;
drop policy if exists blog_posts_staff_all on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts for select using (published = true);
create policy blog_posts_staff_all on public.blog_posts for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_published on public.blog_posts(published, created_at desc);

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('rfq-files', 'rfq-files', false, 52428800, array[
    'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]),
  ('chat-files', 'chat-files', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('quotations', 'quotations', false, 20971520, array['application/pdf']),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists rfq_storage_read on storage.objects;
drop policy if exists rfq_storage_insert on storage.objects;
drop policy if exists rfq_storage_update on storage.objects;
drop policy if exists rfq_storage_delete on storage.objects;
create policy rfq_storage_read on storage.objects for select using (
  bucket_id in ('rfq-files', 'chat-files', 'quotations')
  and (
    public.is_staff_or_admin()
    or exists (
      select 1 from public.rfq_files f
      join public.rfqs r on r.id = f.rfq_id
      where f.bucket = bucket_id and f.path = name and r.user_id = auth.uid()
    )
  )
);
create policy rfq_storage_insert on storage.objects for insert with check (
  bucket_id in ('rfq-files', 'chat-files', 'quotations') and auth.uid() is not null
);
create policy rfq_storage_update on storage.objects for update using (
  bucket_id in ('rfq-files', 'chat-files', 'quotations') and public.is_staff_or_admin()
);
create policy rfq_storage_delete on storage.objects for delete using (
  bucket_id in ('rfq-files', 'chat-files', 'quotations') and public.is_admin()
);

drop policy if exists avatars_public_read on storage.objects;
drop policy if exists avatars_owner_write on storage.objects;
create policy avatars_public_read on storage.objects for select using (bucket_id = 'avatars');
create policy avatars_owner_write on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- Realtime publication
-- ============================================================
do $$
begin
  begin alter publication supabase_realtime add table public.rfqs; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.rfq_files; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.chat_messages; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.rfq_timeline; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end;
end $$;
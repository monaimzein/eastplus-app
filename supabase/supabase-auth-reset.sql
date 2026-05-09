-- ============================================================
-- SUPABASE-AUTH RESET  (single self-contained script)
-- ============================================================
-- Drops the entire `public` schema and rebuilds it for native
-- Supabase Auth (no Clerk, no service-role API plumbing needed).
--
-- Identity: profiles.id = uuid REFERENCES auth.users(id)
-- Authorization: standard RLS using auth.uid()
-- Auto-profile: trigger on auth.users handles signup metadata.
-- ============================================================

-- ------------------------------------------------------------
-- 0)  WIPE public schema  (DEV ONLY — destroys all data)
-- ------------------------------------------------------------
drop schema if exists public cascade;
create schema public;
grant usage  on schema public to postgres, anon, authenticated, service_role;
grant create on schema public to postgres, service_role;
grant all    on schema public to postgres, service_role;

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1)  TABLES
-- ============================================================

-- ---------- profiles ----------
create table public.profiles (
  id                       uuid primary key references auth.users(id) on delete cascade,
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
  user_id         uuid not null references public.profiles(id) on delete cascade,
  assigned_to     uuid references public.profiles(id) on delete set null,
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
  created_by  uuid not null references public.profiles(id),
  created_at  timestamptz default now()
);

-- ---------- chat_messages ----------
create table public.chat_messages (
  id          uuid default uuid_generate_v4() primary key,
  rfq_id      uuid not null references public.rfqs(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id),
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
  author_id        uuid not null references public.profiles(id),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ---------- notifications ----------
create table public.notifications (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
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

-- updated_at maintainer
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

-- Auto-create a profile row when a new auth.users row is inserted.
-- Reads optional metadata posted from the signup page.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, company_name, commercial_registration,
    vat_number, whatsapp_number, national_address, role
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    nullif(new.raw_user_meta_data->>'commercial_registration', ''),
    nullif(new.raw_user_meta_data->>'vat_number', ''),
    nullif(new.raw_user_meta_data->>'whatsapp_number', ''),
    nullif(new.raw_user_meta_data->>'national_address', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3)  ROW LEVEL SECURITY
-- ============================================================

-- Helper: is the caller a staff or admin?
create or replace function public.is_staff_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff','admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- profiles ----------
alter table public.profiles enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin());

create policy "profiles_delete_admin"
  on public.profiles for delete
  using (public.is_admin());

-- ---------- rfqs ----------
alter table public.rfqs enable row level security;

create policy "rfqs_select_visible"
  on public.rfqs for select
  using (
    auth.uid() = user_id
    or auth.uid() = assigned_to
    or public.is_staff_or_admin()
  );

create policy "rfqs_insert_self"
  on public.rfqs for insert
  with check (auth.uid() = user_id);

create policy "rfqs_update_visible"
  on public.rfqs for update
  using (
    auth.uid() = user_id
    or auth.uid() = assigned_to
    or public.is_staff_or_admin()
  );

create policy "rfqs_delete_admin"
  on public.rfqs for delete
  using (public.is_admin());

-- ---------- rfq_timeline ----------
alter table public.rfq_timeline enable row level security;

create policy "rfq_timeline_select_visible"
  on public.rfq_timeline for select
  using (
    exists (
      select 1 from public.rfqs r
      where r.id = rfq_timeline.rfq_id
        and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
    )
  );

create policy "rfq_timeline_insert_staff"
  on public.rfq_timeline for insert
  with check (auth.uid() = created_by);

-- ---------- chat_messages ----------
alter table public.chat_messages enable row level security;

create policy "chat_select_visible"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.rfqs r
      where r.id = chat_messages.rfq_id
        and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
    )
  );

create policy "chat_insert_visible"
  on public.chat_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.rfqs r
      where r.id = chat_messages.rfq_id
        and (r.user_id = auth.uid() or r.assigned_to = auth.uid() or public.is_staff_or_admin())
    )
  );

create policy "chat_update_own"
  on public.chat_messages for update
  using (auth.uid() = sender_id or public.is_staff_or_admin());

create policy "chat_delete_admin"
  on public.chat_messages for delete
  using (public.is_admin());

-- ---------- blog_posts ----------
alter table public.blog_posts enable row level security;

create policy "blog_select_published_or_staff"
  on public.blog_posts for select
  using (published = true or public.is_staff_or_admin());

create policy "blog_manage_staff"
  on public.blog_posts for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- ---------- notifications ----------
alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_insert_any_authenticated"
  on public.notifications for insert
  to authenticated
  with check (true);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "notifications_delete_own_or_admin"
  on public.notifications for delete
  using (auth.uid() = user_id or public.is_admin());

-- ---------- contact_messages ----------
alter table public.contact_messages enable row level security;

create policy "contact_insert_anyone"
  on public.contact_messages for insert
  with check (true);

create policy "contact_select_staff"
  on public.contact_messages for select
  using (public.is_staff_or_admin());

create policy "contact_update_staff"
  on public.contact_messages for update
  using (public.is_staff_or_admin());

-- ============================================================
-- 4)  REALTIME
-- ============================================================
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.rfqs;

-- ============================================================
-- DONE.
-- ------------------------------------------------------------
-- NEXT STEPS:
-- 1) In Supabase Dashboard -> Authentication -> Providers,
--    make sure "Email" is enabled. To skip OTP for dev, you can
--    disable "Confirm email" — users can sign in immediately.
-- 2) (Optional) Storage buckets:
--      rfq-files (private), quotations (private),
--      blog-images (public), chat-files (private).
-- 3) After signing up your first user, promote them in SQL:
--      update public.profiles set role='admin'
--        where email='your@email.com';
--    Effective immediately — no re-login required for RLS,
--    but the client `useAuth` reloads profile on focus.
-- ============================================================

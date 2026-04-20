-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  company_name text not null,
  commercial_registration text,
  vat_number text,
  whatsapp_number text,
  national_address text,
  role text not null default 'user' check (role in ('user', 'contractor', 'staff', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================
-- RFQs TABLE
-- ============================================
create table public.rfqs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'normal' check (priority in ('fast', 'normal', 'project')),
  status text not null default 'new' check (status in ('new', 'assigned', 'in_progress', 'quoted', 'negotiation', 'closed')),
  images text[] default '{}',
  attachments text[] default '{}',
  quotation_pdf text,
  rating int check (rating >= 1 and rating <= 5),
  rating_comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.rfqs enable row level security;

create policy "Users can view own RFQs"
  on rfqs for select using (
    auth.uid() = user_id
    or auth.uid() = assigned_to
    or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin'))
  );

create policy "Authenticated users can create RFQs"
  on rfqs for insert with check (auth.uid() = user_id);

create policy "Staff and admin can update RFQs"
  on rfqs for update using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin'))
  );

-- ============================================
-- RFQ TIMELINE TABLE
-- ============================================
create table public.rfq_timeline (
  id uuid default uuid_generate_v4() primary key,
  rfq_id uuid references public.rfqs(id) on delete cascade not null,
  action text not null,
  details text,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default now()
);

alter table public.rfq_timeline enable row level security;

create policy "Timeline viewable by RFQ participants"
  on rfq_timeline for select using (
    exists (
      select 1 from rfqs
      where rfqs.id = rfq_timeline.rfq_id
      and (rfqs.user_id = auth.uid() or rfqs.assigned_to = auth.uid()
        or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin')))
    )
  );

create policy "Staff and admin can insert timeline"
  on rfq_timeline for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin'))
    or auth.uid() = created_by
  );

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  rfq_id uuid references public.rfqs(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  file_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "Chat viewable by RFQ participants"
  on chat_messages for select using (
    exists (
      select 1 from rfqs
      where rfqs.id = chat_messages.rfq_id
      and (rfqs.user_id = auth.uid() or rfqs.assigned_to = auth.uid()
        or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin')))
    )
  );

create policy "RFQ participants can send messages"
  on chat_messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from rfqs
      where rfqs.id = chat_messages.rfq_id
      and (rfqs.user_id = auth.uid() or rfqs.assigned_to = auth.uid()
        or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin')))
    )
  );

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  category text not null,
  seo_title text,
  seo_description text,
  published boolean default false,
  author_id uuid references public.profiles(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_posts enable row level security;

create policy "Published posts are viewable by everyone"
  on blog_posts for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin')));

create policy "Staff and admin can manage posts"
  on blog_posts for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin'))
  );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null check (type in ('rfq_update', 'new_message', 'quotation', 'system')),
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update using (auth.uid() = user_id);

create policy "System can insert notifications"
  on notifications for insert with check (true);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages"
  on contact_messages for insert with check (true);

create policy "Staff and admin can view contact messages"
  on contact_messages for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin'))
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger rfqs_updated_at before update on rfqs
  for each row execute function update_updated_at();

create trigger blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, company_name, commercial_registration, vat_number, whatsapp_number, national_address, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'commercial_registration', ''),
    coalesce(new.raw_user_meta_data->>'vat_number', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', ''),
    coalesce(new.raw_user_meta_data->>'national_address', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table rfqs;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage:
-- 1. Create bucket "rfq-files" (public: false)
-- 2. Create bucket "quotations" (public: false)
-- 3. Create bucket "blog-images" (public: true)
-- 4. Create bucket "chat-files" (public: false)

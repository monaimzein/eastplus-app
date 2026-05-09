-- ============================================
-- Phase 1 — Dashboard rebuild: additional tables
-- ============================================

-- Extend profiles with optional contact + notification prefs
alter table public.profiles
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists tax_number text,
  add column if not exists avatar_url text,
  add column if not exists notification_prefs jsonb default '{"in_app":true,"email":true,"whatsapp":false}'::jsonb;

-- ============================================
-- Quotations (formal quote sent against an RFQ)
-- ============================================
create table if not exists public.quotations (
  id uuid default uuid_generate_v4() primary key,
  rfq_id uuid references public.rfqs(id) on delete cascade not null,
  staff_id uuid references public.profiles(id) on delete set null,
  total numeric(14,2) not null default 0,
  currency text not null default 'SAR',
  items jsonb not null default '[]'::jsonb,
  notes text,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired')),
  valid_until date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.quotations enable row level security;
create policy "quotations_owner_select" on public.quotations for select
  using (
    exists (select 1 from public.rfqs r where r.id = rfq_id and r.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin'))
  );
create policy "quotations_staff_write" on public.quotations for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- Invoices
-- ============================================
create table if not exists public.invoices (
  id uuid default uuid_generate_v4() primary key,
  quotation_id uuid references public.quotations(id) on delete cascade not null,
  number text unique,
  zatca_uuid text,
  total numeric(14,2) not null default 0,
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz default now()
);
alter table public.invoices enable row level security;
create policy "invoices_owner_select" on public.invoices for select
  using (
    exists (
      select 1 from public.quotations q
      join public.rfqs r on r.id = q.rfq_id
      where q.id = quotation_id and (r.user_id = auth.uid()
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
    )
  );
create policy "invoices_staff_write" on public.invoices for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- Suppliers + price lists
-- ============================================
create table if not exists public.suppliers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  lead_time_days int default 7,
  notes text,
  active boolean default true,
  created_at timestamptz default now()
);
alter table public.suppliers enable row level security;
create policy "suppliers_staff_all" on public.suppliers for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

create table if not exists public.supplier_prices (
  id uuid default uuid_generate_v4() primary key,
  supplier_id uuid references public.suppliers(id) on delete cascade not null,
  item_name text not null,
  unit text default 'pcs',
  price numeric(12,2) not null,
  currency text default 'SAR',
  updated_at timestamptz default now()
);
alter table public.supplier_prices enable row level security;
create policy "supplier_prices_staff_all" on public.supplier_prices for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- Audit log
-- ============================================
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb default '{}'::jsonb,
  ip text,
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "audit_admin_only" on public.audit_logs for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "audit_insert_authed" on public.audit_logs for insert
  with check (auth.uid() is not null);

-- ============================================
-- Testimonials (CMS-managed)
-- ============================================
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  company text,
  role_title text,
  content_ar text not null,
  content_en text,
  image_url text,
  rating int default 5 check (rating >= 1 and rating <= 5),
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.testimonials enable row level security;
create policy "testimonials_public_read" on public.testimonials for select using (published = true);
create policy "testimonials_admin_write" on public.testimonials for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- Case studies (CMS-managed)
-- ============================================
create table if not exists public.case_studies (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title_ar text not null,
  title_en text,
  excerpt_ar text,
  excerpt_en text,
  content_ar text,
  content_en text,
  cover_image text,
  images text[] default '{}',
  stats jsonb default '[]'::jsonb,
  service_key text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);
alter table public.case_studies enable row level security;
create policy "case_studies_public_read" on public.case_studies for select using (published = true);
create policy "case_studies_admin_write" on public.case_studies for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- FAQs (CMS-managed)
-- ============================================
create table if not exists public.faqs (
  id uuid default uuid_generate_v4() primary key,
  question_ar text not null,
  question_en text,
  answer_ar text not null,
  answer_en text,
  category text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);
alter table public.faqs enable row level security;
create policy "faqs_public_read" on public.faqs for select using (published = true);
create policy "faqs_admin_write" on public.faqs for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

-- ============================================
-- Indexes
-- ============================================
create index if not exists idx_quotations_rfq on public.quotations(rfq_id);
create index if not exists idx_invoices_quotation on public.invoices(quotation_id);
create index if not exists idx_supplier_prices_supplier on public.supplier_prices(supplier_id);
create index if not exists idx_audit_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);
create index if not exists idx_case_studies_slug on public.case_studies(slug);

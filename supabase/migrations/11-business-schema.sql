-- ============================================================
-- EAST PLUS — Business Schema v2
-- Run AFTER 10-complete-schema.sql
-- quotations, invoices, suppliers, audit_logs, CMS tables,
-- RPC functions for KPIs
-- ============================================================

-- ============================================================
-- 1. QUOTATIONS
-- ============================================================
create table if not exists public.quotations (
  id          uuid default uuid_generate_v4() primary key,
  rfq_id      uuid references public.rfqs(id) on delete cascade not null,
  staff_id    uuid references public.profiles(id) on delete set null,
  number      text unique,       -- e.g. QT-2026-0001
  subtotal    numeric(14,2) not null default 0,
  vat_rate    numeric(5,4) not null default 0.15,
  vat_amount  numeric(14,2) generated always as (subtotal * vat_rate) stored,
  total       numeric(14,2) generated always as (subtotal * (1 + vat_rate)) stored,
  currency    text not null default 'SAR',
  notes       text,
  pdf_url     text,
  status      text not null default 'draft'
                check (status in ('draft','sent','accepted','rejected','expired')),
  valid_until date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.quotations enable row level security;
create policy "quotations_select" on public.quotations for select using (
  exists (select 1 from public.rfqs r
          where r.id = rfq_id
          and (r.user_id = auth.uid()
               or exists (select 1 from public.profiles _p
                          where _p.id = auth.uid() and _p.role in ('staff','admin'))))
);
create policy "quotations_staff_all" on public.quotations for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

create index if not exists idx_quotations_rfq    on public.quotations(rfq_id);
create index if not exists idx_quotations_status on public.quotations(status);

create trigger quotations_updated_at before update on public.quotations
  for each row execute function public.set_updated_at();

-- sequence for quote numbers
create sequence if not exists public.quotation_number_seq start 1;

-- auto-assign number on insert
create or replace function public.set_quotation_number()
returns trigger language plpgsql as $$
begin
  if new.number is null then
    new.number := 'QT-' || to_char(now(), 'YYYY') || '-' ||
                  lpad(nextval('public.quotation_number_seq')::text, 4, '0');
  end if;
  return new;
end;$$;

create trigger quotations_set_number before insert on public.quotations
  for each row execute function public.set_quotation_number();

-- ============================================================
-- 2. SUPPLIERS  (must exist before quotation_items FK)
-- ============================================================
create table if not exists public.suppliers (
  id              uuid default uuid_generate_v4() primary key,
  name            text not null,
  contact_name    text,
  contact_phone   text,
  contact_email   text,
  lead_time_days  int not null default 7,
  notes           text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.suppliers enable row level security;
create policy "suppliers_staff_all" on public.suppliers for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 3. SUPPLIER PRICES
-- ============================================================
create table if not exists public.supplier_prices (
  id           uuid default uuid_generate_v4() primary key,
  supplier_id  uuid references public.suppliers(id) on delete cascade not null,
  item_name    text not null,
  description  text,
  unit         text not null default 'pcs',
  price        numeric(12,2) not null,
  currency     text not null default 'SAR',
  updated_at   timestamptz not null default now()
);

alter table public.supplier_prices enable row level security;
create policy "sp_staff_all" on public.supplier_prices for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

create index if not exists idx_sp_supplier on public.supplier_prices(supplier_id);
create index if not exists idx_sp_item     on public.supplier_prices(item_name);

-- ============================================================
-- 4. QUOTATION ITEMS
-- ============================================================
create table if not exists public.quotation_items (
  id            uuid default uuid_generate_v4() primary key,
  quotation_id  uuid references public.quotations(id) on delete cascade not null,
  item_name     text not null,
  description   text,
  quantity      numeric(12,3) not null default 1,
  unit          text not null default 'pcs',
  unit_cost     numeric(14,2) not null default 0,
  margin_pct    numeric(5,2) not null default 0,
  unit_price    numeric(14,2) generated always as
                  (unit_cost * (1 + margin_pct / 100.0)) stored,
  line_total    numeric(14,2) generated always as
                  (quantity * unit_cost * (1 + margin_pct / 100.0)) stored,
  supplier_id   uuid references public.suppliers(id) on delete set null,
  sort_order    int not null default 0
);

alter table public.quotation_items enable row level security;
create policy "qi_select" on public.quotation_items for select using (
  exists (select 1 from public.quotations q
          join public.rfqs r on r.id = q.rfq_id
          where q.id = quotation_id
          and (r.user_id = auth.uid()
               or exists (select 1 from public.profiles _p
                          where _p.id = auth.uid() and _p.role in ('staff','admin'))))
);
create policy "qi_staff_all" on public.quotation_items for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

create index if not exists idx_qi_quotation on public.quotation_items(quotation_id, sort_order);

-- ============================================================
-- 5. INVOICES
-- ============================================================
create table if not exists public.invoices (
  id            uuid default uuid_generate_v4() primary key,
  quotation_id  uuid references public.quotations(id) on delete cascade not null,
  number        text unique,
  zatca_uuid    text,
  total         numeric(14,2) not null default 0,
  paid_at       timestamptz,
  pdf_url       text,
  created_at    timestamptz not null default now()
);

alter table public.invoices enable row level security;
create policy "invoices_select" on public.invoices for select using (
  exists (
    select 1 from public.quotations q join public.rfqs r on r.id = q.rfq_id
    where q.id = quotation_id
    and (r.user_id = auth.uid()
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')))
  )
);
create policy "invoices_staff_all" on public.invoices for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 6. AUDIT LOGS
-- ============================================================
create table if not exists public.audit_logs (
  id          uuid default uuid_generate_v4() primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   text,
  metadata    jsonb not null default '{}'::jsonb,
  ip          text,
  created_at  timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
create policy "audit_admin_select" on public.audit_logs for select
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role = 'admin'));
create policy "audit_insert" on public.audit_logs for insert
  with check (auth.uid() is not null);

create index if not exists idx_audit_actor   on public.audit_logs(actor_id);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);
create index if not exists idx_audit_target  on public.audit_logs(target_type, target_id);

-- ============================================================
-- 7. TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  company     text,
  role_title  text,
  content_ar  text not null,
  content_en  text,
  image_url   text,
  rating      int check (rating between 1 and 5) default 5,
  published   boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.testimonials enable row level security;
create policy "testi_select_pub" on public.testimonials for select
  using (published = true
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "testi_staff_all" on public.testimonials for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 8. CASE STUDIES
-- ============================================================
create table if not exists public.case_studies (
  id           uuid default uuid_generate_v4() primary key,
  slug         text unique not null,
  title_ar     text not null,
  title_en     text,
  excerpt_ar   text not null default '',
  excerpt_en   text,
  content_ar   text not null default '',
  content_en   text,
  cover_image  text,
  images       text[] default '{}',
  stats        jsonb default '[]'::jsonb,
  service_key  text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.case_studies enable row level security;
create policy "cs_select_pub" on public.case_studies for select
  using (published = true
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "cs_staff_all" on public.case_studies for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 9. FAQS
-- ============================================================
create table if not exists public.faqs (
  id          uuid default uuid_generate_v4() primary key,
  question_ar text not null,
  question_en text,
  answer_ar   text not null,
  answer_en   text,
  category    text not null default 'general',
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.faqs enable row level security;
create policy "faqs_select_pub" on public.faqs for select
  using (published = true
         or exists (select 1 from public.profiles _p
                    where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "faqs_staff_all" on public.faqs for all
  using (exists (select 1 from public.profiles _p
                 where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p
                      where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 10. CLIENTS LOGOS
-- ============================================================
create table if not exists public.clients_logos (
  id         uuid default uuid_generate_v4() primary key,
  name       text not null,
  logo_url   text,
  link_url   text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.clients_logos enable row level security;
create policy "cl_select_pub" on public.clients_logos for select using (published = true or exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "cl_staff_all"  on public.clients_logos for all
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 11. GALLERY ITEMS
-- ============================================================
create table if not exists public.gallery_items (
  id          uuid default uuid_generate_v4() primary key,
  title_ar    text not null,
  title_en    text,
  image_url   text not null,
  category    text not null default 'general',
  project_url text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.gallery_items enable row level security;
create policy "gi_select_pub" on public.gallery_items for select using (published = true or exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "gi_staff_all"  on public.gallery_items for all
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- ============================================================
-- 12. EMAIL TEMPLATES
-- ============================================================
create table if not exists public.email_templates (
  id           uuid default uuid_generate_v4() primary key,
  key          text unique not null,
  subject_ar   text not null,
  subject_en   text not null,
  body_ar      text not null,
  body_en      text not null,
  variables    jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.email_templates enable row level security;
create policy "et_admin_all" on public.email_templates for all
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role = 'admin'))
  with check (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role = 'admin'));
create policy "et_staff_select" on public.email_templates for select
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));

create trigger et_updated_at before update on public.email_templates
  for each row execute function public.set_updated_at();

-- ============================================================
-- 13. SETTINGS (key-value store for admin config)
-- ============================================================
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;
create policy "settings_admin_all" on public.settings for all
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role = 'admin'))
  with check (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role = 'admin'));
create policy "settings_staff_select" on public.settings for select
  using (exists (select 1 from public.profiles _p where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- Seed default settings
insert into public.settings (key, value) values
  ('vat_rate',       '{"value": 0.15}'),
  ('currency',       '{"value": "SAR", "symbol": "ر.س"}'),
  ('company_name',   '{"ar": "إيست بلس للتجارة", "en": "EAST PLUS Trading"}'),
  ('working_hours',  '{"sun_thu": "08:00-18:00", "sat": "09:00-14:00"}'),
  ('rfq_sla_hours',  '{"fast": 24, "normal": 48, "project": 72}')
on conflict (key) do nothing;

-- ============================================================
-- 14. RPC FUNCTIONS
-- ============================================================

-- User KPIs
create or replace function public.get_user_kpis(p_user_id uuid)
returns jsonb language sql stable security definer as $$
  select jsonb_build_object(
    'active_rfqs',     count(*) filter (where status not in ('closed')),
    'pending_quotes',  count(*) filter (where status = 'quoted'),
    'accepted_quotes', (
      select count(*) from public.quotations q
      join public.rfqs r2 on r2.id = q.rfq_id
      where r2.user_id = p_user_id and q.status = 'accepted'
    ),
    'total_rfqs',      count(*)
  )
  from public.rfqs where user_id = p_user_id and deleted_at is null;
$$;

-- Staff KPIs
create or replace function public.get_staff_kpis(p_staff_id uuid)
returns jsonb language sql stable security definer as $$
  select jsonb_build_object(
    'assigned_count',   count(*) filter (where status not in ('closed')),
    'closed_count',     count(*) filter (where status = 'closed'),
    'conversion_rate',  case when count(*) > 0
                        then round(count(*) filter (where status = 'closed')::numeric / count(*) * 100, 1)
                        else 0 end,
    'avg_response_h',   round(avg(extract(epoch from (updated_at - created_at))/3600)
                              filter (where status != 'new'), 1)
  )
  from public.rfqs where assigned_to = p_staff_id and deleted_at is null;
$$;

-- Admin overview (last 30 days)
create or replace function public.get_admin_overview()
returns jsonb language sql stable security definer as $$
  select jsonb_build_object(
    'total_rfqs_30d',   (select count(*) from public.rfqs
                         where created_at > now() - interval '30 days' and deleted_at is null),
    'new_rfqs',         (select count(*) from public.rfqs
                         where status = 'new' and deleted_at is null),
    'conversion_rate',  (select case when count(*) > 0
                                then round(count(*) filter (where status = 'closed')::numeric / count(*) * 100, 1)
                                else 0 end from public.rfqs where deleted_at is null),
    'active_staff',     (select count(*) from public.profiles
                         where role in ('staff','admin')),
    'revenue_30d',      coalesce((select sum(total) from public.quotations
                                  where status = 'accepted'
                                  and created_at > now() - interval '30 days'), 0),
    'rfqs_by_service',  (select jsonb_agg(row_to_json(x)) from (
                           select service_key, count(*) as cnt
                           from public.rfqs
                           where deleted_at is null and service_key is not null
                           group by service_key order by cnt desc
                         ) x),
    'rfqs_by_status',   (select jsonb_agg(row_to_json(x)) from (
                           select status, count(*) as cnt
                           from public.rfqs where deleted_at is null
                           group by status
                         ) x),
    'daily_rfqs_30d',   (select jsonb_agg(row_to_json(x)) from (
                           select date_trunc('day', created_at)::date as day, count(*) as cnt
                           from public.rfqs
                           where created_at > now() - interval '30 days' and deleted_at is null
                           group by 1 order by 1
                         ) x)
  );
$$;

-- Assign RFQ (writes timeline + notification)
create or replace function public.assign_rfq(p_rfq_id uuid, p_staff_id uuid)
returns void language plpgsql security definer as $$
declare
  v_rfq public.rfqs;
  v_staff public.profiles;
begin
  select * into v_rfq from public.rfqs where id = p_rfq_id;
  select * into v_staff from public.profiles where id = p_staff_id;

  if v_rfq.id is null then raise exception 'RFQ not found'; end if;
  if v_staff.id is null or v_staff.role not in ('staff','admin')
    then raise exception 'Invalid staff member'; end if;

  update public.rfqs set assigned_to = p_staff_id, status = 'assigned',
         updated_at = now()
  where id = p_rfq_id;

  insert into public.rfq_timeline (rfq_id, action, details, created_by)
  values (p_rfq_id, 'assigned',
          'تم تعيين الطلب إلى ' || v_staff.company_name,
          auth.uid());

  insert into public.notifications (user_id, title, message, type, priority, link)
  values (v_rfq.user_id,
          'تم تعيين موظف لطلبك',
          'سيتواصل معك فريق العمل قريباً',
          'rfq_update', 'normal',
          '/dashboard/rfqs/' || p_rfq_id);
end;$$;

-- Realtime additions for quotations + timeline
alter publication supabase_realtime add table public.quotations;

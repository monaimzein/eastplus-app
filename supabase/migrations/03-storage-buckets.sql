-- ============================================
-- Phase 1 — Storage buckets for user uploads
-- ============================================
-- Run after 02-dashboard-tables.sql

-- Avatars: public read, authenticated write own
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RFQ files: private, staff/admin or owning user can read
insert into storage.buckets (id, name, public)
values ('rfq-files', 'rfq-files', false)
on conflict (id) do nothing;

-- Quotation PDFs: private, signed URLs only
insert into storage.buckets (id, name, public)
values ('quotations', 'quotations', false)
on conflict (id) do nothing;

-- Blog & CMS images: public
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- ============================================
-- Storage policies
-- ============================================

-- Avatars: anyone can read, authenticated users can upload to their own folder
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_authed_write" on storage.objects;
create policy "avatars_authed_write" on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- RFQ files: owner of RFQ + staff/admin can read; only owner can upload
drop policy if exists "rfq_files_read" on storage.objects;
create policy "rfq_files_read" on storage.objects for select
  using (
    bucket_id = 'rfq-files'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role in ('staff','admin')
      )
    )
  );

drop policy if exists "rfq_files_write" on storage.objects;
create policy "rfq_files_write" on storage.objects for insert
  with check (
    bucket_id = 'rfq-files'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "rfq_files_delete" on storage.objects;
create policy "rfq_files_delete" on storage.objects for delete
  using (
    bucket_id = 'rfq-files'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );

-- Quotations: only staff/admin can write; owners + staff/admin can read
drop policy if exists "quotations_read" on storage.objects;
create policy "quotations_read" on storage.objects for select
  using (
    bucket_id = 'quotations'
    and (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role in ('staff','admin')
      )
      or exists (
        select 1 from public.quotations q
        join public.rfqs r on r.id = q.rfq_id
        where q.pdf_url like '%' || name || '%' and r.user_id = auth.uid()
      )
    )
  );

drop policy if exists "quotations_staff_write" on storage.objects;
create policy "quotations_staff_write" on storage.objects for insert
  with check (
    bucket_id = 'quotations'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('staff','admin')
    )
  );

-- Blog & gallery images: public read, admin/staff write
drop policy if exists "cms_images_public_read" on storage.objects;
create policy "cms_images_public_read" on storage.objects for select
  using (bucket_id in ('blog-images','gallery'));

drop policy if exists "cms_images_staff_write" on storage.objects;
create policy "cms_images_staff_write" on storage.objects for insert
  with check (
    bucket_id in ('blog-images','gallery')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('staff','admin')
    )
  );

drop policy if exists "cms_images_staff_update" on storage.objects;
create policy "cms_images_staff_update" on storage.objects for update
  using (
    bucket_id in ('blog-images','gallery')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('staff','admin')
    )
  );

drop policy if exists "cms_images_staff_delete" on storage.objects;
create policy "cms_images_staff_delete" on storage.objects for delete
  using (
    bucket_id in ('blog-images','gallery')
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('staff','admin')
    )
  );

-- ============================================================
-- EAST PLUS — Storage Buckets v2
-- Run AFTER 11-business-schema.sql
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',      'avatars',      true,  5242880,
   array['image/jpeg','image/png','image/webp','image/gif']),
  ('rfq-files',    'rfq-files',    false, 52428800,
   array['image/jpeg','image/png','image/webp','application/pdf',
         'application/vnd.ms-excel',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('quotations',   'quotations',   false, 10485760, array['application/pdf']),
  ('blog-images',  'blog-images',  true,  10485760,
   array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('gallery',      'gallery',      true,  20971520,
   array['image/jpeg','image/png','image/webp']),
  ('chat-files',   'chat-files',   false, 20971520,
   array['image/jpeg','image/png','image/webp','application/pdf']),
  ('certificates', 'certificates', true,  10485760,
   array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

-- ============================================================
-- Storage Policies
-- ============================================================

-- AVATARS: public read, user writes own folder
drop policy if exists "avatars_public_read"    on storage.objects;
drop policy if exists "avatars_authed_write"   on storage.objects;
drop policy if exists "avatars_owner_update"   on storage.objects;
drop policy if exists "avatars_owner_delete"   on storage.objects;

create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars_authed_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() is not null
              and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- RFQ FILES: owner + staff/admin read; owner write
drop policy if exists "rfq_files_read"  on storage.objects;
drop policy if exists "rfq_files_write" on storage.objects;
drop policy if exists "rfq_files_del"   on storage.objects;

create policy "rfq_files_read" on storage.objects for select
  using (bucket_id = 'rfq-files' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (select 1 from public.profiles _p
               where _p.id = auth.uid() and _p.role in ('staff','admin'))
  ));
create policy "rfq_files_write" on storage.objects for insert
  with check (bucket_id = 'rfq-files' and auth.uid() is not null
              and (storage.foldername(name))[1] = auth.uid()::text);
create policy "rfq_files_del" on storage.objects for delete
  using (bucket_id = 'rfq-files' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (select 1 from public.profiles _p
               where _p.id = auth.uid() and _p.role = 'admin')
  ));

-- QUOTATIONS: staff/admin write; owner + staff/admin read
drop policy if exists "quot_read"        on storage.objects;
drop policy if exists "quot_staff_write" on storage.objects;

create policy "quot_read" on storage.objects for select
  using (bucket_id = 'quotations' and (
    exists (select 1 from public.profiles _p
            where _p.id = auth.uid() and _p.role in ('staff','admin'))
    or exists (
      select 1 from public.quotations q join public.rfqs r on r.id = q.rfq_id
      where q.pdf_url like '%' || name || '%' and r.user_id = auth.uid()
    )
  ));
create policy "quot_staff_write" on storage.objects for insert
  with check (bucket_id = 'quotations'
              and exists (select 1 from public.profiles _p
                          where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- BLOG IMAGES + GALLERY + CERTIFICATES: public read, staff/admin write
drop policy if exists "cms_public_read"   on storage.objects;
drop policy if exists "cms_staff_write"   on storage.objects;
drop policy if exists "cms_staff_update"  on storage.objects;
drop policy if exists "cms_staff_delete"  on storage.objects;

create policy "cms_public_read" on storage.objects for select
  using (bucket_id in ('blog-images','gallery','certificates'));
create policy "cms_staff_write" on storage.objects for insert
  with check (bucket_id in ('blog-images','gallery','certificates')
              and exists (select 1 from public.profiles _p
                          where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "cms_staff_update" on storage.objects for update
  using (bucket_id in ('blog-images','gallery','certificates')
         and exists (select 1 from public.profiles _p
                     where _p.id = auth.uid() and _p.role in ('staff','admin')));
create policy "cms_staff_delete" on storage.objects for delete
  using (bucket_id in ('blog-images','gallery','certificates')
         and exists (select 1 from public.profiles _p
                     where _p.id = auth.uid() and _p.role in ('staff','admin')));

-- CHAT FILES: RFQ participants
drop policy if exists "chat_files_read"  on storage.objects;
drop policy if exists "chat_files_write" on storage.objects;

create policy "chat_files_read" on storage.objects for select
  using (bucket_id = 'chat-files' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (select 1 from public.profiles _p
               where _p.id = auth.uid() and _p.role in ('staff','admin'))
  ));
create policy "chat_files_write" on storage.objects for insert
  with check (bucket_id = 'chat-files' and auth.uid() is not null
              and (storage.foldername(name))[1] = auth.uid()::text);

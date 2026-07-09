-- ============================================================
-- EAST PLUS — Seed Data
-- Run AFTER all migrations. Uses fixed UUIDs + creates auth.users
-- directly so the profiles FK is satisfied.
-- ============================================================

-- ============================================================
-- 0. CREATE AUTH USERS (bypasses email confirmation for seeding)
-- ============================================================
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'admin@eastplus.sa',
   crypt('Admin@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'staff1@eastplus.sa',
   crypt('Staff@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'staff2@eastplus.sa',
   crypt('Staff@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'client1@company.sa',
   crypt('Client@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'client2@company.sa',
   crypt('Client@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'client3@company.sa',
   crypt('Client@123456', gen_salt('bf')),
   now(), now(),
   '{"provider":"email","providers":["email"]}', '{}',
   now(), now(), '', '', '', '')
on conflict (id) do nothing;

-- Also insert into auth.identities so login works
insert into auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000001', 'admin@eastplus.sa',   '00000000-0000-0000-0000-000000000001', '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@eastplus.sa"}',   'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'staff1@eastplus.sa',  '00000000-0000-0000-0000-000000000002', '{"sub":"00000000-0000-0000-0000-000000000002","email":"staff1@eastplus.sa"}',  'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'staff2@eastplus.sa',  '00000000-0000-0000-0000-000000000003', '{"sub":"00000000-0000-0000-0000-000000000003","email":"staff2@eastplus.sa"}',  'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000004', 'client1@company.sa', '00000000-0000-0000-0000-000000000004', '{"sub":"00000000-0000-0000-0000-000000000004","email":"client1@company.sa"}', 'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000005', 'client2@company.sa', '00000000-0000-0000-0000-000000000005', '{"sub":"00000000-0000-0000-0000-000000000005","email":"client2@company.sa"}', 'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000006', 'client3@company.sa', '00000000-0000-0000-0000-000000000006', '{"sub":"00000000-0000-0000-0000-000000000006","email":"client3@company.sa"}', 'email', now(), now(), now())
on conflict (provider, provider_id) do nothing;

insert into public.profiles (id, email, company_name, phone, whatsapp_number, role, language, theme) values
  ('00000000-0000-0000-0000-000000000001','admin@eastplus.sa',  'EAST PLUS Trading', '+966501000001', '+966501000001', 'admin', 'ar', 'dark'),
  ('00000000-0000-0000-0000-000000000002','staff1@eastplus.sa', 'موظف: أحمد العمري',  '+966501000002', '+966501000002', 'staff', 'ar', 'dark'),
  ('00000000-0000-0000-0000-000000000003','staff2@eastplus.sa', 'موظف: سارة المطيري', '+966501000003', '+966501000003', 'staff', 'ar', 'light'),
  ('00000000-0000-0000-0000-000000000004','client1@company.sa', 'شركة الإنشاء الحديث','+966501000004', '+966501000004', 'user',  'ar', 'dark'),
  ('00000000-0000-0000-0000-000000000005','client2@company.sa', 'مقاولات الخليج',      '+966501000005', '+966501000005', 'user',  'ar', 'dark'),
  ('00000000-0000-0000-0000-000000000006','client3@company.sa', 'شركة البناء المتطور', '+966501000006', '+966501000006', 'user',  'en', 'light')
on conflict (id) do update set
  email = excluded.email, company_name = excluded.company_name,
  role = excluded.role;

-- Suppliers
insert into public.suppliers (id, name, contact_name, contact_phone, lead_time_days, active) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'شركة الخليج للسباكة',     'علي حسين',    '+966500111001', 3,  true),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'مؤسسة النور للكهرباء',    'محمد صالح',   '+966500111002', 5,  true),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'الشركة العربية للعزل',    'خالد العتيبي','+966500111003', 7,  true),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'مخازن البناء الشاملة',    'فيصل الزهراني','+966500111004', 2, true)
on conflict (id) do nothing;

-- Supplier prices
insert into public.supplier_prices (supplier_id, item_name, unit, price) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'أنبوب PPR 20mm', 'م', 12.50),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'أنبوب PPR 25mm', 'م', 18.00),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'وصلة كوع 90°', 'حبة', 4.50),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'حنفية مطبخ كروم', 'حبة', 185.00),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'كابل كهربائي 2.5mm²', 'م', 8.75),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'كابل كهربائي 4mm²', 'م', 13.20),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'قاطع دورة 16A', 'حبة', 32.00),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'لوحة كهربائية 12 خط', 'حبة', 480.00),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'لوح فوم عازل 5cm', 'م²', 45.00),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'رغوة بولي يوريثان', 'كجم', 28.00),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'أسمنت پورتلاند 50كجم', 'كيس', 26.00),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'حديد تسليح 12mm', 'طن', 3800.00);

-- RFQs
insert into public.rfqs (id, user_id, assigned_to, title, description, service_key, priority, status, location, budget_max, created_at) values
  ('bbbbbbbb-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   'تركيب شبكة سباكة مبنى سكني',
   'مبنى من 4 طوابق يحتاج تركيب شبكة مياه كاملة. المساحة الإجمالية 800م²',
   'plumbing', 'normal', 'in_progress', 'الرياض - حي النزهة', 45000, now() - interval '5 days'),

  ('bbbbbbbb-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000003',
   'توريد وتركيب لوحات كهربائية',
   'محطة تحويل كهربائية لمجمع تجاري. 3 لوحات رئيسية + 12 لوحة فرعية',
   'electrical', 'fast', 'quoted', 'جدة - المنطقة الصناعية', 120000, now() - interval '3 days'),

  ('bbbbbbbb-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000006',
   null,
   'عزل أسطح منازل متعددة',
   'عزل حراري ومائي لـ5 منازل. المساحة الإجمالية 1200م²',
   'insulation', 'normal', 'new', 'الدمام - حي الفيصلية', 85000, now() - interval '1 day'),

  ('bbbbbbbb-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   'توريد أدوات صحية لمشروع سكني',
   'توريد وتركيب كامل لـ20 حمام: مرحاض + مغسلة + دش + حوض استحمام',
   'sanitary', 'project', 'closed', 'الرياض - حي الملقا', 200000, now() - interval '30 days'),

  ('bbbbbbbb-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000003',
   'صيانة شاملة لمصنع',
   'صيانة دورية لجميع الأنظمة الكهربائية والميكانيكية والسباكة في مصنع بمساحة 5000م²',
   'maintenance', 'project', 'in_progress', 'جدة - المنطقة الصناعية الثانية', 300000, now() - interval '10 days'),

  ('bbbbbbbb-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000006',
   null,
   'إنشاء مبنى إداري جديد',
   'تشطيب كامل لمبنى إداري من طابقين. مساحة 600م². يشمل الكهرباء والسباكة والديكور',
   'construction', 'project', 'new', 'الرياض - حي العليا', 850000, now() - interval '2 days'),

  ('bbbbbbbb-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   'تمديدات كهربائية فيلا',
   'تمديدات كهربائية كاملة لفيلا 4 غرف + ملحق',
   'electrical', 'normal', 'assigned', 'الرياض - حي الشفا', 35000, now() - interval '2 days'),

  ('bbbbbbbb-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000002',
   'مشروع سباكة مجمع تجاري',
   'شبكة مياه وصرف صحي لمجمع تجاري من 3 طوابق. 45 محل تجاري',
   'plumbing', 'project', 'negotiation', 'جدة - شارع التحلية', 180000, now() - interval '15 days'),

  ('bbbbbbbb-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000003',
   'تركيب نظام طاقة شمسية',
   'تركيب 40 لوح طاقة شمسية + inverter + بطاريات لمجمع سكني',
   'electrical', 'project', 'quoted', 'الدمام - حي الأمانة', 220000, now() - interval '7 days'),

  ('bbbbbbbb-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000004',
   null,
   'توريد مواد بناء للمشروع السكني',
   'توريد أسمنت وحديد وطوب لمشروع سكني من 8 وحدات',
   'construction', 'fast', 'new', 'الرياض - حي الصحافة', 95000, now() - interval '4 hours')
on conflict (id) do nothing;

-- Quotations (for the quoted/negotiation RFQs)
insert into public.quotations (id, rfq_id, staff_id, subtotal, notes, status, valid_until) values
  ('cccccccc-0000-0000-0000-000000000001',
   'bbbbbbbb-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000003',
   95000, 'يشمل توريد جميع المواد والتركيب والضمان لمدة سنة', 'sent',
   (now() + interval '30 days')::date),

  ('cccccccc-0000-0000-0000-000000000002',
   'bbbbbbbb-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   165000, 'تم التسليم بنجاح. ضمان الأعمال 2 سنة', 'accepted',
   (now() - interval '15 days')::date),

  ('cccccccc-0000-0000-0000-000000000003',
   'bbbbbbbb-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000002',
   148000, 'السعر قابل للتعديل حسب المواصفات النهائية', 'sent',
   (now() + interval '14 days')::date),

  ('cccccccc-0000-0000-0000-000000000004',
   'bbbbbbbb-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000003',
   190000, 'يشمل خمس سنوات صيانة مجانية', 'sent',
   (now() + interval '21 days')::date)
on conflict (id) do nothing;

-- Quotation items for quotation 1
insert into public.quotation_items (quotation_id, item_name, unit, quantity, unit_cost, margin_pct, sort_order) values
  ('cccccccc-0000-0000-0000-000000000001', 'لوحة كهربائية رئيسية 200A', 'حبة', 3, 8500, 20, 1),
  ('cccccccc-0000-0000-0000-000000000001', 'لوحة كهربائية فرعية 12 خط', 'حبة', 12, 450, 25, 2),
  ('cccccccc-0000-0000-0000-000000000001', 'كابل NYY 4×16mm²', 'م', 200, 85, 18, 3),
  ('cccccccc-0000-0000-0000-000000000001', 'أعمال تركيب وتوصيل', 'يوم عمل', 15, 1200, 15, 4)
on conflict (id) do nothing;

-- RFQ Timeline entries
insert into public.rfq_timeline (rfq_id, action, details, is_internal, created_by) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'تقديم الطلب', 'تم استلام طلب عرض السعر',        false, '00000000-0000-0000-0000-000000000004'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'تعيين موظف', 'تم التعيين إلى أحمد العمري',      false, '00000000-0000-0000-0000-000000000001'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'بدء التنفيذ', 'بدأ الموظف في دراسة المتطلبات', false, '00000000-0000-0000-0000-000000000002'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'ملاحظة داخلية','العميل يحتاج تأكيد المقاس',   true,  '00000000-0000-0000-0000-000000000002'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'تقديم الطلب', 'تم استلام الطلب',               false, '00000000-0000-0000-0000-000000000005'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'إرسال عرض سعر', 'تم إرسال عرض السعر QT-2026-0001', false, '00000000-0000-0000-0000-000000000003'),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'إغلاق الطلب', 'تم قبول عرض السعر وإنجاز المشروع بنجاح', false, '00000000-0000-0000-0000-000000000001');

-- Chat messages
insert into public.chat_messages (rfq_id, sender_id, content) values
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'أريد التأكد من أن الأنابيب ستكون من نوع PPR وليس PVC'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'نعم، سنستخدم PPR German standard. هل لديك متطلبات خاصة للضغط؟'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'يجب أن يتحمل 16 بار على الأقل'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ممتاز، سنستخدم PPR PN20 وهو يتحمل 20 بار. سأرفق spec sheet قريباً');

-- Notifications
insert into public.notifications (user_id, title, message, type, priority, is_read, link) values
  ('00000000-0000-0000-0000-000000000004', 'طلبك تحت المراجعة', 'يقوم الفريق الآن بدراسة طلبك رقم #001', 'rfq_update', 'normal', false, '/dashboard/rfqs/bbbbbbbb-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000005', 'تم إرسال عرض السعر', 'يمكنك الاطلاع على عرض السعر الآن', 'quotation', 'high', false, '/dashboard/rfqs/bbbbbbbb-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', 'طلب جديد يحتاج مراجعة', 'طلب مشروع إنشاء مبنى إداري - الأولوية: مشروع', 'rfq_update', 'normal', false, '/staff/rfqs/bbbbbbbb-0000-0000-0000-000000000006'),
  ('00000000-0000-0000-0000-000000000001', 'طلبات جديدة اليوم', '3 طلبات جديدة بانتظار التعيين', 'system', 'normal', true, '/admin/rfqs');

-- Testimonials
insert into public.testimonials (name, company, role_title, content_ar, content_en, rating, published, sort_order) values
  ('م. خالد العتيبي', 'شركة الخليج للإنشاء', 'مدير المشاريع',
   'تعاملنا مع إيست بلس في مشروع ضخم لتوريد مواد البناء. الالتزام بالمواعيد والجودة العالية أدهشانا حقاً.',
   'We worked with EAST PLUS on a large construction project. Their commitment to deadlines and high quality truly impressed us.',
   5, true, 1),
  ('إنجنيرة سارة المالكي', 'مكتب الحلول الهندسية', 'مهندسة كهربائية',
   'إيست بلس هو شريكنا الأول في توريد المواد الكهربائية. أسعار تنافسية وخدمة احترافية.',
   'EAST PLUS is our first choice for electrical materials sourcing. Competitive prices and professional service.',
   5, true, 2),
  ('عبدالرحمن القحطاني', 'مجموعة البناء الحديث', 'المدير التنفيذي',
   'منصة RFQ الخاصة بهم سهّلت علينا عملية طلب العروض بشكل كبير. نوصي بها لكل مقاول.',
   'Their RFQ platform greatly simplified our procurement process. We recommend it to every contractor.',
   5, true, 3),
  ('م. فهد النعيمي', 'شركة المستقبل للمقاولات', 'رئيس قسم المشتريات',
   'سرعة الاستجابة ودقة العروض المقدمة من إيست بلس تجعلهم الخيار الأمثل لأي مشروع.',
   'EAST PLUSs speed and accuracy in quotations make them the optimal choice for any project.',
   4, true, 4),
  ('المهندس وليد السبيعي', 'استشارات البناء المتكاملة', 'استشاري',
   'خبرة واسعة في السوق السعودي وعلاقات ممتازة مع الموردين. وفروا علينا 20% من تكاليف المواد.',
   'Extensive experience in the Saudi market and excellent supplier relationships. They saved us 20% on material costs.',
   5, true, 5),
  ('شركة القدس للتطوير', 'مجموعة القدس', 'إدارة المشتريات',
   'التزموا بتوريد أكثر من 500 طن من مواد البناء في وقت قياسي. شركاء موثوقون.',
   'They committed to delivering over 500 tons of construction materials in record time. Reliable partners.',
   5, true, 6);

-- Case Studies
insert into public.case_studies (slug, title_ar, title_en, excerpt_ar, excerpt_en, stats, service_key, published, published_at) values
  ('riyadh-residential-complex',
   'مجمع سكني الرياض — 200 وحدة',
   'Riyadh Residential Complex — 200 Units',
   'توريد وتركيب كامل لأنظمة السباكة والكهرباء والتكييف لمجمع سكني ضخم.',
   'Full supply and installation of plumbing, electrical and HVAC systems for a large residential complex.',
   '[{"label_ar":"وحدة سكنية","label_en":"Residential Units","value":"200"},{"label_ar":"مدة التنفيذ","label_en":"Duration","value":"8 أشهر"},{"label_ar":"توفير التكلفة","label_en":"Cost Saving","value":"18%"}]',
   'plumbing', true, now() - interval '60 days'),
  ('jeddah-industrial-zone',
   'منطقة جدة الصناعية — بنية تحتية كهربائية',
   'Jeddah Industrial Zone — Electrical Infrastructure',
   'تصميم وتنفيذ البنية التحتية الكهربائية لـ15 مصنعاً في المنطقة الصناعية.',
   'Design and implementation of electrical infrastructure for 15 factories in the industrial zone.',
   '[{"label_ar":"مصنع","label_en":"Factories","value":"15"},{"label_ar":"قدرة إجمالية","label_en":"Total Capacity","value":"2.4 MW"},{"label_ar":"مدة التنفيذ","label_en":"Duration","value":"12 شهر"}]',
   'electrical', true, now() - interval '45 days'),
  ('dammam-mall-insulation',
   'مول الدمام — عزل شامل',
   'Dammam Mall — Full Insulation',
   'عزل حراري ومائي كامل لمركز تجاري بمساحة 25,000م² يشمل الأسطح والجدران.',
   'Complete thermal and waterproof insulation of a 25,000m² shopping center including roofs and walls.',
   '[{"label_ar":"مساحة العزل","label_en":"Insulated Area","value":"25,000 م²"},{"label_ar":"توفير الطاقة","label_en":"Energy Saving","value":"35%"},{"label_ar":"ضمان","label_en":"Warranty","value":"10 سنوات"}]',
   'insulation', true, now() - interval '30 days');

-- FAQs
insert into public.faqs (question_ar, question_en, answer_ar, answer_en, category, sort_order, published) values
  ('كيف أطلب عرض سعر؟',
   'How do I request a quote?',
   'يمكنك طلب عرض سعر من خلال النقر على زر "طلب عرض سعر" في أي صفحة، وملء النموذج بتفاصيل مشروعك. سيتواصل معك فريقنا خلال 24 ساعة.',
   'You can request a quote by clicking the "Request a Quote" button on any page and filling out the form with your project details. Our team will contact you within 24 hours.',
   'rfq', 1, true),
  ('ما هي المناطق التي تخدمونها؟',
   'Which areas do you serve?',
   'نخدم جميع مناطق المملكة العربية السعودية: الرياض، جدة، مكة المكرمة، المدينة المنورة، الدمام، وجميع المدن والمحافظات.',
   'We serve all regions of Saudi Arabia: Riyadh, Jeddah, Mecca, Medina, Dammam, and all cities and provinces.',
   'general', 2, true),
  ('هل تقدمون ضماناً على المواد؟',
   'Do you offer a warranty on materials?',
   'نعم، جميع المواد التي نوردها تأتي مع ضمان المصنع الأصلي. كما نقدم ضماناً إضافياً على أعمال التركيب يتراوح بين 1-3 سنوات حسب نوع العمل.',
   'Yes, all materials we supply come with the original manufacturer warranty. We also offer an additional warranty on installation work ranging from 1-3 years depending on the type of work.',
   'warranty', 3, true),
  ('ما هي طرق الدفع المتاحة؟',
   'What payment methods are available?',
   'نقبل التحويل البنكي، الشيكات، ونقاط البيع. يمكن الاتفاق على دفعات مرحلية للمشاريع الكبيرة.',
   'We accept bank transfers, checks, and point of sale. Installment payments can be arranged for large projects.',
   'payment', 4, true),
  ('كم يستغرق تسليم المواد؟',
   'How long does material delivery take?',
   'للمواد المتوفرة في المخزون: 1-2 أيام عمل. للمواد التي تحتاج طلب: 3-7 أيام حسب الكمية والنوع. للمشاريع الكبيرة نضع جدول توريد مفصّل.',
   'For materials in stock: 1-2 business days. For special orders: 3-7 days depending on quantity and type. For large projects, we provide a detailed supply schedule.',
   'delivery', 5, true),
  ('هل يمكنكم إصدار فواتير ضريبية؟',
   'Can you issue VAT invoices?',
   'نعم، نصدر فواتير ضريبية معتمدة (ZATCA) تتضمن رقم الفاتورة ورمز QR ونسبة الضريبة 15%. جميع عملياتنا متوافقة مع متطلبات هيئة الزكاة والضريبة.',
   'Yes, we issue approved VAT invoices (ZATCA) that include the invoice number, QR code, and 15% VAT. All our operations comply with ZATCA requirements.',
   'billing', 6, true),
  ('هل تقدمون خدمة التركيب أم التوريد فقط؟',
   'Do you offer installation or supply only?',
   'نقدم كلا الخدمتين: التوريد فقط (بأسعار الجملة) والتوريد مع التركيب الكامل عبر شبكة متعاقدين معتمدين.',
   'We offer both: supply only (at wholesale prices) and supply with full installation through our network of approved contractors.',
   'services', 7, true),
  ('كيف أتابع حالة طلبي؟',
   'How do I track my order status?',
   'بعد تسجيل الدخول، ستجد في لوحة التحكم قسم "طلبات الأسعار" حيث يمكنك متابعة حالة طلبك بالتفصيل وتلقي إشعارات فورية عند أي تحديث.',
   'After logging in, you will find the "Quote Requests" section in the dashboard where you can track your order status in detail and receive instant notifications on any update.',
   'rfq', 8, true);

-- Blog posts seed
insert into public.blog_posts (slug, title, excerpt, content, title_en, excerpt_en, content_en, category, category_en, published, published_at, author_id) values
  ('plumbing-guide-2026',
   'دليل اختيار أنابيب السباكة المثالية لمشروعك',
   'تعرّف على الفروق الجوهرية بين أنواع الأنابيب المختلفة وكيف تختار الأنسب لمشروعك.',
   '<h2>أنواع الأنابيب</h2><p>تتعدد أنواع الأنابيب المستخدمة في مشاريع السباكة، ولكل نوع خصائصه ومزاياه...</p>',
   'The Complete Guide to Choosing Plumbing Pipes for Your Project',
   'Learn the fundamental differences between pipe types and how to choose the right one for your project.',
   '<h2>Types of Pipes</h2><p>There are many types of pipes used in plumbing projects, each with its own characteristics...</p>',
   'سباكة', 'Plumbing', true, now() - interval '20 days',
   '00000000-0000-0000-0000-000000000001'),

  ('electrical-safety-tips',
   '10 نصائح أمان لا تتجاهلها في مشاريع الكهرباء',
   'السلامة الكهربائية أولاً — تعرّف على أهم الاشتراطات والمعايير الدولية.',
   '<h2>أهمية السلامة</h2><p>الحوادث الكهربائية من أخطر المشكلات في البناء...</p>',
   '10 Electrical Safety Tips You Cannot Ignore',
   'Electrical safety first — learn the most important international standards and requirements.',
   '<h2>Safety Importance</h2><p>Electrical accidents are among the most dangerous problems in construction...</p>',
   'كهرباء', 'Electrical', true, now() - interval '15 days',
   '00000000-0000-0000-0000-000000000001'),

  ('insulation-roi',
   'العزل الحراري: استثمار يوفّر 30% من فاتورة الكهرباء',
   'أرقام حقيقية وحسابات فعلية توضح العائد الاقتصادي لمشاريع العزل في المملكة.',
   '<h2>حسابات التوفير</h2><p>استناداً لدراسات الطاقة السعودية...</p>',
   'Thermal Insulation: An Investment That Saves 30% on Electricity',
   'Real numbers and actual calculations showing the economic return of insulation projects in Saudi Arabia.',
   '<h2>Savings Calculations</h2><p>Based on Saudi energy studies...</p>',
   'عزل', 'Insulation', true, now() - interval '10 days',
   '00000000-0000-0000-0000-000000000002');

-- Email templates
insert into public.email_templates (key, subject_ar, subject_en, body_ar, body_en, variables) values
  ('rfq_received',
   'تم استلام طلب عرض السعر #{{rfq_id}}',
   'Quote Request #{{rfq_id}} Received',
   '<p>عزيزي {{company_name}}،</p><p>تم استلام طلبك بنجاح. سيتواصل معك فريقنا خلال {{sla_hours}} ساعة.</p>',
   '<p>Dear {{company_name}},</p><p>Your request has been received. Our team will contact you within {{sla_hours}} hours.</p>',
   '["rfq_id","company_name","sla_hours"]'),
  ('quotation_sent',
   'عرض سعر جديد لطلبك #{{rfq_id}}',
   'New Quotation for Your Request #{{rfq_id}}',
   '<p>عزيزي {{company_name}}،</p><p>يسعدنا إرسال عرض السعر المطلوب. المبلغ الإجمالي: {{total}} ريال.</p>',
   '<p>Dear {{company_name}},</p><p>We are pleased to send you the requested quotation. Total amount: SAR {{total}}.</p>',
   '["rfq_id","company_name","total","valid_until","pdf_url"]'),
  ('welcome',
   'مرحباً بك في إيست بلس',
   'Welcome to EAST PLUS',
   '<p>مرحباً {{company_name}}،</p><p>يسعدنا انضمامك لمنصة إيست بلس. يمكنك الآن طلب عروض أسعار وتتبّع مشاريعك بسهولة.</p>',
   '<p>Hello {{company_name}},</p><p>Welcome to EAST PLUS. You can now request quotes and track your projects easily.</p>',
   '["company_name","login_url"]');

-- Clients logos
insert into public.clients_logos (name, sort_order, published) values
  ('الشركة السعودية للكهرباء', 1, true),
  ('أرامكو السعودية', 2, true),
  ('سابك', 3, true),
  ('الراجحي للإنشاءات', 4, true),
  ('مجموعة بن لادن', 5, true),
  ('شركة الحسينان', 6, true);


-- Extra SEO Blog Posts
insert into public.blog_posts (slug, title, excerpt, content, title_en, excerpt_en, content_en, category, category_en, published, published_at, author_id) values
  ('building-materials-supply-saudi-arabia',
   'دليل المقاولين لتوريد مواد البناء في السعودية: كيف تختار المورد المعتمد؟',
   'تعرّف على أهم المعايير لاختيار مورد معتمد لمواد البناء والتشطيب بالجملة في الرياض والمملكة العربية السعودية لضمان نجاح مشروعك الإنشائي.',
   '<h2>مقدمة في سوق التوريد الإنشائي السعودي</h2>
      <p>يشهد قطاع المقاولات والإنشاءات في المملكة العربية السعودية نمواً غير مسبوق تماشياً مع رؤية المملكة 2030. هذا النمو يتطلب شراكات قوية مع جهات موثوقة في <strong>توريد مواد بناء في السعودية</strong> لضمان تدفق المواد بالجودة المطلوبة وفي الوقت المحدد.</p>

      <h2>معايير اختيار مورد معتمد مواد بناء</h2>
      <p>عند البحث عن <strong>مورد معتمد مواد بناء</strong>، هناك عدة عوامل يجب مراعاتها لضمان سير العمل بدون معوقات:</p>
      <ul>
        <li><strong>الاعتماد والشهادات:</strong> تأكد من أن المورد مسجل رسمياً ولديه سجل تجاري ورقم ضريبي معتمد.</li>
        <li><strong>القدرة على التوريد بالجملة:</strong> يجب أن يمتلك المورد القدرة على <strong>توريد مواد بالجملة للمشاريع</strong> الضخمة والفلل السكنية دون انقطاع.</li>
        <li><strong>سرعة إصدار عروض الأسعار:</strong> الاستجابة السريعة لطلبات التسعير (BOQ) تسهم في تسريع وتيرة العمل.</li>
      </ul>

      <h2>لماذا يعتبر اختيار مورد مواد بناء بالرياض أمراً حيوياً؟</h2>
      <p>يعتبر القرب الجغرافي للمورد من موقع المشروع ميزة تنافسية كبرى. البحث عن <strong>مورد مواد بناء بالرياض</strong> يضمن لك سرعة التوصيل وتقليل تكاليف الشحن والخدمات اللوجستية، بالإضافة إلى سهولة معاينة المواد قبل التوريد الفعلي.</p>

      <h2>حلول إيست بلس للمقاولين والمطورين العقاريين</h2>
      <p>في شركة <strong>إيست بلس (EAST PLUS)</strong>، نفخر بكوننا شريكاً موثوقاً في <strong>توريد مواد بناء للمقاولين</strong> بأسعار تنافسية وخيارات مرنة تناسب الميزانيات المختلفة. نحن نوفر كافة مستلزمات البناء والتشطيب من كبار الموردين المعتمدين محلياً ودولياً.</p>',
   'Contractors Guide to Sourcing Building Materials in Saudi Arabia: How to Choose a Certified Supplier?',
   'Learn the key criteria for choosing a certified building materials supplier for wholesale sourcing in Riyadh and KSA to ensure the success of your project.',
   '<h2>Introduction to Saudi Arabia''s Sourcing Market</h2>
      <p>The contracting and construction sector in Saudi Arabia is experiencing unprecedented growth in line with Saudi Vision 2030. This growth demands strong partnerships with reliable companies for <strong>building materials supply in Saudi Arabia</strong> to ensure quality materials are delivered on time.</p>

      <h2>Criteria for Choosing a Certified Building Materials Supplier</h2>
      <p>When searching for a <strong>certified building materials supplier</strong>, keep these factors in mind:</p>
      <ul>
        <li><strong>Accreditation and Registration:</strong> Ensure the supplier is officially registered with valid commercial registration and tax certificates.</li>
        <li><strong>Wholesale Sourcing Capacity:</strong> The supplier must have the capacity to deliver <strong>wholesale materials for projects</strong> and residential villas without interruption.</li>
        <li><strong>Fast Quotation Lead Times:</strong> Quick response to Bills of Quantities (BOQ) speeds up the execution process.</li>
      </ul>

      <h2>Why Riyadh-Based Suppliers Matter</h2>
      <p>Geographical proximity of the supplier to your construction site is a major advantage. Sourcing from a <strong>building materials supplier in Riyadh</strong> ensures faster delivery, lower logistics costs, and easier material inspection before delivery.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>At <strong>EAST PLUS</strong>, we pride ourselves on being a trusted partner for <strong>building materials supply for contractors</strong>. We offer competitive pricing, high quality, and comprehensive supply options that fit various budget requirements.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '1 days', '00000000-0000-0000-0000-000000000001'),

  ('best-plumbing-pipes-fittings-supply',
   'أنواع مواسير السباكة وكيفية اختيار المورد المناسب لمشاريع الفلل والمجمعات',
   'تعرف على أفضل أنواع مواسير السباكة (PPR و PVC) وكيفية اختيار شركة توريد سباكة وكهرباء موثوقة لمشاريعك في المملكة العربية السعودية.',
   '<h2>أهمية اختيار مواسير السباكة عالية الجودة</h2>
      <p>تعد شبكة السباكة بمثابة الشرايين الحيوية لأي مبنى. إن استخدام مواد رديئة أو غير مطابقة للمواصفات قد يؤدي إلى تسريبات مكلفة وتلف الهياكل الخرسانية. لذلك، يركز المقاولون والملاك على العثور على <strong>مورد مواسير سباكة</strong> معتمد يوفر منتجات بضمانات حقيقية.</p>

      <h2>الفرق بين مواسير PPR ومواسير PVC</h2>
      <p>لكل نوع من المواسير استخدامات محددة تناسب طبيعة المياه والضغط والمكان:</p>
      <ul>
        <li><strong>مواسير PPR (بولي بروبليين):</strong> الخيار الأمثل لشبكات المياه الساخنة والباردة داخل الجدران نظراً لتحملها لدرجات الحرارة المرتفعة والضغط العالي وعمرها الافتراضي الطويل الذي يصل لخمسين عاماً.</li>
        <li><strong>مواسير PVC (بولي فينيل كلورايد):</strong> تستخدم بكثرة في شبكات الصرف الصحي وتصريف مياه الأمطار بسبب مقاومتها العالية للمواد الكيميائية وخفة وزنها وسهولة تركيبها.</li>
      </ul>

      <h2>معايير اختيار شركة توريد سباكة وكهرباء</h2>
      <p>في المشاريع السكنية والتجارية، يفضل المطورون التعامل مع <strong>شركة توريد سباكة وكهرباء</strong> متكاملة بدلاً من تشتيت الجهود بين عدة موردين. هذا التكامل يضمن:</p>
      <ul>
        <li>الحصول على أسعار تفضيلية وعروض أسعار موحدة.</li>
        <li>انسجام جدول توريد المواد مع مراحل الإنشاء المختلفة.</li>
        <li>تسهيل إجراءات مطابقة عينات المواد مع الاستشاريين.</li>
      </ul>

      <h2>توريد مضخات مياه وأنظمة التغذية الحديثة</h2>
      <p>لا يقتصر عمل السباكة على الأنابيب والتوصيلات فقط، بل يشمل أيضاً <strong>توريد مضخات مياه</strong> وحلول ضغط المياه الذكية التي تضمن تدفقاً مستمراً لكامل وحدات المبنى بأقل استهلاك للطاقة.</p>

      <h2>إيست بلس: شريككم في توريد السباكة والكهرباء</h2>
      <p>توفر شركة إيست بلس للتجارة كافة مستلزمات السباكة والكهرباء من مواسير PPR ومواسير PVC ومحابس ومضخات مياه بأعلى معايير الجودة المعتمدة في المملكة العربية السعودية.</p>',
   'Types of Plumbing Pipes and How to Choose the Right Supplier for Villa and Complex Projects',
   'Learn about the best types of plumbing pipes (PPR and PVC) and how to choose a reliable plumbing and electrical supply company in KSA.',
   '<h2>The Importance of High-Quality Plumbing Pipes</h2>
      <p>Plumbing networks are the lifelines of any building. Using substandard or non-compliant materials can lead to costly leaks and structural damage. That is why contractors focus on finding a certified <strong>plumbing pipes supplier</strong> offering genuine warranties.</p>

      <h2>The Difference Between PPR and PVC Pipes</h2>
      <p>Each pipe type has specific applications based on water temperature, pressure, and location:</p>
      <ul>
        <li><strong>PPR Pipes (Polypropylene Random Copolymer):</strong> The ideal choice for hot and cold water distribution due to high pressure resistance and a long service life of up to 50 years.</li>
        <li><strong>PVC Pipes (Polyvinyl Chloride):</strong> Widely used for drainage and rainwater systems thanks to chemical resistance, lightweight, and easy installation.</li>
      </ul>

      <h2>Choosing a Plumbing & Electrical Supply Company</h2>
      <p>In residential and commercial projects, developers prefer working with an integrated <strong>plumbing and electrical supply company</strong> to streamline sourcing. This offers:</p>
      <ul>
        <li>Special wholesale rates and consolidated invoicing.</li>
        <li>Aligned delivery schedules matching building milestones.</li>
        <li>Easier technical approvals from consultants.</li>
      </ul>

      <h2>Water Pumps Sourcing</h2>
      <p>Modern plumbing requires more than pipes; it demands the <strong>supply of water pumps</strong> and smart pressure solutions that ensure continuous water flow with minimal energy consumption.</p>

      <h2>EAST PLUS Sourcing Excellence</h2>
      <p>EAST PLUS provides a complete line of plumbing and electrical materials including PPR pipes, PVC pipes, valves, and water pumps complying with Saudi standards.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '2 days', '00000000-0000-0000-0000-000000000001'),

  ('electrical-cables-distribution-boards-supply',
   'دليل توريد المواد الكهربائية: من الكابلات واللوحات إلى قواطع الدورة وأنظمة LED',
   'دليلك لاختيار وتوريد المواد الكهربائية الإنشائية في السعودية. تعرف على مواصفات كابلات الكهرباء ولوحات التوزيع وقواطع الدورة وأنظمة الإنارة الحديثة.',
   '<h2>تأمين الطاقة بأعلى معايير السلامة</h2>
      <p>تتطلب الأعمال الكهربائية في المباني الحديثة دقة متناهية والتزاماً صارماً بمواصفات كود البناء السعودي (SBC). اختيار المواد الكهربائية الأصلية ليس مجرد تفصيل هندسي، بل هو صمام الأمان الأساسي لحماية الأرواح والممتلكات من مخاطر الالتماس الكهربائي والحرائق.</p>

      <h2>البحث عن مورد كابلات كهرباء معتمد</h2>
      <p>تمثل الكابلات البنية التحتية لنقل الكهرباء داخل المبنى. عند البحث عن <strong>مورد كابلات كهرباء</strong>، يجب التأكد من أن الكابلات مصنعة من النحاس النقي عالي التوصيل ومغلفة بطبقة عزل مقاومة للحرارة العالية، وحاصلة على اعتمادات الهيئة السعودية للمواصفات والمقاييس والجودة (SASO).</p>

      <h2>لوحات وقواطع الكهرباء: لوحة التحكم الرئيسية لمشروعك</h2>
      <p>تقوم لوحات التوزيع وقواطع الدورة بدور المنظم والحامي للدوائر الكهربائية:</p>
      <ul>
        <li><strong>لوحات توزيع كهربائية:</strong> يجب اختيار لوحة توزيع تتناسب مع عدد خطوط التغذية والجهد المطلوب مع إمكانية التوسعة المستقبلية. نحن نتميز في <strong>توريد لوحات كهرباء</strong> بمختلف المقاسات والقدرات.</li>
        <li><strong>قواطع كهربائية:</strong> تلعب القواطع دوراً حاسماً في فصل التيار فوراً عند حدوث حمل زائد. نركز على <strong>توريد قواطع كهربائية</strong> من ماركات عالمية موثوقة تضمن الاستجابة السريعة وتمنع تلف الأجهزة.</li>
      </ul>

      <h2>توفير الطاقة مع حلول الإنارة LED الحديثة</h2>
      <p>أصبح التوجه نحو المباني الخضراء والموفرة للطاقة متطلباً أساسياً. يساهم <strong>توريد لمبات LED</strong> وأنظمة الإنارة الذكية في خفض استهلاك الكهرباء بنسبة تصل إلى 70% مقارنة بالإنارة التقليدية، بالإضافة إلى عمرها الافتراضي الطويل وشكلها الجمالي العصري.</p>

      <h2>حلول التوريد المتكاملة من إيست بلس</h2>
      <p>سواء كنت مقاولاً يعمل على مشروع مجمع تجاري أو مطوراً عقارياً يبني فللاً سكنية، فإن إيست بلس توفر لك حلول توريد متكاملة للمواد الكهربائية تشمل الكابلات، لوحات التوزيع، قواطع الكهرباء، لمبات LED، وإكسسوارات الكهرباء بأسعار منافسة.</p>',
   'Electrical Materials Sourcing Guide: From Cables and Panels to Circuit Breakers and LED Systems',
   'Sourcing guide for construction electrical materials in Saudi Arabia. Learn specs of electrical cables, distribution boards, breakers, and LED systems.',
   '<h2>Securing Power with High Safety Standards</h2>
      <p>Electrical works in modern buildings require extreme precision and strict compliance with the Saudi Building Code (SBC). Selecting genuine electrical materials is not just a detail, but the primary safeguard to protect lives and properties from electrical fire hazards.</p>

      <h2>Finding a Certified Electrical Cables Supplier</h2>
      <p>Cables represent the main infrastructure of power delivery inside a building. When searching for an <strong>electrical cables supplier</strong>, verify that they supply pure high-conductivity copper cables with high-temperature resistance insulation, certified by SASO.</p>

      <h2>Distribution Boards & Circuit Breakers: Protect Your Circuits</h2>
      <p>Distribution boards and circuit breakers regulate and protect electrical circuits:</p>
      <ul>
        <li><strong>Distribution Boards:</strong> Must match the line capacity and voltage of your project. We specialize in the <strong>supply of electrical panels</strong> in various configurations.</li>
        <li><strong>Circuit Breakers:</strong> Crucial for cutting power during overloads. We focus on the <strong>supply of electrical circuit breakers</strong> from trusted global brands.</li>
      </ul>

      <h2>Energy Saving with Modern LED Lighting</h2>
      <p>Sourcing and <strong>supplying LED bulbs</strong> and smart lights reduces power consumption by up to 70% compared to traditional bulbs, offering long lifespan and modern aesthetic designs.</p>

      <h2>Complete Sourcing Solutions by EAST PLUS</h2>
      <p>Whether you are building a commercial complex or residential villas, EAST PLUS offers comprehensive electrical supplies sourcing including cables, panels, breakers, and LED lighting at wholesale prices.</p>',
   'الكهرباء',
   'Electrical',
   true, now() - interval '3 days', '00000000-0000-0000-0000-000000000001'),

  ('water-thermal-insulation-guide-saudi',
   'أهمية العزل المائي والحراري للمباني في السعودية: عزل الأسطح، الخزانات، والحمامات',
   'تعرّف على أفضل أنواع مواد العزل الحراري والمائي المعتمدة في المملكة العربية السعودية لحماية مبناك من تسريب المياه وحرارة الصيف الشديدة.',
   '<h2>تأثير العزل على عمر المبنى واستهلاك الطاقة</h2>
      <p>تواجه المباني في المملكة العربية السعودية ظروفاً مناخية قاسية، من درجات الحرارة المرتفعة جداً في الصيف إلى الرطوبة العالية والأمطار الغزيرة في الشتاء. هنا تبرز الأهمية القصوى لعملية <strong>توريد عوازل مائية وحرارية</strong> عالية الكفاءة كجزء لا يتجزأ من مراحل التشييد الأساسية لضمان سلامة الهيكل الإنشائي للمبنى.</p>

      <h2>مجالات العزل الأساسية في المشاريع السكنية والتجارية</h2>
      <p>يغطي العزل ثلاثة قطاعات رئيسية داخل أي مبنى:</p>
      <ul>
        <li><strong>عزل اسطح:</strong> يمنع انتقال حرارة الشمس الشديدة إلى داخل الغرف (العزل الحراري) ويمنع تسرب مياه الأمطار عبر الخرسانة (العزل المائي)، مما يحمي حديد التسليح من الصدأ.</li>
        <li><strong>عزل خزانات:</strong> يحافظ على سلامة مياه الشرب من التلوث الخارجي، ويمنع تسرب المياه من الخزانات إلى أساسات المباني المحيطة، وهو إجراء ضروري معتمد من شركة المياه الوطنية.</li>
        <li><strong>عزل حمامات:</strong> يحمي الأرضيات والجدران المجاورة من تسرب الرطوبة والمياه الناتجة عن استخدام الأدوات الصحية، مما يمنع سقوط الدهانات ونمو العفن.</li>
      </ul>

      <h2>أهمية مواد عزل بيتومين في المشاريع</h2>
      <p>يعتبر البيتومين من أقدم وأقوى المواد المستخدمة في العزل المائي. نتميز في <strong>توريد مواد عزل بيتومين</strong> سائلة أو لفائف (ممبرين) بجودة عالية تلائم عزل القواعد والأساسات والجدران الاستنادية الملامسة للتربة لحمايتها من المياه الجوفية والأملاح الضارة.</p>

      <h2>لماذا تختار إيست بلس لمشاريع العزل؟</h2>
      <p>في إيست بلس للتجارة، نوفر تشكيلة واسعة من مواد العزل المائي والحراري المعتمدة محلياً، بما في ذلك ألواح الفوم المقاومة للحرارة، ولفائف البيتومين، والمواد الأسمنتية المرنة، لنضمن لعملائنا عزلاً آمناً طويل الأمد يحمي استثماراتهم العقارية ويقلل من فواتير الكهرباء.</p>',
   'Importance of Thermal and Waterproof Insulation in Saudi Arabia: Roofs, Tanks, and Bathrooms',
   'Discover the best certified water and thermal insulation materials in KSA to protect your building from water leaks and intense summer heat.',
   '<h2>The Impact of Insulation on Energy Saving & Building Lifespan</h2>
      <p>Buildings in Saudi Arabia face harsh climate conditions, from high summer temperatures to winter rains. That is why <strong>supplying water and thermal insulation</strong> of high quality is integral to modern construction in KSA.</p>

      <h2>Key Areas of Insulation in Residential & Commercial Buildings</h2>
      <p>Insulation covers three critical areas in any structure:</p>
      <ul>
        <li><strong>Roof Insulation:</strong> Prevents heat transfer inside (thermal insulation) and blocks rainwater from leaking through concrete (waterproofing).</li>
        <li><strong>Tank Insulation:</strong> Protects drinking water from contamination and stops leaks into foundations, which is required by NWC in Saudi Arabia.</li>
        <li><strong>Bathroom Insulation:</strong> Safeguards walls and floors from moisture and plumbing leaks, protecting paint and preventing mold.</li>
      </ul>

      <h2>The Role of Bitumen Insulation in Sourcing</h2>
      <p>Bitumen is a premier waterproofing material. We excel in the <strong>supply of bitumen insulation materials</strong> (liquid and rolls) to protect foundations, basements, and retaining walls against groundwater and salts.</p>

      <h2>Why Sourcing Insulation from EAST PLUS?</h2>
      <p>EAST PLUS provides a wide range of certified insulation products, from extruded polystyrene foam boards to bituminous membranes and flexible cementitious coatings, protecting your property for decades.</p>',
   'العزل',
   'Insulation',
   true, now() - interval '4 days', '00000000-0000-0000-0000-000000000001'),

  ('wholesale-building-finishing-materials-projects',
   'كيف توفر شركات التطوير العقاري في تكاليف مواد التشطيب بالجملة؟',
   'تعرّف على استراتيجيات التوريد الذكية التي تمكّن المطورين العقاريين من تقليل تكاليف مواد التشطيب والبناء بالجملة لزيادة هوامش أرباح المشاريع.',
   '<h2>التحديات الاقتصادية في قطاع التطوير العقاري</h2>
      <p>تواجه شركات التطوير العقاري ضغوطاً مستمرة لتقديم وحدات سكنية وتجارية بجودة عالية وأسعار منافسة للمستهلك النهائي. وبما أن تكلفة المواد تمثل الجزء الأكبر من ميزانية المشروع، فإن الحصول على <strong>مواد تشطيب بالجملة</strong> بأسعار تفضيلية يعتبر العامل الحاسم في تحقيق الربحية المطلوبة.</p>

      <h2>مزايا التعامل مع شركة توريد مشاريع متخصصة</h2>
      <p>بدلاً من الشراء الفردي من محلات التجزئة، تتوجه الشركات الكبرى للتعاقد مع <strong>شركة توريد مشاريع</strong> متكاملة. هذا الأسلوب يوفر مزايا استراتيجية هامة:</p>
      <ul>
        <li><strong>التسعير المباشر للجملة:</strong> توفير هوامش الوساطة من خلال الاستفادة من علاقات المورد المباشرة مع المصانع.</li>
        <li><strong>التوريد حسب جدول العمل (Just-in-Time):</strong> تجنب تكاليف التخزين الطويل في موقع المشروع وما قد ينجم عنه من تلف أو سرقة، حيث يتم <strong>توريد مواد بالجملة للمشاريع</strong> بالتزامن مع الحاجة الفعلية لها.</li>
        <li><strong>بدائل المواد المطابقة للميزانية:</strong> توفر الموردين المعتمدين خيارات بديلة للمواد بنفس الجودة لتقليل التكلفة عند الضرورة.</li>
      </ul>

      <h2>تحسين سلاسل الإمداد ومطابقة جداول الكميات (BOQ)</h2>
      <p>تتطلب المشاريع الكبيرة دقة متناهية في قراءة وتفسير جداول الكميات (BOQ). تلتزم الجهة الموردة الموثوقة بمطابقة المواصفات الفنية المعتمدة للمشروع وتقديم عينات حقيقية للاستشاري الهندسي للحصول على الموافقات الفنية قبل التوريد الفعلي للموقع.</p>

      <h2>إيست بلس: شريكك الاستراتيجي في توريد المشاريع</h2>
      <p>تتمتع شركة إيست بلس للتجارة بخبرة واسعة في دعم شركات المقاولات والتطوير العقاري بالمملكة. نحن نوفر حلول توريد متكاملة لمواد التشطيب، السباكة، الكهرباء، والأدوات الصحية بأسعار خاصة للمشاريع وبسرعة استجابة متميزة.</p>',
   'How Real Estate Developers Save on Wholesale Finishing Materials Sourcing?',
   'Discover smart sourcing strategies that enable real estate developers to reduce wholesale building and finishing material costs, boosting profit margins.',
   '<h2>Economic Challenges in Real Estate Development</h2>
      <p>Real estate developers face constant pressure to deliver high-quality residential and commercial units at competitive prices. Since material costs make up the bulk of the project budget, securing <strong>wholesale finishing materials</strong> is crucial for profitability.</p>

      <h2>Advantages of Partnering with a Project Supply Company</h2>
      <p>Instead of retail sourcing, major developers contract with a dedicated <strong>project supply company</strong>. This strategy offers key benefits:</p>
      <ul>
        <li><strong>Direct Wholesale Pricing:</strong> Eliminating broker margins through direct relationships with leading factories.</li>
        <li><strong>Just-in-Time Supply:</strong> Avoiding costly long-term material storage on site and potential damage, by receiving <strong>wholesale material supply for projects</strong> exactly when needed.</li>
        <li><strong>Budget-Friendly Alternatives:</strong> Providing alternative options that match the required specifications but offer cost savings.</li>
      </ul>

      <h2>Optimizing Bills of Quantities (BOQ)</h2>
      <p>Large projects require precision in matching Bills of Quantities (BOQs). A reliable supplier ensures technical compliance and prepares submittal samples for consulting engineers to approve before final dispatch.</p>

      <h2>EAST PLUS: Your Sourcing Partner</h2>
      <p>EAST PLUS supports contracting and real estate development companies across KSA, offering tailored solutions for finishing materials, plumbing, electrical, and sanitary ware at dedicated project pricing.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '5 days', '00000000-0000-0000-0000-000000000001'),

  ('building-maintenance-renovation-materials-sourcing',
   'دليل توريد مواد الصيانة والترميم للمباني التجارية والسكنية في الرياض',
   'دليلك الشامل لمعرفة كيفية توريد مواد الصيانة، السباكة، والكهرباء اللازمة لترميم وتطوير المباني والمنشآت التجارية والفلل في الرياض.',
   '<h2>أهمية الصيانة الدورية والترميم الوقائي</h2>
      <p>تتعرض المباني مع مرور الوقت للاستهلاك الطبيعي والتآكل الناتج عن العوامل المناخية. وتعتبر الصيانة الدورية والترميم السريع للمشكلات مثل تسريبات السباكة والالتماسات الكهربائية أمراً ضرورياً لمنع تدهور حالة المبنى وتجنب تكاليف الترميم الباهظة مستقبلاً.</p>

      <h2>تأمين مواد الصيانة وعقود التوريد للشركات</h2>
      <p>تحتاج الفنادق، المجمعات السكنية، والمكاتب الإدارية الكبرى إلى تدفق مستمر لمواد الصيانة. إن التعامل مع <strong>مورد مواد مقاولات</strong> يوفر عقود توريد دورية يضمن:</p>
      <ul>
        <li>توفير قطع الغيار الأصلية للمضخات، السخانات، والقواطع الكهربائية فوراً.</li>
        <li>ثبات أسعار المواد طوال فترة العقد لسهولة إعداد الميزانيات التقديرية.</li>
        <li>تقليل وقت توقف العمل في المنشآت الحيوية نتيجة عدم توفر المواد.</li>
      </ul>

      <h2>توفير مواد التشطيب للترميم والتجديد</h2>
      <p>عند القيام بأعمال التجديد (الرينوفيشن)، يبحث المشرفون عن <strong>مواد تشطيب بالجملة</strong> للحصول على أفضل جودة شكلية وعملية بأقل تكلفة ممكنة، مثل المعاجين، المواد اللاصقة، السيلكون، والصفايات المقاومة للصدأ.</p>

      <h2>لماذا تختار إيست بلس كشريك صيانة؟</h2>
      <p>نعمل في إيست بلس كـ <strong>شركة توريد مشاريع</strong> وصيانة متكاملة بالرياض، ونوفر للشركات والأفراد خيارات توريد سريعة وموثوقة لكافة مواد السباكة والكهرباء والدهانات ومواد التشطيب اللازمة لأعمال الصيانة والترميم بأعلى كفاءة.</p>',
   'Guide to Sourcing Maintenance and Renovation Materials for Commercial and Residential Buildings in Riyadh',
   'Sourcing guide for maintenance, plumbing, and electrical materials needed for building renovation and upkeep of commercial spaces and villas in Riyadh.',
   '<h2>Value of Regular Maintenance & Preventive Renovation</h2>
      <p>Over time, buildings experience wear and tear due to usage and weather elements. Regular maintenance and quick resolution of plumbing leaks or electrical issues are vital to protect the structure and prevent high renovation costs.</p>

      <h2>Securing Sourcing Contracts for Corporate Maintenance</h2>
      <p>Hotels, residential compounds, and commercial offices require a steady flow of maintenance materials. Working with a reputable <strong>contracting materials supplier</strong> offering long-term supply agreements guarantees:</p>
      <ul>
        <li>Immediate access to genuine spare parts for pumps, heaters, and breakers.</li>
        <li>Stable material pricing over the contract duration for easy budgeting.</li>
        <li>Minimized operational downtime for critical facilities.</li>
      </ul>

      <h2>Finishing Materials for Renovations</h2>
      <p>During renovation and upgrades, project managers look for <strong>wholesale finishing materials</strong> such as sealants, adhesives, silicone, and stainless-steel drains to achieve high durability at low costs.</p>

      <h2>Why Sourcing from EAST PLUS?</h2>
      <p>EAST PLUS acts as a comprehensive <strong>project supply company</strong> and maintenance partner in Riyadh, providing fast and reliable sourcing of plumbing, electrical, and finishing materials for renovation works.</p>',
   'الصيانة',
   'Maintenance',
   true, now() - interval '6 days', '00000000-0000-0000-0000-000000000001'),

  ('villa-construction-materials-supply-riyadh',
   'دليل الملاك والمقاولين لتوريد مواد البناء والتشطيب لمشاريع الفلل في الرياض',
   'نصائح عملية للملاك والمقاولين لتوريد مواد البناء الأساسية والسباكة والكهرباء والتشطيب لمشاريع بناء الفلل بالرياض بأعلى جودة وأفضل سعر.',
   '<h2>تحديات بناء الفلل السكنية بالرياض</h2>
      <p>بناء منزل العمر أو تطوير مشروع فلل سكنية هو استثمار ضخم يتطلب الكثير من التخطيط والمتابعة. من أكبر التحديات التي تواجه الملاك والمقاولين هو تقلب أسعار المواد وصعوبة التنسيق بين موردين متعددين، مما قد يؤدي إلى تأخر تسليم المشروع وزيادة التكاليف التقديرية.</p>

      <h2>أهمية التعامل مع مورد لمشاريع الفلل</h2>
      <p>يوفر لك التعامل مع <strong>مورد لمشاريع الفلل</strong> ذي خبرة واسعة في السوق المحلي، راحة بال بالغة وحلولاً متكاملة:</p>
      <ul>
        <li><strong>عروض أسعار سريعة ومفصلة:</strong> تسعير جداول الكميات لمشروع الفيلا بالكامل خلال 24 ساعة.</li>
        <li><strong>توريد المواد على دفعات:</strong> بدءاً من المواد الخشنة (حديد وأسمنت) مروراً بالتمديدات (مواسير وكابلات) وحتى التشطيبات النهائية (الأدوات الصحية والخلاطات).</li>
        <li><strong>الالتزام بالمواصفات الفنية:</strong> مطابقة المواد لكود البناء السعودي لضمان اجتياز فحوصات البلدية وشركة ملاذ للتأمين.</li>
      </ul>

      <h2>توفير الأدوات الصحية والخلاطات عالية الجودة</h2>
      <p>التشطيبات النهائية هي ما يضفي الجمال والراحة على الفيلا. نحرص على <strong>توريد خلاطات ومغاسل</strong> وأطقم حمامات وصفايات بتصاميم حديثة وألوان عصرية تتماشى مع أرقى الفلل في الرياض، مع ضمانات حقيقية ضد الصدأ والتسريب.</p>

      <h2>إيست بلس: شريكك لبناء فيلا أحلامك</h2>
      <p>تقدم إيست بلس كـ <strong>مورد مواد بناء للمقاولين</strong> والملاك خيارات توريد شاملة ومرنة لكافة مراحل بناء وتشطيب الفلل بالرياض، مما يوفر الوقت والمال ويضمن جودة لا تضاهى.</p>',
   'Homeowners & Contractors Guide to Sourcing Construction and Finishing Materials for Villa Projects in Riyadh',
   'Practical tips for homeowners and contractors to source basic construction, plumbing, electrical, and finishing materials for villa projects in Riyadh.',
   '<h2>Challenges in Building Residential Villas in Riyadh</h2>
      <p>Building a home or developing residential villa projects is a major investment requiring careful planning. A primary challenge is material price volatility and coordinating multiple suppliers, which can delay projects.</p>

      <h2>Benefits of Partnering with a Supplier for Villa Projects</h2>
      <p>Working with a dedicated <strong>supplier for villa projects</strong> provides piece of mind and consolidated solutions:</p>
      <ul>
        <li><strong>Fast and Detailed Quotes:</strong> Pricing of Bills of Quantities (BOQ) for the entire villa within 24 hours.</li>
        <li><strong>Phase-Based Delivery:</strong> Delivering core materials first, followed by plumbing/electrical conduits, and final decorative items.</li>
        <li><strong>SBC Compliance:</strong> Aligning materials with Saudi Building Code requirements to ensure approval from insurance.</li>
      </ul>

      <h2>Sourcing Premium Sanitary Fixtures and Mixers</h2>
      <p>Final fixtures define the beauty of a villa. We offer the <strong>supply of mixers and basins</strong> with modern designs and finishes that fit high-end Riyadh villas, backed by solid anti-leak warranties.</p>

      <h2>EAST PLUS: Sourcing Partner for Your Villa</h2>
      <p>EAST PLUS is a trusted <strong>building materials supplier for contractors</strong> and homeowners, providing a unified catalog of structural, plumbing, electrical, and sanitary ware in Riyadh.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '7 days', '00000000-0000-0000-0000-000000000001'),

  ('sanitary-ware-fixtures-wholesale-sa',
   'الدليل الشامل لتوريد الأدوات الصحية والخلاطات ومضخات المياه للمشاريع السكنية',
   'تعرّف على أهم المواصفات الفنية لتوريد الأدوات الصحية، الخلاطات، السخانات، ومضخات المياه للمشاريع الإنشائية والمجمعات في السعودية بأسعار الجملة.',
   '<h2>أهمية اختيار الأدوات الصحية المطابقة للمواصفات</h2>
      <p>تمثل الأدوات الصحية جزءاً أساسياً من تقييم جودة أي مبنى سكني أو تجاري. ولا تقتصر جودتها على المظهر الخارجي اللامع، بل ترتبط بقدرتها على ترشيد استهلاك المياه ومقاومة التكلسات والصدأ. لذلك، يعتبر العثور على <strong>مورد أدوات صحية</strong> معتمد خطوة محورية لنجاح أعمال التشطيب.</p>

      <h2>عناصر الأدوات الصحية والملحقات الأساسية</h2>
      <p>يشمل توريد المواد الصحية للمشاريع عدة عناصر أساسية لا غنى عنها:</p>
      <ul>
        <li><strong>الأطقم الصحية والمراحيض:</strong> يجب أن تكون مطابقة لمتطلبات ترشيد المياه والحصول على بطاقات الكفاءة من الهيئة السعودية للمواصفات والمقاييس.</li>
        <li><strong>توريد خلاطات ومغاسل:</strong> اختيار خلاطات نحاسية مطلية بالكروم أو ألوان عصرية (مثل الأسود المطفي أو الذهبي) مقاومة للتآكل والصدأ وتوفر تدفق مياه مريح.</li>
        <li><strong>توريد سخانات مياه:</strong> توريد سخانات بجودة عالية وخزانات داخلية معزولة ومقاومة للصدأ تضمن الحفاظ على درجة الحرارة وتوفر الأمان الكامل للمستخدمين.</li>
      </ul>

      <h2>تأمين تدفق المياه مع مضخات المياه الحديثة</h2>
      <p>لضمان وصول المياه بقوة كافية ومتوازنة لكافة الأدوار والحمامات، يعد <strong>توريد مضخات مياه</strong> وحلول الضغط الذكية أمراً بالغ الأهمية. توفر المضخات الحديثة ضغطاً مستقراً مع توفير الطاقة وحماية الشبكة من الضغط الزائد.</p>

      <h2>لماذا تعتمد المشاريع على إيست بلس في توريد المواد الصحية؟</h2>
      <p>توفر شركة إيست بلس للتجارة باقة متكاملة من الأدوات الصحية، الخلاطات، السخانات، ومضخات المياه من موردين معتمدين وعلامات تجارية رائدة تناسب المشاريع السكنية الفاخرة والمجمعات التجارية بأسعار الجملة التنافسية وبسرعة توريد مثالية.</p>',
   'The Ultimate Guide to Sourcing Sanitary Ware, Mixers, and Water Pumps for Residential Projects',
   'Learn the technical specs for sourcing sanitary ware, mixers, heaters, and water pumps for building projects and compounds in KSA at wholesale rates.',
   '<h2>The Value of Water-Saving Sanitary Ware Sourcing</h2>
      <p>Sanitary ware defines the user experience of any residential or commercial building. Quality goes beyond the design; it encompasses water efficiency and corrosion resistance. Sourcing from a certified <strong>sanitary ware supplier</strong> is essential.</p>

      <h2>Core Components of Sanitary Fixtures</h2>
      <p>Sourcing sanitary materials for projects involves several vital items:</p>
      <ul>
        <li><strong>Sanitary Sets & Toilets:</strong> Must comply with water efficiency regulations and hold SASO conservation tags.</li>
        <li><strong>Supply of Mixers & Basins:</strong> Sourcing brass mixers coated with chrome or modern matte-black/gold colors that resist rust and optimize water flow.</li>
        <li><strong>Supply of Water Heaters:</strong> Choosing high-quality heaters with insulated, rust-proof internal tanks for optimal safety and heat retention.</li>
      </ul>

      <h2>Securing Flow with Advanced Water Pumps</h2>
      <p>To ensure balanced water pressure throughout the structure, the <strong>supply of water pumps</strong> is crucial. Modern pressure pumps maintain steady flow with low energy usage.</p>

      <h2>Why Source Sanitary Ware from EAST PLUS?</h2>
      <p>EAST PLUS offers a unified supply of sanitary ware, mixers, heaters, and water pumps from leading brands, catering to luxury villas and large-scale residential projects at wholesale prices.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '8 days', '00000000-0000-0000-0000-000000000001');

-- More Extra SEO Blog Posts
insert into public.blog_posts (slug, title, excerpt, content, title_en, excerpt_en, content_en, category, category_en, published, published_at, author_id) values
  ('best-plumbing-brands-saudi-market',
   'مقارنة بين أشهر ماركات السباكة في السوق السعودي: كيف تختار الأفضل؟',
   'تعرّف على أفضل ماركات السباكة في السعودية من مواسير PPR الحرارية ومحابس ووصلات ومميزات كل ماركة لضمان شبكة تغذية مياه خالية من الأعطال.',
   '<h2>أهمية العلامة التجارية في مواد السباكة</h2>
      <p>عند بناء أو ترميم أي منشأة، تعد جودة المواد المستخدمة في السباكة التأسيسية خطاً أحمر لا يقبل التهاون. السوق السعودي غني بالخيارات، ولكن البحث عن <strong>أفضل ماركات السباكة في السعودية</strong> يتطلب معرفة الفروق الجوهرية بين العلامات التجارية المحلية والعالمية لضمان عمر افتراضي طويل وتجنب التسريبات الكارثية.</p>

      <h2>أشهر ماركات مواسير PPR والأنابيب الحرارية</h2>
      <p>تسيطر عدة علامات تجارية رائدة على سوق الأنابيب الحرارية المخصصة لتغذية المياه في المملكة:</p>
      <ul>
        <li><strong>أكواثيرم (Aquatherm):</strong> الأنابيب الألمانية الشهيرة التي تعتبر المعيار الذهبي للجودة والمتانة، وتتميز بمقاومتها الفائقة للضغط والحرارة والضمانات الطويلة التي تصل لـ 10 سنوات.</li>
        <li><strong>النيبرو والمواسير الوطنية:</strong> خيارات وطنية سعودية عالية الجودة تم تصنيعها بمواصفات عالمية وتلقى قبولاً واسعاً من الاستشاريين والمقاولين نظراً لتوفرها المستمر وأسعارها المناسبة.</li>
        <li><strong>سهل والماركات المعتمدة:</strong> خيارات ممتازة توفر توازناً رائعاً بين السعر المنافس والجودة العالية للمشاريع السكنية والتجارية.</li>
      </ul>

      <h2>كيف تختار ماركة المحابس ووصلات السباكة؟</h2>
      <p>لا يكتمل عمل المواسير بدون المحابس النحاسية ووصلات الربط. يجب اختيار الماركات التي توفر نحاساً ثقيلاً مقاوماً للاملاح والكلور المتواجد في المياه لمنع تأكسد المحابس وصعوبة فتحها أو إغلاقها مستقبلاً. ننصح دائماً بالماركات الإيطالية أو الوطنية المعتمدة من الهيئة السعودية للمواصفات.</p>

      <h2>إيست بلس: مورد معتمد لكبرى العلامات التجارية</h2>
      <p>في شركة إيست بلس، نلتزم بتوريد المواد من كبرى الماركات المعتمدة التي تضمن مشاريع عملائنا وتوفر لهم شهادات الضمان المعتمدة لتسهيل عملية فحص وضمان المباني.</p>',
   'Comparison of the Best Plumbing Brands in the Saudi Market: How to Choose the Best?',
   'Discover the top plumbing brands in Saudi Arabia for PPR pipes, valves, and fittings, along with their key features to ensure a leak-free network.',
   '<h2>The Value of Brand Quality in Plumbing Fixtures</h2>
      <p>When constructing any building, the quality of underground plumbing is non-negotiable. The Saudi market is rich with choices, but identifying the <strong>best plumbing brands in Saudi Arabia</strong> is crucial to ensure structural safety and avoid leakage.</p>

      <h2>Leading PPR Pipe Brands in KSA</h2>
      <p>Several top-tier brands dominate the hot/cold water supply pipe market in the Kingdom:</p>
      <ul>
        <li><strong>Aquatherm:</strong> The famous German pipe brand, widely regarded as the gold standard for durability, featuring high temperature/pressure ratings and a 10-year warranty.</li>
        <li><strong>National Brands (e.g., Nepro):</strong> High-quality Saudi-made pipes built to international specs, highly favored by local consultants due to consistent supply.</li>
        <li><strong>Certified Value Brands:</strong> Excellent options providing a perfect balance of competitive price and certified quality for residential buildings.</li>
      </ul>

      <h2>Sourcing Heavy-Duty Valves and Fittings</h2>
      <p>Valves must be sourced from brands using high-grade brass that resists corrosion and calcification from water salts. Italian and approved local brands are highly recommended.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>At EAST PLUS, we supply certified plumbing fixtures from leading brands, ensuring your project passes consultant approvals and insurance checks easily.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '9 days', '00000000-0000-0000-0000-000000000001'),

  ('how-to-test-waterproofing-insulation',
   'طريقة اختبار العزل المائي للأسطح والخزانات والحمامات خطوة بخطوة',
   'تعرف على طريقة اختبار العزل المائي الصحيحة للخزانات والأسطح والحمامات لضمان خلوها من العيوب والتسريبات قبل صب الخرسانة أو تركيب البلاط.',
   '<h2>لماذا يعتبر اختبار العزل المائي خطوة مصيرية؟</h2>
      <p>يعد العزل المائي حائط الصد الأساسي لحماية الخرسانة والحديد من المياه والرطوبة. ولكن مجرد تركيب العزل لا يضمن كفاءته؛ إذ قد تحدث أخطاء أثناء التركيب أو عيوب في لحامات المواد. لذلك، تعد <strong>طريقة اختبار العزل المائي</strong> بشكل صحيح هي الضمان الوحيد لسلامة العمل وتجنب التكاليف الباهظة لإصلاح التسريبات بعد التشطيب النهائي.</p>

      <h2>خطوات اختبار عزل الأسطح والحمامات (اختبار الغمر بالماء)</h2>
      <p>يتم اختبار عزل أسطح المباني وأرضيات الحمامات والمطابخ باتباع الخطوات التالية:</p>
      <ul>
        <li><strong>تنظيف السطح:</strong> إزالة الأتربة والمخلفات وتأمين فتحات التصريف (المزاريب) بشكل محكم باستخدام سدادات مخصصة أو خلطة أسمنتية مؤقتة.</li>
        <li><strong>غمر السطح بالماء:</strong> تعبئة المنطقة بالماء النظيف بارتفاع يتراوح بين 10 إلى 15 سم.</li>
        <li><strong>مراقبة منسوب المياه:</strong> ترك الماء لمدة لا تقل عن 48 ساعة مع وضع علامة لتحديد المنسوب ومراقبته باستمرار لمعرفة ما إذا كان هناك انخفاض ناتج عن تسريب (مع مراعاة نسبة التبخر الطبيعي).</li>
        <li><strong>الفحص السفلي:</strong> معاينة الأسقف من الطابق السفلي للبحث عن أي علامات رطوبة أو تنشيع مياه.</li>
      </ul>

      <h2>طريقة اختبار عزل خزانات المياه الأرضية والعلوية</h2>
      <p>يختلف عزل خزانات المياه نظراً لأن الضغط يكون من الداخل إلى الخارج. يتم الاختبار عبر تعبئة الخزان بالكامل بالماء وتركه لمدة 72 ساعة، مع فحص الجدران الخارجية (إذا كانت مكشوفة) أو فحص منسوب المياه بدقة يومية للتأكد من عدم وجود أي تهريب.</p>

      <h2>شراء مواد العزل المعتمدة من إيست بلس</h2>
      <p>لضمان نجاح اختبار العزل، يجب البدء باستخدام مواد عزل مائي وحراري معتمدة ومطابقة للمواصفات. توفر إيست بلس كبرى منتجات العزل الإنشائي وحلول البيتومين السائل واللفائف التي تضمن لك اجتياز الفحوصات الفنية بنجاح.</p>',
   'Step-by-Step Guide on How to Test Waterproofing Insulation for Roofs, Tanks, and Bathrooms',
   'Learn the correct methods for testing waterproofing systems on roofs, tanks, and bathrooms to ensure there are no defects before tiling.',
   '<h2>Why is Waterproofing Testing Critical?</h2>
      <p>Waterproofing protects the concrete skeleton from moisture and chemical attack. However, simply installing the barrier is not enough. The <strong>waterproofing testing method</strong> (flood testing) is the only way to verify performance and avoid extremely costly repairs after finishing.</p>

      <h2>Steps for Testing Roof & Bathroom Insulation (Flood Test)</h2>
      <p>For roofs, bathrooms, and wet areas, the flood test is executed as follows:</p>
      <ul>
        <li><strong>Preparation:</strong> Clean the area of debris and plug all drains securely using temporary expanders or cement plugs.</li>
        <li><strong>Water Flooding:</strong> Fill the area with clean water to a depth of 10 to 15 cm.</li>
        <li><strong>Monitoring:</strong> Keep the water for at least 48 hours. Mark the water level to track loss (factoring in natural evaporation).</li>
        <li><strong>Ceiling Inspection:</strong> Inspect the ceiling below for any signs of moisture, dampness, or water droplets.</li>
      </ul>

      <h2>Testing Methods for Underground Water Tanks</h2>
      <p>Tanks undergo hydrostatic tests by filling them completely with water and leaving them for 72 hours while tracking water levels and inspecting exterior walls if accessible.</p>

      <h2>Source Certified Insulation Materials from EAST PLUS</h2>
      <p>Using premium waterproofing membranes is the first step to passing the flood test. EAST PLUS supplies certified bitumen rolls, liquid rubber, and cementitious coatings that stand the test of time.</p>',
   'العزل',
   'Insulation',
   true, now() - interval '10 days', '00000000-0000-0000-0000-000000000001'),

  ('residential-electrical-wire-sizes-guide',
   'دليل مقاسات أسلاك الكهرباء للمنازل وكيفية حساب الأحمال الصحيحة',
   'تعرف على مقاسات أسلاك الكهرباء المناسبة لتوصيل الإنارة والأفياش والمكيفات في الفلل والمباني السكنية لحماية شبكة الكهرباء من الأحمال الزائدة.',
   '<h2>أهمية اختيار القطر الصحيح للسلك الكهربائي</h2>
      <p>يعد اختيار مقاس السلك الكهربائي المناسب من أهم عوامل السلامة والأمان في التمديدات السكنية والتجارية. إن استخدام سلك ذي قطر أقل من المطلوب يؤدي إلى ارتفاع درجة حرارة السلك نتيجة المقاومة العالية، مما قد يتسبب في انصهار العزل ووقوع التماسات كهربائية خطيرة.</p>

      <h2>جدول مقاسات أسلاك الكهرباء للمنازل وتطبيقاتها</h2>
      <p>إليك المقاسات المعتمدة والشائعة في السوق السعودي للتمديدات الداخلية (بناءً على النحاس النقي):</p>
      <ul>
        <li><strong>مقاس 1.5 مم² إلى 2.5 مم²:</strong> يستخدم بشكل أساسي في دوائر الإنارة الداخلية (لمبات LED، الثريات، الإنارة المخفية) حيث تكون الأحمال خفيفة.</li>
        <li><strong>مقاس 4 مم²:</strong> المقاس القياسي لتغذية الأفياش والمقابس العادية في الغرف والممرات لتشغيل الأجهزة اليومية العادية.</li>
        <li><strong>مقاس 6 مم²:</strong> يستخدم للأفياش ذات الأحمال المرتفعة مثل سخانات المياه، أفران الطبخ الكهربائية، ومكيفات الهواء السبليت (Split AC) لضمان تحمل التيار العالي.</li>
        <li><strong>مقاس 10 مم² إلى 16 مم² فما فوق:</strong> تستخدم كخطوط تغذية رئيسية قادمة من لوحة التوزيع الفرعية إلى لوحة التحكم الرئيسية أو العداد الخارجي.</li>
      </ul>

      <h2>حساب الأحمال واختيار القواطع الكهربائية المناسبة</h2>
      <p>لا يكتمل أمان الشبكة باختيار مقاس السلك فحسب، بل يجب تنسيقه مع القاطع الكهربائي (Circuit Breaker) المناسب. على سبيل المثال، دائرة الإنارة بسلك 2.5 مم تحتاج قاطعاً بقدرة 10 أو 16 أمبير، بينما دائرة تكييف بسلك 6 مم تحتاج قاطعاً بقدرة 25 أو 32 أمبير لضمان فصل التيار فوراً في حال حدوث حمل زائد وقبل أن يسخن السلك نفسه.</p>

      <h2>توريد كابلات وأسلاك الكهرباء الأصلية عبر إيست بلس</h2>
      <p>توفر شركة إيست بلس للتجارة جميع مقاسات أسلاك الكهرباء للمنازل والمشاريع من كابلات النحاس النقي المعتمدة والمعزولة بأعلى معايير السلامة، بالإضافة إلى القواطع ولوحات التوزيع الكهربائية بأسعار الجملة التنافسية.</p>',
   'House Electrical Wire Sizes Guide and How to Calculate Electrical Loads Correctly',
   'Discover the correct electrical wire sizes for lighting, sockets, and ACs in residential villa projects to protect the network from overloading.',
   '<h2>The Value of Selecting Correct Wire Gauges</h2>
      <p>Choosing the correct electrical wire size is critical for safety in residential wiring. Under-sizing cables causes them to overheat under load, melting the insulation and posing severe fire risks.</p>

      <h2>Standard House Wire Sizes and Applications (Copper)</h2>
      <p>Here are the standard SASO-compliant wire sizes used in Saudi residential projects:</p>
      <ul>
        <li><strong>1.5 mm² to 2.5 mm²:</strong> Used primarily for lighting circuits (LED bulbs, chandeliers) where electrical loads are light.</li>
        <li><strong>4.0 mm²:</strong> The standard size for general-purpose wall sockets and plugs in bedrooms and corridors.</li>
        <li><strong>6.0 mm²:</strong> Dedicated for high-load appliances like water heaters, kitchen ovens, and Split AC units.</li>
        <li><strong>10 mm² to 16 mm² and above:</strong> Used as sub-feeders connecting distribution boards to the main breaker panel.</li>
      </ul>

      <h2>Matching Wires with Circuit Breakers</h2>
      <p>Safety requires coordinating the wire gauge with the appropriate circuit breaker rating. A 2.5 mm² lighting circuit is usually paired with a 10A/16A breaker, while a 6.0 mm² AC wire requires a 25A/32A breaker to trip during overloads before the wire heats up.</p>

      <h2>Sourcing Certified Cables from EAST PLUS</h2>
      <p>EAST PLUS supplies all residential wire sizes and power cables from trusted copper brands (like Riyadh Cables) alongside high-quality distribution panels and circuit breakers at wholesale prices.</p>',
   'الكهرباء',
   'Electrical',
   true, now() - interval '11 days', '00000000-0000-0000-0000-000000000001'),

  ('plaster-mesh-corner-beads-guide',
   'أهمية شبك اللياسة الجداري وزوايا اللياسة المعدنية في حماية الجدران من التصدع',
   'تعرّف على دور شبك اللياسة الجداري والزوايا المعدنية وفواصل التمدد في تقوية أعمال اللياسة الإنشائية ومنع ظهور تشققات وتصدعات الجدران.',
   '<h2>ما هي إكسسوارات اللياسة ولماذا نهتم بها؟</h2>
      <p>تعتبر أعمال اللياسة (المحارة) من أهم خطوات التشطيب الداخلي والخارجي للمباني. ورغم أن الكثيرين يركزون على جودة الأسمنت والرمل فقط، إلا أن إهمال استخدام إكسسوارات التدعيم مثل <strong>شبك لياسة جداري</strong> و<strong>زوايا لياسة معدنية</strong> يؤدي حتماً إلى ظهور شروخ شعرية وتصدعات في الجدران بعد دهانها، مما يشوه المظهر الجمالي للمبنى ويقلل من قيمته.</p>

      <h2>فوائد شبك اللياسة الجداري (المعدني والفايبر)</h2>
      <p>يوضع شبك اللياسة في مناطق التقاء المواد المختلفة (مثل التقاء الطوب الأحمر بالخرسانة المسلحة للأعمدة والجسور). وبما أن معامل التمدد الحراري يختلف بين الطوب والخرسانة، فإن الشبك يقوم بـ:</p>
      <ul>
        <li>توزيع الإجهادات الناتجة عن التمدد والانكماش ومنع ظهور التشققات في الفواصل.</li>
        <li>تقوية وتدعيم خلطة الأسمنت والترابط بينها وبين الجدار.</li>
        <li>مقاومة الهبوط البسيط للمباني دون تصدع طبقة اللياسة الخارجية.</li>
      </ul>

      <h2>دور زوايا اللياسة المعدنية وفواصل التمدد</h2>
      <p>تثبت زوايا اللياسة المعدنية (Corner Beads) على الزوايا الخارجية للجدران والأعمدة لعدة أهداف:</p>
      <ul>
        <li>تأمين حواف مستقيمة وحادة وذات شكل هندسي دقيق.</li>
        <li>حماية زوايا الجدران من الكسر أو التفتت نتيجة الصدمات اليومية.</li>
        <li><strong>فواصل التمدد (Expansion Joints):</strong> توضع في المساحات الطويلة والواجهات الخارجية لامتصاص حركة المبنى الناتجة عن اختلاف درجات الحرارة.</li>
      </ul>

      <h2>شراء مستلزمات اللياسة بالجملة من إيست بلس</h2>
      <p>تتميز شركة إيست بلس للتجارة بتوفير تشكيلة واسعة من إكسسوارات اللياسة عالية الجودة بما فيها شبك اللياسة الجداري الفايبر والمعدني المجلفن، وزوايا اللياسة المقاومة للصدأ، وفواصل التمدد بأسعار الجملة لتلبية احتياجات المقاولين ومشاريع التشطيب بالمملكة.</p>',
   'Importance of Plaster Mesh and Metal Corner Beads in Protecting Walls from Cracking',
   'Discover the role of plaster mesh, metal corner beads, and expansion joints in reinforcing plastering works and preventing wall cracks.',
   '<h2>What are Plastering Accessories and Why Do They Matter?</h2>
      <p>Plastering (rendering) is a critical step in building finishing. While many focus solely on cement quality, ignoring reinforcing accessories like <strong>plaster mesh</strong> and <strong>metal corner beads</strong> leads to hairline cracks and splits on finished walls, impacting building value.</p>

      <h2>Benefits of Wall Plaster Mesh (Metal and Fiberglass)</h2>
      <p>Plaster mesh is placed at joints where different materials meet (e.g., concrete columns joining red clay bricks). Because concrete and clay brick expand differently under heat, the mesh serves to:</p>
      <ul>
        <li>Distribute thermal stress and prevent cracks from forming at material joints.</li>
        <li>Reinforce the mortar paste, strengthening its adhesion to the wall.</li>
        <li>Absorb micro-settlements of the structure without cracking the plaster.</li>
      </ul>

      <h2>The Function of Metal Corner Beads and Expansion Joints</h2>
      <p>Metal corner beads are installed on outer corners of walls and columns to:</p>
      <ul>
        <li>Create perfectly straight, sharp, and geometric corners.</li>
        <li>Protect wall corners from chipping due to everyday impacts.</li>
        <li><strong>Expansion Joints:</strong> Placed on long external walls to absorb expansion and contraction movements caused by ambient temperature changes.</li>
      </ul>

      <h2>Source Plaster Accessories Wholesale from EAST PLUS</h2>
      <p>EAST PLUS provides a comprehensive selection of plastering accessories including fiberglass and galvanized metal plaster mesh, rustproof corner beads, and expansion joints at competitive wholesale pricing.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '12 days', '00000000-0000-0000-0000-000000000001'),

  ('smart-sanitary-ware-trends',
   'اتجاهات الأدوات الصحية الذكية والموفرة للمياه لعام 2026: دليل المشاريع الفاخرة',
   'تعرّف على أحدث تقنيات الأدوات الصحية الذكية، الخلاطات ذات الحساسات، وأنظمة ترشيد استهلاك المياه المطلوبة للمشاريع الحديثة والفلل السكنية بالسعودية.',
   '<h2>التطور التقني في تصميم وتجهيز الحمامات</h2>
      <p>شهدت صناعة الأدوات الصحية طفرة تكنولوجية كبيرة في السنوات الأخيرة، حيث تحولت الحمامات من مساحات تقليدية إلى واحات ذكية تركز على الراحة، النظافة الشخصية، والأهم من ذلك: ترشيد استهلاك المياه تماشياً مع المعايير البيئية للمباني المستدامة في المملكة العربية السعودية.</p>

      <h2>عناصر الأدوات الصحية الذكية والحديثة</h2>
      <p>إليك أهم الاتجاهات التقنية المطلوبة بقوة في الفلل الفاخرة والمشاريع التجارية الحديثة:</p>
      <ul>
        <li><strong>خلاطات بمستشعرات حركة (حساسات):</strong> تساهم في تقليل هدر المياه بنسبة تصل إلى 50% من خلال فتح وتدفق المياه فقط عند استشعار اليدين، وهي خيار أساسي للمجمعات التجارية والفنادق والفلل الحديثة.</li>
        <li><strong>المراحيض الذكية (Smart Toilets):</strong> تتميز بأنظمة تنظيف مدمجة ذاتية، تسخين للمقاعد، تحكم بالريموت كنترول، وأنظمة تدفق مياه ذكية تستهلك الحد الأدنى من اللترات للمرة الواحدة (موافقة لمتطلبات كفاءة المياه).</li>
        <li><strong>أنظمة الدش الحرارية (Thermostatic Showers):</strong> تتيح الحفاظ على درجة حرارة مياه ثابتة فور تشغيل الدش لمنع هدر المياه في انتظار وصول المياه الساخنة.</li>
      </ul>

      <h2>أدوات صحية موفرة للمياه واعتمادات المواصفات السعودية (SASO)</h2>
      <p>تفرض الجهات التنظيمية في السعودية شروطاً صارمة على كفاءة استهلاك المياه للأدوات الصحية المستوردة والمباعة محلياً. يجب أن تحمل جميع المنتجات بطاقة ترشيد استهلاك المياه الرسمية، والتي تصنف المنتجات بناءً على كمية المياه المستهلكة، وهو أمر ضروري للحصول على شهادة إتمام البناء.</p>

      <h2>إيست بلس: خيارك الأمثل للأدوات الصحية الذكية والحديثة</h2>
      <p>نعمل في شركة إيست بلس للتجارة كـ <strong>مورد أدوات صحية</strong> رائد في الرياض، ونوفر لعملائنا كبرى تشكيلات الخلاطات الذكية والأطقم الصحية الموفرة للمياه المطابقة لشهادات الجودة السعودية بأسعار الجملة التنافسية.</p>',
   'Smart and Water-Saving Sanitary Ware Trends for 2026: Sourcing Guide for Luxury Projects',
   'Discover the latest technologies in smart sanitary ware, sensor mixers, and water conservation systems required for modern villa projects in KSA.',
   '<h2>Technological Evolution in Modern Bathroom Sourcing</h2>
      <p>The sanitary ware industry has undergone a technological shift. Bathrooms are now smart spaces prioritizing comfort, hygiene, and water conservation in line with Saudi Arabia''s sustainability goals.</p>

      <h2>Key Smart Sanitary Ware Trends for Modern Projects</h2>
      <p>Here are the top-requested smart technologies in luxury villas and commercial structures:</p>
      <ul>
        <li><strong>Sensor-Operated Mixers:</strong> Reduce water waste by up to 50% by flowing water only when hands are detected. Essential for commercial spaces and modern villas.</li>
        <li><strong>Smart Toilets:</strong> Feature self-cleaning nozzles, seat warmers, remote controls, and optimized flush mechanisms using minimal water volume.</li>
        <li><strong>Thermostatic Showers:</strong> Lock water temperature instantly, eliminating water waste while waiting for hot water.</li>
      </ul>

      <h2>Water Conservation & SASO Compliance</h2>
      <p>Saudi authorities enforce strict regulations on sanitary ware water consumption. Fixtures must carry the official SASO water conservation tag, which is essential to pass building inspection clearances.</p>

      <h2>Source Smart Sanitary Fixtures from EAST PLUS</h2>
      <p>As a leading <strong>sanitary ware supplier</strong> in Riyadh, EAST PLUS offers modern water-saving mixers, toilets, and fittings complying with SASO standards at wholesale prices.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '13 days', '00000000-0000-0000-0000-000000000001');

-- Final Extra SEO Blog Posts
insert into public.blog_posts (slug, title, excerpt, content, title_en, excerpt_en, content_en, category, category_en, published, published_at, author_id) values
  ('ppr-versus-galvanized-pipes-renovation',
   'مقارنة بين مواسير PPR ومواسير الحديد المجلفن في مشاريع الترميم',
   'قارن بين مواسير PPR الحرارية ومواسير الحديد المجلفن القديمة في أعمال السباكة والترميم بالرياض لمعرفة أيهما أفضل لمشروعك.',
   '<h2>تطور مواد السباكة عبر العقود</h2>
      <p>عند القيام بأعمال ترميم المباني القديمة في المملكة، يواجه المشرفون معضلة استبدال شبكات المياه التالفة. كانت <strong>مواسير حديد مجلفن</strong> هي الخيار السائد في عقود مضت، ولكن مع ظهور التكنولوجيا الحديثة، أصبحت <strong>مواسير PPR</strong> الحرارية هي البديل القياسي المعتمد في كود البناء الحديث.</p>

      <h2>عيوب الحديد المجلفن في شبكات التغذية</h2>
      <p>رغم صلابة الحديد المجلفن وقدرته العالية على تحمل الصدمات الخارجية، إلا أنه يعاني من مشكلات جوهرية مع مرور الوقت:</p>
      <ul>
        <li>تآكل طبقة الجلفنة الداخلية وتراكم الصدأ، مما يؤدي إلى تغير طعم ورائحة ولون مياه الشرب.</li>
        <li>انسداد القطر الداخلي للمواسير تدريجياً بسبب ترسبات الكالسيوم والأملاح، مما يضعف ضغط المياه في المبنى.</li>
        <li>صعوبة التعديل والصيانة وتطلبها لأعمال سن وقلوظة ولحام معقدة تزيد من تكلفة الأيدي العاملة.</li>
      </ul>

      <h2>لماذا تعتبر مواسير PPR الحل المثالي للترميم؟</h2>
      <p>تتميز مواسير بولي بروبيلين (PPR) بخصائص تجعلها الخيار المتفوق بلا منازع في أعمال تجديد السباكة:</p>
      <ul>
        <li>مقاومة كاملة للصدأ والتآكل الكيميائي، مما يضمن تدفق مياه نقية وصحية تماماً.</li>
        <li>نعومة جدرانها الداخلية التي تمنع تراكم الترسبات والكلور، وتحافظ على ضغط مياه ثابت.</li>
        <li>سهولة التركيب عن طريق اللحام الحراري (ماكينة الكوي)، مما ينتج عنه وصلات مندمجة تماماً تمنع أي احتمالية للتسريب مستقبلاً.</li>
      </ul>

      <h2>شراء مستلزمات السباكة والترميم من إيست بلس</h2>
      <p>نوفر في إيست بلس للتجارة خيارات توريد شاملة لكافة أنواع أنابيب PPR والوصلات والمحابس من كبرى العلامات التجارية بأسعار الجملة، مع تقديم الدعم الفني للمقاولين لاختيار القطع الأنسب لمشاريع الترميم.</p>',
   'Comparison Between PPR Pipes and Galvanized Iron Pipes in Renovation Projects',
   'Compare PPR thermal pipes and legacy galvanized iron pipes in plumbing renovation works in Riyadh to find the best option for your building.',
   '<h2>The Evolution of Plumbing Sourcing Materials</h2>
      <p>During old building renovations in KSA, engineers face the dilemma of replacing aged water networks. Legacy <strong>galvanized iron pipes</strong> were once the standard, but modern <strong>PPR pipes</strong> have become the certified choice in the Saudi Building Code.</p>

      <h2>Drawbacks of Legacy Galvanized Iron</h2>
      <p>Despite their outer strength, galvanized iron pipes suffer from key issues over decades of service:</p>
      <ul>
        <li>Degradation of the internal zinc coating leading to rust, affecting water taste and quality.</li>
        <li>Internal calcification and scale build-up, narrowing the pipe diameter and lowering water pressure.</li>
        <li>Difficult maintenance, requiring threading and complex mechanical joints that raise labor costs.</li>
      </ul>

      <h2>Why PPR Pipes are Ideal for Renovation Sourcing</h2>
      <p>PPR (Polypropylene Random Copolymer) offers major benefits that make it superior for re-piping:</p>
      <ul>
        <li>Total resistance to rust and chemical attack, ensuring clean and healthy drinking water.</li>
        <li>Smooth internal walls preventing scale accumulation, maintaining constant water pressure.</li>
        <li>Fast installation via thermal fusion welding, creating fused leak-proof joints.</li>
      </ul>

      <h2>Source Renovation Sourcing Materials from EAST PLUS</h2>
      <p>EAST PLUS provides a full catalog of PPR pipes, fittings, and heavy brass valves at wholesale rates, assisting contractors in sourcing the right specifications for renovation projects.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '14 days', '00000000-0000-0000-0000-000000000001'),

  ('basement-retaining-wall-waterproofing-riyadh',
   'عزل الجدران الاستنادية والأقبية في الرياض: دليل حماية أساسات المباني',
   'تعرّف على أهمية عزل الجدران الاستنادية والأقبية (البدرومات) بالرياض لحماية الهياكل الخرسانية من ضغط التربة والمياه الجوفية الضارة.',
   '<h2>مخاطر إهمال عزل الأساسات والأقبية</h2>
      <p>تمثل الأقبية (البدرومات) والجدران الاستنادية الملامسة للتربة الأجزاء الأكثر عرضة لضغط الرطوبة والمياه الجوفية المحملة بالأملاح الضارة. إن تسرب المياه إلى هذه الأجزاء يؤدي إلى تفتت الخرسانة وصدأ حديد التسليح الأساسي، مما يهدد السلامة الإنشائية للمبنى بأكمله ويتطلب ترميمات معقدة وباهظة التكلفة.</p>

      <h2>خطوات عزل الجدران الاستنادية والأساسات</h2>
      <p>تتطلب عملية <strong>عزل جدران استنادية</strong> وأقبية تطبيق خطوات فنية صارمة لضمان حماية طويلة الأمد:</p>
      <ul>
        <li><strong>تنعيم السطح الخرساني:</strong> إزالة الزوائد الخشبية والنتوءات ومعالجة التعشيش بالخلطات الأسمنتية غير القابلة للانكماش (Grout).</li>
        <li><strong>تطبيق البرايمر (Primer):</strong> دهان وجه أساس من البيوتومين السائل البارد لتهيئة السطح وزيادة قوة التصاق طبقة العزل الرئيسية.</li>
        <li><strong>عزل البيتومين لفائف (Membrane):</strong> تركيب طبقتين من لفائف البيتومين بسمك 4 مم مع لحام الفواصل بالنار (البوري) بشكل متقاطع لضمان عدم تسرب المياه.</li>
        <li><strong>حماية العزل (Protection Board):</strong> تثبيت ألواح حماية من الفايبر أو البلاستيك لحماية لفائف العزل من التمزق أثناء عملية الردم بالتربة والحصى.</li>
      </ul>

      <h2>أهمية اختيار مورد مواد عزل بيتومين معتمد</h2>
      <p>تعتبر جودة لفائف البيتومين والبرايمر العامل الفاصل في نجاح عملية العزل. يجب أن تكون المواد مطابقة للاعتمادات السعودية ومقاومة لضغط المياه المستمر. ننصح بالبحث عن <strong>توريد مواد عزل بيتومين</strong> ذات مواصفات فنية معتمدة من كبرى المصانع الوطنية.</p>

      <h2>حلول عزل الأساسات من إيست بلس</h2>
      <p>توفر إيست بلس باقة متكاملة من مواد العزل المائي للأساسات والأقبية تشمل لفائف البيتومين 4 مم، البرايمر البارد والحار، وألواح حماية العزل، لتلبي احتياجات مقاولي العزل والأساسات بالرياض بأعلى معايير الأمان الإنشائي.</p>',
   'Waterproofing Retaining Walls and Basements in Riyadh: Foundation Protection Guide',
   'Sourcing guide for waterproofing basements and retaining walls in Riyadh to protect concrete skeletons from soil moisture and corrosive groundwater.',
   '<h2>Risks of Neglecting Basement Sourcing and Foundation Sourcing</h2>
      <p>Basements and retaining walls in contact with the ground are prone to hydrostatic pressure and corrosive salts. Sourcing sub-standard barriers leads to concrete degradation and rebar corrosion, putting the structural safety at risk.</p>

      <h2>Steps for Waterproofing Retaining Walls</h2>
      <p>Sourcing and installing a <strong>retaining wall insulation</strong> system demands strict technical protocols:</p>
      <ul>
        <li><strong>Surface Preparation:</strong> Smooth concrete protrusions and repair honeycombs using non-shrink cementitious grouts.</li>
        <li><strong>Primer Application:</strong> Apply a cold bituminous primer coat to promote adhesion of the main sheet.</li>
        <li><strong>Bituminous Membrane Sheet:</strong> Install two layers of 4mm bituminous membrane sheets with torched overlaps.</li>
        <li><strong>Protection Boards:</strong> Install fiberboard or plastic protection sheets to safeguard the membrane from puncture during backfilling.</li>
      </ul>

      <h2>Sourcing Certified Bitumen Sourcing Materials</h2>
      <p>The quality of the bitumen rolls and primers is key. Products must hold local technical approvals. Always verify properties when arranging the <strong>supply of bitumen insulation</strong>.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>EAST PLUS supplies everything needed for basement waterproofing: 4mm membranes, primers, and protection boards, helping KSA contractors execute foundation works safely.</p>',
   'العزل',
   'Insulation',
   true, now() - interval '15 days', '00000000-0000-0000-0000-000000000001'),

  ('central-versus-single-water-heaters-villas',
   'السخانات المركزية مقابل السخانات الفردية للفلل: كيف تقارن وتختار الأنسب؟',
   'تعرّف على الفروق بين أنظمة السخانات المركزية والسخانات الفردية (العادية) للفلل السكنية الكبيرة بالرياض لتحديد الخيار الأكثر أماناً وتوفيراً للطاقة.',
   '<h2>تأمين المياه الساخنة في الفلل السكنية</h2>
      <p>يعد تأمين إمدادات مستقرة وآمنة من المياه الساخنة متطلباً أساسياً في مشاريع الفلل السكنية الكبيرة. مع تعدد دورات المياه والمطابخ، يحتار الملاك والمقاولون بين خيارين رئيسيين: <strong>توريد سخانات</strong> فردية مستقلة لكل حمام، أو الانتقال إلى نظام السخان المركزي (Central Water Heater) المتكامل.</p>

      <h2>مزايا وعيوب السخانات الفردية المستقلة</h2>
      <p>السخانات الفردية (المثبتة داخل الحمام أو في السقف المستعار) هي الخيار الكلاسيكي:</p>
      <ul>
        <li><strong>المميزات:</strong> سهولة التركيب، انخفاض التكلفة التأسيسية، واستقلال كل حمام عن الآخر (في حال حدوث عطل لا تتأثر بقية المنزل).</li>
        <li><strong>العيوب:</strong> تشغل مساحة داخل الحمامات، تؤثر على الشكل الجمالي للديكور الداخلي، وتتطلب تمديدات كهربائية متعددة وصيانة متكررة لكل سخان على حدة.</li>
      </ul>

      <h2>مزايا وعيوب نظام السخان المركزي للفلل</h2>
      <p>يعتمد النظام المركزي على تركيب سخان واحد أو اثنين ذوي سعة ضخمة (مثلاً 80 أو 120 جالون) على سطح المبنى لتغذية كافة حمامات الفيلا عبر شبكة أنابيب معزولة حرارياً ودورة تدوير مياه (Recirculation Line):</p>
      <ul>
        <li><strong>المميزات:</strong> حمامات خالية من السخانات ومظهر جمالي نظيف، تدفق مياه ساخنة فوري عند فتح الصنبور بفضل خط التدوير، وتقليل عدد نقاط الصيانة والكهرباء.</li>
        <li><strong>العيوب:</strong> تكلفة تأسيسية مرتفعة، تطلب شبكة أنابيب تغذية وتدوير معقدة ومعزولة، وفي حال تعطل السخان الرئيسي قد تنقطع المياه الساخنة عن الفيلا بالكامل لحين الإصلاح.</li>
      </ul>

      <h2>إيست بلس: مورد معتمد لكافة خيارات السخانات ومضخات التدوير</h2>
      <p>سواء كنت تفضل السخانات الفردية المعتمدة (مثل سخانات الخزف السعودي) أو أنظمة السخانات المركزية ومضخات التدوير، فإن إيست بلس توفر لك حلول توريد متكاملة تلبي احتياجات مشروعك بضمانات طويلة وأسعار جملة تنافسية.</p>',
   'Central vs Single Water Heaters for Villas: How to Compare and Sourcing the Best Option',
   'Sourcing guide comparing central water heating systems versus single (individual) heaters for residential villas in Riyadh.',
   '<h2>Securing Hot Water Delivery in Villa Sourcing</h2>
      <p>Providing hot water to bathrooms and kitchens in luxury villas is a key plumbing requirement. Contractors choose between arranging the <strong>supply of water heaters</strong> for each wet area individually or sourcing a single central system.</p>

      <h2>Pros and Cons of Individual Water Heaters</h2>
      <p>Individual wall or ceiling heaters are the traditional choice:</p>
      <ul>
        <li><strong>Pros:</strong> Low initial cost, easy plumbing, and localized maintenance.</li>
        <li><strong>Cons:</strong> Take up interior space, affect bathroom aesthetics, and require multiple electrical connections.</li>
      </ul>

      <h2>Pros and Cons of Central Water Heating Systems</h2>
      <p>Central systems utilize one or two large heaters (80 to 120 gallons) installed on the roof feeding all areas via insulated pipes and a water recirculation loop:</p>
      <ul>
        <li><strong>Pros:</strong> Aesthetically clean bathrooms (no visible heaters), instant hot water availability at tap turn, and consolidated maintenance.</li>
        <li><strong>Cons:</strong> Higher initial system cost and complex plumbing layouts.</li>
      </ul>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>Whether sourcing individual units (like Saudi Ceramic) or central heating systems with loop pumps, EAST PLUS supplies certified products matching your villa project needs.</p>',
   'السباكة',
   'Plumbing',
   true, now() - interval '16 days', '00000000-0000-0000-0000-000000000001'),

  ('three-phase-electrical-panel-installation',
   'دليل تركيب لوحات الكهرباء 3 فاز ومواصفاتها الفنية للمشاريع',
   'تعرّف على أهمية ومواصفات لوحات التوزيع الكهربائية 3 فاز (Three-Phase) وطريقة توزيع الأحمال للمصانع والفلل والمجمعات السكنية الكبرى بالسعودية.',
   '<h2>ما هو نظام الكهرباء 3 فاز (Three-Phase)؟</h2>
      <p>تتطلب المنشآت الصناعية والمباني السكنية الكبيرة (التي تتجاوز فيها الأحمال الكهربائية حدوداً معينة) نظام تغذية قوي ومستقر. هنا يبرز دور نظام 3 فاز (ثلاثي الطور) بجهد 230/400 فولت المعتمد من الشركة السعودية للكهرباء لتأمين طاقة مستقرة للمكيفات المركزية والمصاعد والآلات الثقيلة دون انقطاع.</p>

      <h2>أهمية توزيع الأحمال في لوحة التوزيع 3 فاز</h2>
      <p>عند <strong>توريد لوحات كهرباء</strong> من نظام 3 فاز، تكمن الخطوة الأكثر أهمية في عملية توزيع الأحمال الكهربائية بشكل متوازن بين الأطوار الثلاثة (الأحمر، الأصفر، الأزرق). عدم توازن الأحمال يؤدي إلى:</p>
      <ul>
        <li>ارتفاع درجة حرارة السلك المحايد (Neutral) مما يعرض الأجهزة لخطر التلف.</li>
        <li>فصل مفاجئ للقواطع الرئيسية نتيجة زيادة الحمل على طور واحد دون الآخرين.</li>
        <li>ضعف كفاءة استهلاك الطاقة وزيادة قيمة الفواتير.</li>
      </ul>

      <h2>مواصفات اختيار القواطع الكهربائية 3 فاز</h2>
      <p>يجب أن تكون القواطع الكهربائية المدمجة في اللوحة (Molded Case Circuit Breaker - MCCB) ذات قدرة قطع كافية وتوافق كامل مع المعايير السعودية لمنع حدوث التماسات كهربائية وحماية كابلات التغذية الرئيسية. نتميز في <strong>توريد قواطع كهربائية</strong> من ماركات عالمية موثوقة تضمن السلامة الكاملة.</p>

      <h2>إيست بلس: خيارك لتفصيل وتوريد اللوحات الكهربائية</h2>
      <p>توفر إيست بلس خدمات توريد اللوحات الكهربائية 3 فاز المفصلة للمشاريع بمختلف المقاسات والقدرات (من 100 أمبير إلى 400 أمبير فما فوق)، لتضمن مطابقة مشروعك للمواصفات الفنية لشركة الكهرباء والدفاع المدني.</p>',
   'Guide to Three-Phase Electrical Panel Specifications and Installation for Projects',
   'Learn the importance of three-phase distribution boards and load balancing methods for factories, commercial spaces, and villas in Saudi Arabia.',
   '<h2>What is a Three-Phase Electrical System?</h2>
      <p>Industrial facilities and large commercial/residential complexes demand a stable power feed. The 3-phase (230/400V) system certified by SEC in Saudi Arabia supplies balanced power for central ACs, elevators, and machinery.</p>

      <h2>The Importance of Load Balancing in 3-Phase Panels</h2>
      <p>When arranging the <strong>supply of electrical panels</strong>, load balancing between the three phases (Red, Yellow, Blue) is critical. Imbalance results in:</p>
      <ul>
        <li>Overheating of the neutral wire, posing a safety hazard.</li>
        <li>Frequent tripping of the main breaker due to overload on a single phase.</li>
        <li>Higher power consumption and billing costs.</li>
      </ul>

      <h2>Circuit Breakers Sourcing for 3-Phase Panel Boards</h2>
      <p>Molded Case Circuit Breakers (MCCB) must comply with Saudi SEC grid standards. We focus on the <strong>supply of electrical circuit breakers</strong> featuring high breaking capacities from globally recognized brands.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>EAST PLUS supplies customized 3-phase electrical distribution boards from 100A to 400A+ configurations, helping projects satisfy local grid requirements.</p>',
   'الكهرباء',
   'Electrical',
   true, now() - interval '17 days', '00000000-0000-0000-0000-000000000001'),

  ('concrete-repair-crack-injection-materials',
   'دليل مواد ترميم الخرسانة وإصلاح تصدعات المباني الإنشائية',
   'تعرّف على أهم مواد ترميم الخرسانة والمواد الأسمنتية غير القابلة للانكماش وإيبوكسي حقن الشروخ المستخدمة في تدعيم وترميم الهياكل الإنشائية بالسعودية.',
   '<h2>التصدعات الخرسانية: الأسباب والخطورة</h2>
      <p>تتعرض الهياكل الخرسانية للمباني للعديد من العوامل التي قد تؤدي لظهور تصدعات، مثل هبوط التربة، الحمولات الزائدة، أو تسرب الرطوبة والمياه الجوفية الذي يسبب صدأ حديد التسليح وتمدده. تعد معالجة هذه المشكلات باستخدام مواد هندسية متخصصة خطوة أساسية للحفاظ على الهيكل الإنشائي ومنع انهيار المبنى.</p>

      <h2>أبرز مواد ترميم الخرسانة وتدعيمها</h2>
      <p>تتعدد مواد الترميم حسب نوع الشرخ ومكانه وحالة الخرسانة:</p>
      <ul>
        <li><strong>المواد الأسمنتية غير القابلة للانكماش (Grout):</strong> خلطات أسمنتية ذات قوة تدفق عالية وصلابة فائقة تستخدم لملء الفراغات تحت قواعد الآلات وتزريع الأعمدة وترميم التعشيش.</li>
        <li><strong>إيبوكسي حقن الشروخ (Epoxy Injection):</strong> راتنجات سائلة يتم حقنها تحت ضغط عالي داخل شروخ الجدران والأعمدة لإعادة ترابط الخرسانة ومنع تسرب الرطوبة للحديد.</li>
        <li><strong>قواطع ومقويات الفايبر (Carbon Fiber Sheets):</strong> ألياف الكربون فائقة القوة التي تلصق على الأعمدة والجسور لزيادة قدرتها على تحمل الأحمال دون زيادة في الحجم والوزن.</li>
      </ul>

      <h2>أهمية اختيار مورد مواد مقاولات وترميم معتمد</h2>
      <p>تتطلب أعمال التدعيم الإنشائي مواصفات صارمة ومواد معتمدة من استشاري المشروع. البحث عن <strong>مورد مواد مقاولات</strong> يوفر شهادات اختبار فنية معتمدة يضمن نجاح عملية الترميم وموافقة الجهات البلدية.</p>

      <h2>إيست بلس: شريك المقاولين في مواد الترميم والتشطيب</h2>
      <p>توفر إيست بلس للتجارة باقة متكاملة من خلطات الجراوت، الإيبوكسي، المواد اللاصقة للبناء، وشبكات اللياسة من موردين معتمدين لدعم مقاولي الترميم والإنشاءات بالمملكة بأفضل الأسعار.</p>',
   'Concrete Repair and Structural Crack Injection Materials Sourcing Guide',
   'Sourcing guide for concrete repair materials, non-shrink grouts, and epoxy injection systems used for structural reinforcement in KSA.',
   '<h2>Concrete Cracks: Causes and Severity</h2>
      <p>Concrete structures suffer from cracks due to soil settlement, overloading, or moisture leaks causing rebar rust. Repairing these defects using certified compounds is critical to extend the building''s lifespan.</p>

      <h2>Key Concrete Repair Materials</h2>
      <p>Repair materials match the crack type and structural layout:</p>
      <ul>
        <li><strong>Non-Shrink Cementitious Grout:</strong> Pourable grouts featuring high strength used for baseplates, columns, and structural filling.</li>
        <li><strong>Epoxy Injection Systems:</strong> Liquid resins injected under high pressure into structural cracks to restore concrete integrity.</li>
        <li><strong>Carbon Fiber Sheets (CFRP):</strong> High-tensile sheets bonded to beams and columns to boost load capacity without adding dead weight.</li>
      </ul>

      <h2>Choosing a Certified Contracting Materials Supplier</h2>
      <p>Structural reinforcement demands certified products approved by consulting engineers. Sourcing from a registered <strong>contracting materials supplier</strong> ensures passing authority inspections.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>EAST PLUS supplies certified grouts, epoxies, structural adhesives, and mesh products from reputable manufacturers to support KSA contractors in structural works.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '18 days', '00000000-0000-0000-0000-000000000001'),

  ('led-lighting-retrofitting-commercial-roi',
   'العائد الاقتصادي من استبدال إنارة المجمعات التجارية بنظام LED بالرياض',
   'تعرّف على كيف تساهم عملية استبدال الإنارة التقليدية بأنظمة إنارة LED الحديثة في توفير 70% من استهلاك الكهرباء وخفض تكاليف الصيانة في المجمعات التجارية.',
   '<h2>أثر الإنارة على تكاليف تشغيل المجمعات التجارية</h2>
      <p>تمثل تكاليف تشغيل المجمعات والأسواق التجارية عبئاً كبيراً على الشركات المالكة، وتعتبر الإنارة والتكييف المصدرين الأساسيين لاستهلاك الكهرباء. إن استبدال الإنارة التقليدية بنظام LED ليس مجرد تحسين للمظهر، بل هو استثمار اقتصادي ذكي يوفر مبالغ ضخمة على المدى القصير والمتوسط.</p>

      <h2>كيف يوفر نظام إنارة LED في فاتورة الكهرباء؟</h2>
      <p>تتميز لمبات LED بخصائص فنية متفوقة مقارنة بلمبات الفلورسنت أو الهالوجين التقليدية:</p>
      <ul>
        <li><strong>الكفاءة العالية:</strong> تستهلك طاقة كهربائية أقل بنسبة 70% لتوليد نفس شدة الإضاءة (Lumen).</li>
        <li><strong>انبعاث حراري منخفض:</strong> لا تصدر لمبات LED حرارة تذكر، مما يقلل الحمل الحراري داخل المبنى ويوفر بشكل غير مباشر 10% من طاقة التكييف.</li>
        <li><strong>العمر الافتراضي الطويل:</strong> تعمل لمبات LED لمدة تصل لـ 50,000 ساعة مقارنة بـ 8,000 ساعة للمبات التقليدية، مما يلغي تكاليف الاستبدال والصيانة المتكررة.</li>
      </ul>

      <h2>تطوير الإنارة والتوافق مع مواصفات كفاءة الطاقة</h2>
      <p>تسعى الهيئات التنظيمية في السعودية لتطبيق معايير كفاءة الطاقة بصرامة على المباني التجارية. يساهم <strong>توريد لمبات LED</strong> الحاصلة على بطاقة كفاءة الطاقة في تجنب المخالفات وتقليل البصمة الكربونية للمنشأة.</p>

      <h2>إيست بلس: شريكك لتوريد أنظمة الإنارة LED للمشاريع</h2>
      <p>توفر إيست بلس كبرى خيارات كشافات LED، الإنارة الغاطسة (Downlight)، الكشافات الخارجية، وحلول الإنارة الذكية للمجمعات التجارية والفلل السكنية بالرياض بأسعار الجملة التنافسية وبأعلى الضمانات.</p>',
   'The Economic ROI of LED Sourcing Retrofitting for Commercial Complexes in KSA',
   'Sourcing guide showing how retrofitting legacy commercial lighting with modern LED fixtures saves 70% in power and reduces maintenance costs.',
   '<h2>The Impact of Lighting on Commercial Operating Costs</h2>
      <p>Operating costs for commercial complexes and shopping malls are significant, with lighting and HVAC consuming the bulk of electricity. Sourcing LED lighting upgrades is a smart capital investment with rapid payback.</p>

      <h2>How Sourcing LED Systems Saves Energy</h2>
      <p>LED lamps outperform legacy fluorescent and metal halide fixtures in key technical metrics:</p>
      <ul>
        <li><strong>Higher Luminous Efficacy:</strong> LED lights consume up to 70% less wattage to deliver equivalent lumens.</li>
        <li><strong>Minimal Heat Dissipation:</strong> LEDs emit virtually no heat, reducing the internal thermal load and shaving 10% off HVAC cooling costs.</li>
        <li><strong>Long Lifespan:</strong> Working for up to 50,000 hours, compared to 8,000 hours for old bulbs, eliminating repeated replacement costs.</li>
      </ul>

      <h2>SASO Energy Conservation Tagging Compliance</h2>
      <p>Government agencies in Saudi Arabia enforce energy efficiency codes. Implementing the <strong>supply of LED bulbs</strong> holding official SASO energy efficiency labels ensures compliance and lowers utility bills.</p>

      <h2>EAST PLUS Sourcing Solutions</h2>
      <p>EAST PLUS supplies commercial LED panels, floodlights, high bays, and decorative fixtures for complexes and buildings in Riyadh, offering robust warranties at project pricing.</p>',
   'الكهرباء',
   'Electrical',
   true, now() - interval '19 days', '00000000-0000-0000-0000-000000000001'),

  ('pricing-boq-material-sourcing-tips',
   'تسعير جداول الكميات (BOQ): نصائح لتوريد مواد المشاريع بأفضل سعر',
   'تعرّف على أفضل النصائح لتسعير جداول الكميات وتوريد مواد المقاولات والبناء والتشطيب للمشاريع والشركات بأقل تكلفة وأسرع استجابة.',
   '<h2>ما هي جداول الكميات (BOQ) وما أهميتها؟</h2>
      <p>تمثل جداول الكميات (Bill of Quantities) الوثيقة المركزية التي تحدد كافة البنود والمواصفات الفنية والمواد المطلوبة لتنفيذ أي مشروع إنشائي. إن دقة وسرعة <strong>تسعير جداول الكميات</strong> هي الخطوة الأولى للفوز بالمناقصات وتحديد التكلفة الفعلية للمشروع لتجنب الخسائر المالية غير المتوقعة.</p>

      <h2>نصائح هامة لمسؤولي المشتريات لتسعير جداول الكميات</h2>
      <p>عند دراسة جداول الكميات وتوريد مواد البناء والسباكة والكهرباء، يجب على مسؤولي المشتريات مراعاة العوامل التالية:</p>
      <ul>
        <li><strong>البحث عن مورد مواد مقاولات متكامل:</strong> التعامل مع مورد يوفر كافة بنود الهيكل الإنشائي والتشطيبات يقلل من تكاليف الخدمات اللوجستية ويمنحك أسعاراً تفضيلية مقارنة بالتشتت بين عدة جهات.</li>
        <li><strong>طلب البدائل المعتمدة:</strong> في حال ارتفاع سعر مادة معينة، استشر المورد لتقديم بدائل معتمدة فنية ومطابقة للمواصفات ومقبولة لدى استشاري المشروع لتوفير التكلفة.</li>
        <li><strong>تحديد مواعيد التوريد بدقة:</strong> احرص على الاتفاق على مواعيد توريد تتزامن مع مراحل العمل في الموقع لتجنب تراكم المواد وتلفها.</li>
      </ul>

      <h2>أهمية السرعة في إعداد عروض الأسعار للمناقصات</h2>
      <p>في عالم المقاولات السريع، يعتبر الوقت عاملاً حاسماً. إن التعامل مع <strong>شركة توريد مشاريع</strong> تلتزم بإصدار عروض الأسعار ومطابقة المواصفات الفنية خلال 24 إلى 48 ساعة يعزز فرص المقاول في تقديم عرضه والفوز بالمناقصة بنجاح.</p>

      <h2>حلول تسعير جداول الكميات من إيست بلس</h2>
      <p>في إيست بلس للتجارة، نمتلك فريقاً هندسياً متخصصاً في دراسة وتسعير جداول الكميات (BOQ) وتوريد كافة مستلزمات المشاريع السكنية والتجارية في السعودية بأسعار الجملة وبأقصى سرعة استجابة.</p>',
   'Pricing Bills of Quantities (BOQ): Sourcing Tips for Project Materials Sourcing',
   'Sourcing tips for pricing Bills of Quantities (BOQ) and sourcing contracting materials for corporate and public projects in Saudi Arabia.',
   '<h2>What is a Bill of Quantities (BOQ) and Why Does It Matter?</h2>
      <p>A Bill of Quantities (BOQ) is the central document defining the materials and technical specifications for any construction project. Fast and accurate <strong>pricing of BOQs</strong> is key to winning tenders and avoiding budget overruns.</p>

      <h2>Sourcing Tips for Procurement Officers Sourcing Projects</h2>
      <p>When analyzing BOQs for plumbing, electrical, and construction items, keep these tips in mind:</p>
      <ul>
        <li><strong>Consolidate with an Integrated Sourcing Partner:</strong> Dealing with a single supplier for structural and finishing items lowers logistics costs and unlocks volume discounts.</li>
        <li><strong>Inquire for Approved Equivalents:</strong> Ask the supplier for alternative, approved equivalent materials that meet technical approvals but cost less.</li>
        <li><strong>Align Delivery Milestones:</strong> Contract deliveries to align with construction phases to prevent storage damage.</li>
      </ul>

      <h2>Speed of Sourcing Quotations Wins Tenders</h2>
      <p>In contracting, timing is everything. Sourcing from a <strong>project supply company</strong> that issues complete, itemized quotes matching technical specs within 24 to 48 hours is a major competitive advantage.</p>

      <h2>EAST PLUS Sourcing BOQ Solutions</h2>
      <p>At EAST PLUS, we have a dedicated team analyzing and pricing Bills of Quantities (BOQ), supplying comprehensive building, plumbing, and electrical materials at wholesale prices.</p>',
   'مواد البناء',
   'Building Materials',
   true, now() - interval '20 days', '00000000-0000-0000-0000-000000000001');
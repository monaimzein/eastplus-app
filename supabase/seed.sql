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

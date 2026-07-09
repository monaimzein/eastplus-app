import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing environment variables. Make sure to run with --env-file=.env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

// The author ID we resolved from the profiles table (admin user)
const AUTHOR_ID = 'f0519958-e3c8-4cb1-b5c6-a12996c61033';

const POSTS = [
  {
    slug: 'ppr-versus-galvanized-pipes-renovation',
    category: 'السباكة',
    category_en: 'Plumbing',
    cover_image: '/images/services/plumbing.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'مقارنة بين مواسير PPR ومواسير الحديد المجلفن في مشاريع الترميم',
    excerpt: 'قارن بين مواسير PPR الحرارية ومواسير الحديد المجلفن القديمة في أعمال السباكة والترميم بالرياض لمعرفة أيهما أفضل لمشروعك.',
    seo_title: 'مواسير PPR مقابل الحديد المجلفن في الترميم - إيست بلس',
    seo_description: 'قارن بين مواسير PPR الحرارية ومواسير الحديد المجلفن في مشاريع ترميم وتجديد سباكة المباني بالرياض، واحصل على أفضل أسعار الجملة للتوريد.',
    content: `
      <h2>تطور مواد السباكة عبر العقود</h2>
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
      <p>نوفر في إيست بلس للتجارة خيارات توريد شاملة لكافة أنواع أنابيب PPR والوصلات والمحابس من كبرى العلامات التجارية بأسعار الجملة، مع تقديم الدعم الفني للمقاولين لاختيار القطع الأنسب لمشاريع الترميم.</p>
    `,
    title_en: 'Comparison Between PPR Pipes and Galvanized Iron Pipes in Renovation Projects',
    excerpt_en: 'Compare PPR thermal pipes and legacy galvanized iron pipes in plumbing renovation works in Riyadh to find the best option for your building.',
    seo_title_en: 'PPR vs Galvanized Iron Pipes in Renovation - EAST PLUS',
    seo_description_en: 'Compare PPR thermal pipes with galvanized iron in building plumbing renovations. Find out why PPR is the standard and get wholesale prices.',
    content_en: `
      <h2>The Evolution of Plumbing Sourcing Materials</h2>
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
      <p>EAST PLUS provides a full catalog of PPR pipes, fittings, and heavy brass valves at wholesale rates, assisting contractors in sourcing the right specifications for renovation projects.</p>
    `
  },
  {
    slug: 'basement-retaining-wall-waterproofing-riyadh',
    category: 'العزل',
    category_en: 'Insulation',
    cover_image: '/images/services/insulation.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'عزل الجدران الاستنادية والأقبية في الرياض: دليل حماية أساسات المباني',
    excerpt: 'تعرّف على أهمية عزل الجدران الاستنادية والأقبية (البدرومات) بالرياض لحماية الهياكل الخرسانية من ضغط التربة والمياه الجوفية الضارة.',
    seo_title: 'عزل جدران استنادية وأقبية بالرياض | مواد العزل - إيست بلس',
    seo_description: 'تعلّم كيفية عزل الجدران الاستنادية والأقبية (البدرومات) بالرياض لحماية الأساسات من المياه الجوفية والرطوبة، واشترِ مواد عزل بيتومين معتمدة بالجملة.',
    content: `
      <h2>مخاطر إهمال عزل الأساسات والأقبية</h2>
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
      <p>توفر إيست بلس باقة متكاملة من مواد العزل المائي للأساسات والأقبية تشمل لفائف البيتومين 4 مم، البرايمر البارد والحار، وألواح حماية العزل، لتلبي احتياجات مقاولي العزل والأساسات بالرياض بأعلى معايير الأمان الإنشائي.</p>
    `,
    title_en: 'Waterproofing Retaining Walls and Basements in Riyadh: Foundation Protection Guide',
    excerpt_en: 'Sourcing guide for waterproofing basements and retaining walls in Riyadh to protect concrete skeletons from soil moisture and corrosive groundwater.',
    seo_title_en: 'Sourcing Basement & Retaining Wall Waterproofing - EAST PLUS',
    seo_description_en: 'Sourcing retaining wall waterproofing materials in Riyadh? EAST PLUS supplies 4mm bitumen rolls, primers, and protection boards at wholesale prices.',
    content_en: `
      <h2>Risks of Neglecting Basement Sourcing and Foundation Sourcing</h2>
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
      <p>EAST PLUS supplies everything needed for basement waterproofing: 4mm membranes, primers, and protection boards, helping KSA contractors execute foundation works safely.</p>
    `
  },
  {
    slug: 'central-versus-single-water-heaters-villas',
    category: 'السباكة',
    category_en: 'Plumbing',
    cover_image: '/images/services/sanitary.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'السخانات المركزية مقابل السخانات الفردية للفلل: كيف تقارن وتختار الأنسب؟',
    excerpt: 'تعرّف على الفروق بين أنظمة السخانات المركزية والسخانات الفردية (العادية) للفلل السكنية الكبيرة بالرياض لتحديد الخيار الأكثر أماناً وتوفيراً للطاقة.',
    seo_title: 'السخانات المركزية مقابل الفردية للفلل | توريد سخانات - إيست بلس',
    seo_description: 'قارن بين السخانات المركزية والسخانات الفردية للفلل بالرياض. تعرّف على الميزات والعيوب واحصل على أفضل أسعار توريد سخانات للمشاريع من إيست بلس.',
    content: `
      <h2>تأمين المياه الساخنة في الفلل السكنية</h2>
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
      <p>سواء كنت تفضل السخانات الفردية المعتمدة (مثل سخانات الخزف السعودي) أو أنظمة السخانات المركزية ومضخات التدوير، فإن إيست بلس توفر لك حلول توريد متكاملة تلبي احتياجات مشروعك بضمانات طويلة وأسعار جملة تنافسية.</p>
    `,
    title_en: 'Central vs Single Water Heaters for Villas: How to Compare and Sourcing the Best Option',
    excerpt_en: 'Sourcing guide comparing central water heating systems versus single (individual) heaters for residential villas in Riyadh.',
    seo_title_en: 'Sourcing Central vs Single Water Heaters - EAST PLUS',
    seo_description_en: 'Sourcing water heaters in Riyadh? Compare central and individual water heating systems for villas. Get competitive project pricing from EAST PLUS.',
    content_en: `
      <h2>Securing Hot Water Delivery in Villa Sourcing</h2>
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
      <p>Whether sourcing individual units (like Saudi Ceramic) or central heating systems with loop pumps, EAST PLUS supplies certified products matching your villa project needs.</p>
    `
  },
  {
    slug: 'three-phase-electrical-panel-installation',
    category: 'الكهرباء',
    category_en: 'Electrical',
    cover_image: '/images/services/electrical.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'دليل تركيب لوحات الكهرباء 3 فاز ومواصفاتها الفنية للمشاريع',
    excerpt: 'تعرّف على أهمية ومواصفات لوحات التوزيع الكهربائية 3 فاز (Three-Phase) وطريقة توزيع الأحمال للمصانع والفلل والمجمعات السكنية الكبرى بالسعودية.',
    seo_title: 'تركيب لوحات كهرباء 3 فاز | توريد لوحات وقواطع - إيست بلس',
    seo_description: 'تعرّف على مواصفات لوحات التوزيع الكهربائية 3 فاز (ثلاثي الطور) للمشاريع والمصانع بالرياض، واطلب خدمات توريد لوحات وقواطع كهربائية أصلية من إيست بلس.',
    content: `
      <h2>ما هو نظام الكهرباء 3 فاز (Three-Phase)؟</h2>
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
      <p>توفر إيست بلس خدمات توريد اللوحات الكهربائية 3 فاز المفصلة للمشاريع بمختلف المقاسات والقدرات (من 100 أمبير إلى 400 أمبير فما فوق)، لتضمن مطابقة مشروعك للمواصفات الفنية لشركة الكهرباء والدفاع المدني.</p>
    `,
    title_en: 'Guide to Three-Phase Electrical Panel Specifications and Installation for Projects',
    excerpt_en: 'Learn the importance of three-phase distribution boards and load balancing methods for factories, commercial spaces, and villas in Saudi Arabia.',
    seo_title_en: 'Three-Phase Electrical Panel Sourcing KSA - EAST PLUS',
    seo_description_en: 'Sourcing 3-phase distribution boards in Riyadh? Learn specifications and load balancing methods. Get competitive rates for panels and breakers from EAST PLUS.',
    content_en: `
      <h2>What is a Three-Phase Electrical System?</h2>
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
      <p>EAST PLUS supplies customized 3-phase electrical distribution boards from 100A to 400A+ configurations, helping projects satisfy local grid requirements.</p>
    `
  },
  {
    slug: 'concrete-repair-crack-injection-materials',
    category: 'مواد البناء',
    category_en: 'Building Materials',
    cover_image: '/images/services/construction.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'دليل مواد ترميم الخرسانة وإصلاح تصدعات المباني الإنشائية',
    excerpt: 'تعرّف على أهم مواد ترميم الخرسانة والمواد الأسمنتية غير القابلة للانكماش وإيبوكسي حقن الشروخ المستخدمة في تدعيم وترميم الهياكل الإنشائية بالسعودية.',
    seo_title: 'مواد ترميم خرسانة وإصلاح شروخ بالرياض | إيست بلس',
    seo_description: 'تبحث عن مواد ترميم خرسانة أو جراوت وإيبوكسي حقن شروخ بالرياض؟ إيست بلس توفر مواد المقاولات والترميم الإنشائي بأسعار الجملة المعتمدة للمشاريع.',
    content: `
      <h2>التصدعات الخرسانية: الأسباب والخطورة</h2>
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
      <p>توفر إيست بلس للتجارة باقة متكاملة من خلطات الجراوت، الإيبوكسي، المواد اللاصقة للبناء، وشبكات اللياسة من موردين معتمدين لدعم مقاولي الترميم والإنشاءات بالمملكة بأفضل الأسعار.</p>
    `,
    title_en: 'Concrete Repair and Structural Crack Injection Materials Sourcing Guide',
    excerpt_en: 'Sourcing guide for concrete repair materials, non-shrink grouts, and epoxy injection systems used for structural reinforcement in KSA.',
    seo_title_en: 'Sourcing Concrete Repair & Grout Materials - EAST PLUS',
    seo_description_en: 'Sourcing concrete repair grout or epoxy injection systems in Riyadh? EAST PLUS supplies structural reinforcement materials at wholesale rates.',
    content_en: `
      <h2>Concrete Cracks: Causes and Severity</h2>
      <p>Concrete structures suffer from cracks due to soil settlement, overloading, or moisture leaks causing rebar rust. Repairing these defects using certified compounds is critical to extend the building's lifespan.</p>

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
      <p>EAST PLUS supplies certified grouts, epoxies, structural adhesives, and mesh products from reputable manufacturers to support KSA contractors in structural works.</p>
    `
  },
  {
    slug: 'led-lighting-retrofitting-commercial-roi',
    category: 'الكهرباء',
    category_en: 'Electrical',
    cover_image: '/images/services/electrical.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'العائد الاقتصادي من استبدال إنارة المجمعات التجارية بنظام LED بالرياض',
    excerpt: 'تعرّف على كيف تساهم عملية استبدال الإنارة التقليدية بأنظمة إنارة LED الحديثة في توفير 70% من استهلاك الكهرباء وخفض تكاليف الصيانة في المجمعات التجارية.',
    seo_title: 'استبدال إنارة المجمعات التجارية بنظام LED بالرياض - إيست بلس',
    seo_description: 'تعرّف على العائد الاقتصادي والتوفير في فاتورة الكهرباء عند استبدال إنارة المنشآت والمجمعات بالرياض بأنظمة LED، واطلب عينات الجملة من إيست بلس.',
    content: `
      <h2>أثر الإنارة على تكاليف تشغيل المجمعات التجارية</h2>
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
      <p>توفر إيست بلس كبرى خيارات كشافات LED، الإنارة الغاطسة (Downlight)، الكشافات الخارجية، وحلول الإنارة الذكية للمجمعات التجارية والفلل السكنية بالرياض بأسعار الجملة التنافسية وبأعلى الضمانات.</p>
    `,
    title_en: 'The Economic ROI of LED Sourcing Retrofitting for Commercial Complexes in KSA',
    excerpt_en: 'Sourcing guide showing how retrofitting legacy commercial lighting with modern LED fixtures saves 70% in power and reduces maintenance costs.',
    seo_title_en: 'Sourcing Commercial LED Lighting Retrofits - EAST PLUS',
    seo_description_en: 'Sourcing LED lighting upgrades for commercial properties in KSA? Compare economic benefits and get wholesale quotes from EAST PLUS.',
    content_en: `
      <h2>The Impact of Lighting on Commercial Operating Costs</h2>
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
      <p>EAST PLUS supplies commercial LED panels, floodlights, high bays, and decorative fixtures for complexes and buildings in Riyadh, offering robust warranties at project pricing.</p>
    `
  },
  {
    slug: 'pricing-boq-material-sourcing-tips',
    category: 'مواد البناء',
    category_en: 'Building Materials',
    cover_image: '/images/services/projects.jpg',
    published: true,
    author_id: AUTHOR_ID,
    title: 'تسعير جداول الكميات (BOQ): نصائح لتوريد مواد المشاريع بأفضل سعر',
    excerpt: 'تعرّف على أفضل النصائح لتسعير جداول الكميات وتوريد مواد المقاولات والبناء والتشطيب للمشاريع والشركات بأقل تكلفة وأسرع استجابة.',
    seo_title: 'تسعير جداول الكميات بالرياض | توريد مواد مشاريع - إيست بلس',
    seo_description: 'تعرّف على أفضل النصائح لتسعير جداول الكميات (BOQ) وتوريد مواد المقاولات والبناء للمشاريع بالجملة بأسعار تفضيلية وسرعة استجابة متميزة.',
    content: `
      <h2>ما هي جداول الكميات (BOQ) وما أهميتها؟</h2>
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
      <p>في إيست بلس للتجارة، نمتلك فريقاً هندسياً متخصصاً في دراسة وتسعير جداول الكميات (BOQ) وتوريد كافة مستلزمات المشاريع السكنية والتجارية في السعودية بأسعار الجملة وبأقصى سرعة استجابة.</p>
    `,
    title_en: 'Pricing Bills of Quantities (BOQ): Sourcing Tips for Project Materials Sourcing',
    excerpt_en: 'Sourcing tips for pricing Bills of Quantities (BOQ) and sourcing contracting materials for corporate and public projects in Saudi Arabia.',
    seo_title_en: 'Sourcing BOQ Pricing & Sourcing Riyadh - EAST PLUS',
    seo_description_en: 'Sourcing materials from a Bill of Quantities (BOQ) in Riyadh? Sourcing contracting and building materials from EAST PLUS at wholesale project pricing.',
    content_en: `
      <h2>What is a Bill of Quantities (BOQ) and Why Does It Matter?</h2>
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
      <p>At EAST PLUS, we have a dedicated team analyzing and pricing Bills of Quantities (BOQ), supplying comprehensive building, plumbing, and electrical materials at wholesale prices.</p>
    `
  }
];

async function main() {
  console.log('Inserting more', POSTS.length, 'SEO blog posts into Supabase...');

  for (const post of POSTS) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(post, { onConflict: 'slug' })
      .select('id, slug, title');

    if (error) {
      console.error(`Error inserting post "${post.slug}":`, error.message);
    } else {
      console.log(`Successfully upserted: "${data[0].title}" (slug: ${data[0].slug})`);
    }
  }

  console.log('All insertions finished.');
}

main();

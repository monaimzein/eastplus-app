# EAST PLUS — قائمة الصور المطلوبة (للتوليد عبر ChatGPT Image 2.0)

> **توجيهات عامة لكل صورة:**
> - الأسلوب: Modern, premium, cinematic, editorial photography, 2026 commercial style.
> - الألوان السائدة: warm beige & champagne gold (#DCBE81)، أسود ناعم، أبيض دافئ.
> - الإضاءة: dramatic but clean lighting, golden hour or studio softbox.
> - يدعم الوضع الغامق (الموقع افتراضياً Dark Mode) — اجعل الصور بها عمق وتباين.
> - تجنب: نصوص داخل الصورة، شعارات شركات حقيقية، صور ضبابية أو رخيصة.
> - الصيغة: **JPG عالي الجودة 90%** ما عدا الشعارات (PNG شفاف).
> - المقاسات الموصى بها مذكورة مع كل صورة.

---

## 1) Hero Slider — الصفحة الرئيسية (3 صور)

**المسار:** `public/images/hero/`

### `hero-1.jpg` — 1920×1080
> Wide cinematic photo of a large modern construction warehouse at golden hour in Saudi Arabia. Stacked premium building materials (cement bags, ceramic tiles, copper pipes, electrical cables on reels) organized professionally. Forklifts in the background, soft warm light, slight haze, beige & champagne gold tones, ultra-clean composition, shot on 35mm, depth of field. No text, no logos.

### `hero-2.jpg` — 1920×1080
> Cinematic close-up of a businessman hands holding a tablet showing a glowing quote/invoice interface, with a blurred construction site in the background, warm beige + gold accent lighting, premium commercial photography, sense of speed and digital precision, 2026 vibe. No text on screen.

### `hero-3.jpg` — 1920×1080
> Modern construction crew of skilled workers (engineer with hard hat reviewing plans, electrician working on a panel, plumber installing PPR pipe, carpenter shaping wood) inside an upscale unfinished villa, warm golden interior light, beige tones, editorial composition, premium commercial photography. Saudi context. No brand logos.

---

## 2) Service pages — صفحات الخدمات (7 صور)

**المسار:** `public/images/services/`  — كل واحدة **1600×1000**

### `plumbing.jpg`
> Premium close-up of polished brass and chrome plumbing fittings — PPR pipes, valves, mixers, water pump — arranged on a dark warm surface, beige/champagne gold lighting, studio commercial photography, ultra crisp.

### `electrical.jpg`
> High-end editorial photo of electrical components — coiled copper cables, LED lighting strips glowing softly, distribution board, modern switches — on a dark walnut surface with warm gold rim light.

### `construction.jpg`
> Cinematic shot of construction materials stacked elegantly — cement bags, gypsum boards, ceramic tiles, silicon cartridges — at a Saudi construction site at sunset, golden warm light, dust particles.

### `sanitary.jpg`
> Luxury bathroom showroom: rain shower head, freestanding bathtub, marble basin, modern toilet, brass mixer — warm beige/champagne lighting, editorial commercial photography.

### `insulation.jpg`
> Workers applying bitumen waterproof insulation on a flat rooftop in Saudi Arabia, golden hour, dramatic shadows, beige and warm tones, professional commercial photography.

### `maintenance.jpg`
> Skilled maintenance technician in a clean uniform fixing a wall-mounted electrical panel inside a modern Saudi home, warm beige tones, professional and trustworthy mood.

### `projects.jpg`
> Construction crew (builders, carpenters, blacksmiths) collaborating on the structure of an upscale villa, warm sunset light, dust in the air, sense of teamwork and execution, beige and gold tones.

---

## 3) Gallery covers — أغلفة المعرض (3 صور)

**المسار:** `public/images/gallary/<اسم المجلد العربي>/cover.jpg` — مقاس **1200×1500** (Portrait 4:5)

### `gallary/البناء/cover.jpg`
> Tall cinematic photo of premium construction materials — stacked cement bags and gypsum sheets — at a luxury Saudi villa site, warm beige tones, golden hour, dramatic depth.

### `gallary/الكهرباء/cover.jpg`
> Vertical editorial close-up of LED lighting and copper cables glowing on a warm dark background, beige/gold tones, premium feel.

### `gallary/السباكة/cover.jpg`
> Vertical editorial photo of polished brass plumbing fittings (pipes, mixer, valve) on a warm beige stone counter, dramatic side lighting.

> داخل كل مجلد ضع أيضاً 8–12 صورة إضافية بالمقاس **1080×1080** (مربع) لتعبئة المعرض. أمثلة لأسماء الملفات: `01.jpg`, `02.jpg`, `03.jpg` ... سيقرأها الموقع تلقائياً.

> **صورة احتياطية (لو لم تضع cover):**
> `public/images/gallary/cover-fallback.jpg` — 1200×1500 — صورة عامة لمواد البناء بأسلوب فاخر.

---

## 4) About page — صفحة من نحن (2 صورة)

**المسار:** `public/images/about/`

### `about-hero.jpg` — 1920×1080
> Aerial cinematic shot of Riyadh skyline at golden hour with construction cranes, modern buildings, warm beige sky, premium commercial photography.

### `about-team.jpg` — 1600×1200
> Editorial photo of a Saudi business team (men + women in modern smart attire) reviewing project plans inside a sleek modern office with beige & gold interior, warm light, premium corporate photography.

---

## 5) Suppliers strip — شريط العلامات التجارية

**المسار:** `public/images/mowared/`

> الصور الموجودة حالياً (`download (92).png` ... `download (97).png`) **سيتم استخدامها كما هي**.
> لو رغبت بإضافة المزيد، سمّها بالنمط: `brand-01.png`, `brand-02.png` ... ثم أضفها إلى المصفوفة `SUPPLIER_LOGOS` في `src/lib/siteConfig.ts`.

**النمط:** PNG شفاف، ارتفاع موحد 80px، أبيض/رمادي فاتح ليظهر بشكل جيد على الخلفيات الداكنة.

---

## 6) Clients strip — شريط شركاء النجاح

**المسار:** `public/images/clients/`  — الأسماء المتوقعة:
- `client-1.png` ... `client-8.png`
- مقاس: **عرض 240×ارتفاع 80** (PNG شفاف)
- النمط: شعارات شركات بلون أبيض/فضي على شفافية، style 2026 minimal.

> لإضافة المزيد من الشعارات، أضف ملفات جديدة وحدّث المصفوفة `CLIENT_LOGOS` داخل [src/components/landing/ClientsMarquee.tsx](src/components/landing/ClientsMarquee.tsx).

---

## 7) Logo (موجود بالفعل)

> `public/logo.png` — موجود ويعمل بشكل جيد مع الثيم الذهبي.

---

## ملخص سريع للمسارات

```
public/
├── logo.png                       (موجود)
├── images/
│   ├── hero/
│   │   ├── hero-1.jpg ✦
│   │   ├── hero-2.jpg ✦
│   │   └── hero-3.jpg ✦
│   ├── services/
│   │   ├── plumbing.jpg ✦
│   │   ├── electrical.jpg ✦
│   │   ├── construction.jpg ✦
│   │   ├── sanitary.jpg ✦
│   │   ├── insulation.jpg ✦
│   │   ├── maintenance.jpg ✦
│   │   └── projects.jpg ✦
│   ├── about/
│   │   ├── about-hero.jpg ✦
│   │   └── about-team.jpg ✦
│   ├── gallary/
│   │   ├── cover-fallback.jpg ✦ (احتياطية)
│   │   ├── البناء/
│   │   │   ├── cover.jpg ✦
│   │   │   └── 01.jpg, 02.jpg, ... ✦
│   │   ├── الكهرباء/
│   │   │   ├── cover.jpg ✦
│   │   │   └── 01.jpg, 02.jpg, ... ✦
│   │   └── السباكة/
│   │       ├── cover.jpg ✦
│   │       └── 01.jpg, 02.jpg, ... ✦
│   ├── mowared/                   (موجود — 6 ملفات)
│   └── clients/
│       └── client-1.png ... client-8.png ✦
```

> ✦ = يحتاج توليد ووضع.

---

**ملاحظة:** الموقع سيعمل حتى بدون هذه الصور — صور Hero ستظهر فارغة وصور الخدمات سيظهر مكانها فقط لون موحد. بمجرد وضعك للصور بالأسماء المذكورة أعلاه ستظهر تلقائياً.

// download-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const jobs = [
  // Hero
  { p: 'public/images/hero/hero-1.jpg', id: 'photo-1504307651254-35680f356dfd', w: 1920, h: 1080 },
  { p: 'public/images/hero/hero-2.jpg', id: 'photo-1581092921461-eab62e97a780', w: 1920, h: 1080 },
  { p: 'public/images/hero/hero-3.jpg', id: 'photo-1541888946425-d81bb19240f5', w: 1920, h: 1080 },
  // Services
  { p: 'public/images/services/plumbing.jpg', id: 'photo-1584622650111-993a426fbf0a', w: 1600, h: 1000 },
  { p: 'public/images/services/electrical.jpg', id: 'photo-1473073533101-a08b6cebc3c0', w: 1600, h: 1000 },
  { p: 'public/images/services/construction.jpg', id: 'photo-1503387762-592deb58ef4e', w: 1600, h: 1000 },
  { p: 'public/images/services/sanitary.jpg', id: 'photo-1552321554-5fefe8c9ef14', w: 1600, h: 1000 },
  { p: 'public/images/services/insulation.jpg', id: 'photo-1574359411659-15573a27fd0c', w: 1600, h: 1000 },
  { p: 'public/images/services/maintenance.jpg', id: 'photo-1621905251189-08b45d6a269e', w: 1600, h: 1000 },
  { p: 'public/images/services/projects.jpg', id: 'photo-1487958449943-2429e8be8625', w: 1600, h: 1000 },
  // About
  { p: 'public/images/about/about-hero.jpg', id: 'photo-1542621334-a254cf47733d', w: 1920, h: 1080 },
  { p: 'public/images/about/about-team.jpg', id: 'photo-1556761175-5973dc0f32e7', w: 1600, h: 1200 },
  // Gallery covers
  { p: 'public/images/gallary/cover-fallback.jpg', id: 'photo-1503387762-592deb58ef4e', w: 1200, h: 1500 },
  { p: 'public/images/gallary/البناء/cover.jpg', id: 'photo-1486406146926-c627a92ad1ab', w: 1200, h: 1500 },
  { p: 'public/images/gallary/الكهرباء/cover.jpg', id: 'photo-1473073533101-a08b6cebc3c0', w: 1200, h: 1500 },
  { p: 'public/images/gallary/السباكة/cover.jpg', id: 'photo-1584622650111-993a426fbf0a', w: 1200, h: 1500 },
  // Construction samples (verified Unsplash IDs)
  { p: 'public/images/gallary/البناء/01.jpg', id: 'photo-1486406146926-c627a92ad1ab', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/02.jpg', id: 'photo-1429497419816-9ca5cfb4571a', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/03.jpg', id: 'photo-1581094271901-8022df4466f9', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/04.jpg', id: 'photo-1503387762-592deb58ef4e', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/05.jpg', id: 'photo-1590725140246-20acdee442be', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/06.jpg', id: 'photo-1517089596392-fb9a9033e05b', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/07.jpg', id: 'photo-1531834685032-c34bf0d84c77', w: 1080, h: 1080 },
  { p: 'public/images/gallary/البناء/08.jpg', id: 'photo-1590650046871-92c887180603', w: 1080, h: 1080 },
  // Electrical
  { p: 'public/images/gallary/الكهرباء/01.jpg', id: 'photo-1473073533101-a08b6cebc3c0', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/02.jpg', id: 'photo-1558002038-1055907df827', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/03.jpg', id: 'photo-1605647540924-852290f6b0d5', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/04.jpg', id: 'photo-1565608087341-404b25492cee', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/05.jpg', id: 'photo-1631467053406-95f59d8c93a3', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/06.jpg', id: 'photo-1620661312000-20c84f4135b7', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/07.jpg', id: 'photo-1581092160562-40aa08e78837', w: 1080, h: 1080 },
  { p: 'public/images/gallary/الكهرباء/08.jpg', id: 'photo-1581094289810-adfd1b8f0fa5', w: 1080, h: 1080 },
  // Plumbing
  { p: 'public/images/gallary/السباكة/01.jpg', id: 'photo-1584622650111-993a426fbf0a', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/02.jpg', id: 'photo-1552321554-5fefe8c9ef14', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/03.jpg', id: 'photo-1620626011761-996317b8d101', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/04.jpg', id: 'photo-1564540583246-934409427776', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/05.jpg', id: 'photo-1604147495798-57beb5d6af73', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/06.jpg', id: 'photo-1591814468924-caf88d1232e1', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/07.jpg', id: 'photo-1556909114-f6e7ad7d3136', w: 1080, h: 1080 },
  { p: 'public/images/gallary/السباكة/08.jpg', id: 'photo-1600585154340-be6161a56a0c', w: 1080, h: 1080 },
];

function fetchOnce(url, outPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
        res.resume();
        return resolve(fetchOnce(res.headers.location, outPath, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const file = fs.createWriteStream(outPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', reject);
    }).on('error', reject);
  });
}

let ok = 0, fail = 0;
const failed = [];
for (const j of jobs) {
  const url = `https://images.unsplash.com/${j.id}?w=${j.w}&h=${j.h}&fit=crop&q=80&auto=format`;
  try {
    await fetchOnce(url, j.p);
    const size = fs.statSync(j.p).size;
    if (size < 5000) throw new Error(`too small (${size} B)`);
    console.log(`OK   ${j.p}  (${Math.round(size/1024)} KB)`);
    ok++;
  } catch (e) {
    console.log(`FAIL ${j.p}  -> ${e.message}`);
    failed.push(j);
    fail++;
  }
}
console.log(`\nDone: ${ok} ok, ${fail} failed`);
if (failed.length) console.log('Failed:', failed.map(f => f.p).join('\n'));

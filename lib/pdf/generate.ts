import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export type Lang = 'ua'|'ro'|'en';

export type CheckboxItem = { id: string; labelKey: string; checked: boolean };
export type CheckboxGroup = { id: string; titleKey: string; items: CheckboxItem[] };

export interface ReleasePayload {
  rid: string;
  createdAtIso: string;
  mode: 'private'|'public';
  sectionLangs: Lang[];
  language: Lang;
  parties: {
    a: { fullName: string; alias?: string; email?: string; phone?: string };
    b: { fullName: string; alias?: string; email?: string; phone?: string };
  };
  session: {
    place: string; date: string; time: string;
    safe_word: string; safe_gesture: string;
  };
  expectations: Record<string,string>;
  checkboxGroups: CheckboxGroup[];
  toggles: {
    publication_agreed?: boolean;
    tfp?: boolean;
    commercial_allowed?: boolean;
  };
}

export interface ImagesInput {
  sharedSelfie?: Buffer;
  aSelfie?: Buffer; aId?: Buffer; aSign?: Buffer;
  bSelfie?: Buffer; bId?: Buffer; bSign?: Buffer;
}

export async function normalize3x4(img: Buffer) { return img; }

export async function htmlFor(lang: Lang, dict: any, data: ReleasePayload, imgs: ImagesInput) {
  const groups = (data.checkboxGroups||[]).map(g => ({
    id: g.id,
    title: dict.groups?.[g.id] || g.id,
    items: g.items.filter(i => i.checked).map(i => (dict[g.id]?.[i.id] || dict[i.labelKey] || i.id))
  })).filter(g => g.items.length>0);

  const toggles: string[] = [];
  if (data.toggles?.publication_agreed) toggles.push(dict.toggles?.publication_agreed || 'publication_agreed');
  if (data.toggles?.tfp) toggles.push(dict.toggles?.tfp || 'tfp');
  if (data.toggles?.commercial_allowed) toggles.push(dict.toggles?.commercial_allowed || 'commercial_allowed');

  function safe(v?: string) { return (v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function imgTag(buf?: Buffer, alt='') {
    if (!buf) return '';
    const b64 = buf.toString('base64');
    return `<img class="img" src="data:image/jpeg;base64,${b64}" alt="${safe(alt)}" />`;
  }

  const L = dict;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    @font-face {
      font-family: 'NotoSans';
      src: url('file://${process.cwd()}/public/fonts/NotoSans-Medium.ttf') format('truetype');
      font-weight: 500; font-style: normal; font-display: swap;
    }
    body { font-family: 'NotoSans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 24px; }
    h1 { font-size: 18px; margin: 0 0 10px; }
    h2 { font-size: 14px; margin: 16px 0 8px; }
    .kv { border:1px solid #DDD; border-collapse: collapse; width:100%; }
    .kv td { border:1px solid #EEE; padding:6px 8px; vertical-align: top; }
    ul { margin: 6px 0 8px 18px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .cell { border:1px solid #EEE; padding:8px; min-height: 220px; display:flex; flex-direction:column; gap:6px; }
    .img { width:100%; aspect-ratio: 3/4; object-fit: cover; border:1px solid #DDD; }
    .meta { font-size: 12px; color:#333; }
    .page { page-break-after: always; }
    .muted { color:#666; font-size:12px; }
  </style>
</head>
<body>
  <div class="page">
    <h1>${L.title}</h1>
    <table class="kv">
      <tr><td>${L.section.rid}</td><td>${safe(data.rid)}</td></tr>
      <tr><td>${L.section.created}</td><td>${safe(data.createdAtIso)}</td></tr>
      <tr><td>${L.section.mode}</td><td>${safe(data.mode.toUpperCase())}</td></tr>
      <tr><td>${L.section.lang}</td><td>${(lang as string).toUpperCase()}</td></tr>
    </table>

    <h2>${L.parties.a} / ${L.parties.b}</h2>
    <table class="kv">
      <tr><td>${L.parties.a}</td><td>${safe(data.parties.a.fullName)} (${safe(data.parties.a.alias||'')})</td></tr>
      <tr><td>${L.parties.b}</td><td>${safe(data.parties.b.fullName)} (${safe(data.parties.b.alias||'')})</td></tr>
    </table>

    <h2>Session</h2>
    <table class="kv">
      <tr><td>${L.session.place}</td><td>${safe(data.session.place)}</td></tr>
      <tr><td>${L.session.date}</td><td>${safe(data.session.date)}</td></tr>
      <tr><td>${L.session.time}</td><td>${safe(data.session.time)}</td></tr>
      <tr><td>${L.session.safe_word}</td><td>${safe(data.session.safe_word)}</td></tr>
      <tr><td>${L.session.safe_gesture}</td><td>${safe(data.session.safe_gesture)}</td></tr>
    </table>

    ${groups.map(g => `
      <h2>${g.title}</h2>
      <ul>${g.items.map(li => `<li>${li}</li>`).join('')}</ul>
    `).join('')}

    ${toggles.length ? `<h2>Toggles</h2><ul>${toggles.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}

    <h2>${L.section.photos}</h2>
    <div class="grid">
      ${imgTag(imgs.sharedSelfie, 'Shared selfie') ? `<div class="cell">${imgTag(imgs.sharedSelfie, 'Shared selfie')}<div class="muted">Shared selfie</div></div>` : ''}
      ${imgTag(imgs.aSelfie, 'A Selfie') ? `<div class="cell">${imgTag(imgs.aSelfie, 'A Selfie')}<div class="muted">A Selfie</div></div>` : ''}
      ${imgTag(imgs.aId, 'A ID') ? `<div class="cell">${imgTag(imgs.aId, 'A ID')}<div class="muted">A ID</div></div>` : ''}
      ${imgTag(imgs.aSign, 'A Signature') ? `<div class="cell">${imgTag(imgs.aSign, 'A Signature')}<div class="muted">A Signature</div></div>` : ''}
      ${imgTag(imgs.bSelfie, 'B Selfie') ? `<div class="cell">${imgTag(imgs.bSelfie, 'B Selfie')}<div class="muted">B Selfie</div></div>` : ''}
      ${imgTag(imgs.bId, 'B ID') ? `<div class="cell">${imgTag(imgs.bId, 'B ID')}<div class="muted">B ID</div></div>` : ''}
      ${imgTag(imgs.bSign, 'B Signature') ? `<div class="cell">${imgTag(imgs.bSign, 'B Signature')}<div class="muted">B Signature</div></div>` : ''}
    </div>

    <h2>${L.section.qr}</h2>
    <div class="meta">${safe(data.rid)} | ${safe(data.mode)} | ${safe(data.createdAtIso)}</div>
  </div>
</body>
</html>`;
}

export async function renderPdf(data: ReleasePayload, dicts: Record<Lang, any>, images: ImagesInput) {
  const nimgs: ImagesInput = {};
  for (const k of Object.keys(images) as (keyof ImagesInput)[]) {
    const buf = images[k];
    if (buf) nimgs[k] = await normalize3x4(buf);
  }

  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  try {
    const pages = [];
    for (const lang of data.sectionLangs) {
      const html = await htmlFor(lang, dicts[lang], data, nimgs);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('print');
      pages.push(page);
    }

    const first = pages[0];
    const pdf = await first.pdf({ format:'A4', printBackground:true, preferCSSPageSize:true });
    for (const p of pages) await p.close();
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

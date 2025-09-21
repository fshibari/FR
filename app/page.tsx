'use client'
import { useState } from 'react'

export default function Home() {
  const [rid] = useState('abcd-ef12-3456-7890')
  const [lang, setLang] = useState<'ua'|'ro'|'en'>('ua')
  const [files, setFiles] = useState<Record<string, File|undefined>>({})
  const [status, setStatus] = useState<string>('')

  async function generate() {
    setStatus('Генерація...')
    const data = {
      rid,
      createdAtIso: new Date().toISOString(),
      mode: 'private',
      sectionLangs: ['ua','ro','en'],
      language: lang,
      parties: { a:{ fullName:'Іван Іванов' }, b:{ fullName:'Марія Петренко' } },
      session: { place:'Київ', date:'2025-09-25', time:'20:30', safe_word:'RED', safe_gesture:'Піднята рука' },
      expectations: {},
      checkboxGroups: [
        { id:'nudity', titleKey:'nudity', items:[ {id:'waist_up', labelKey:'nudity.waist_up', checked:true}, {id:'full', labelKey:'nudity.full', checked:false} ] },
        { id:'ties', titleKey:'ties', items:[ {id:'futaba', labelKey:'ties.futaba', checked:true} ] }
      ],
      toggles: { publication_agreed:true, tfp:true, commercial_allowed:false }
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    for (const k of Object.keys(files)) {
      const f = files[k];
      if (f) fd.append(k, f);
    }
    let res: Response;
    try {
      res = await fetch('/api/pdf', { method:'POST', body: fd });
    } catch (e:any) {
      setStatus('Network error: ' + (e?.message||e));
      return;
    }
    if (!res.ok) {
      const text = await res.text();
      setStatus('Помилка PDF: ' + text);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setStatus('OK');
    window.open(url, '_blank');
  }

  const card = { background:'#14141d', border:'1px solid #262636', borderRadius:12, padding:16 }

  return (
    <main style={{ maxWidth: 980, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Release WebApp — генерація PDF</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <section style={card}>
          <h3>Параметри</h3>
          <p>Мова UI:&nbsp;
            <select value={lang} onChange={e => setLang(e.target.value as any)}>
              <option value="ua">Українська</option>
              <option value="ro">Română</option>
              <option value="en">English</option>
            </select>
          </p>
          <button onClick={generate} style={{ padding:'10px 16px', marginTop:12, background:'#4f46e5', color:'#fff', border:'none', borderRadius:8 }}>Згенерувати PDF</button>
          <pre style={{ background:'#0f0f15', padding:10, marginTop:12, whiteSpace:'pre-wrap' }}>{status}</pre>
          <p style={{ marginTop:8 }}>
            <a href="/api/pdf/ping" target="_blank">/api/pdf/ping</a> &nbsp;|&nbsp;
            <a href="/api/pdf/test" target="_blank">/api/pdf/test</a> &nbsp;|&nbsp;
            <a href="/api/pdf/debug" target="_blank">/api/pdf/debug</a>
          </p>
        </section>

        <section style={card}>
          <h3>Фото (опційно)</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <div><label>Спільне селфі <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, sharedSelfie:e.target.files?.[0]}))} /></label></div>
            <div><label>A Selfie <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, aSelfie:e.target.files?.[0]}))} /></label></div>
            <div><label>A ID <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, aId:e.target.files?.[0]}))} /></label></div>
            <div><label>A Sign <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, aSign:e.target.files?.[0]}))} /></label></div>
            <div><label>B Selfie <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, bSelfie:e.target.files?.[0]}))} /></label></div>
            <div><label>B ID <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, bId:e.target.files?.[0]}))} /></label></div>
            <div><label>B Sign <input type="file" accept="image/*" onChange={e=>setFiles(s=>({...s, bSign:e.target.files?.[0]}))} /></label></div>
          </div>
          <p style={{color:'#9aa3b2', marginTop:8}}>Зараз бекенд не обрізає фото нативно — але в PDF все одно виглядає як 3×4 завдяки <code>aspect-ratio:3/4</code>.</p>
        </section>
      </div>
    </main>
  )
}

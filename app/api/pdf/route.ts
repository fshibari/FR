import { NextRequest, NextResponse } from 'next/server';
import { renderPdf, type ReleasePayload, type Lang } from '@/lib/pdf/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readFile(form: FormData, key: string) {
  const f = form.get(key) as File | null;
  if (!f) return undefined;
  const arr = await f.arrayBuffer();
  return Buffer.from(arr);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const dataRaw = form.get('data') as string | null;
    if (!dataRaw) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    const data = JSON.parse(dataRaw) as ReleasePayload;

    const images = {
      sharedSelfie: await readFile(form, 'sharedSelfie'),
      aSelfie: await readFile(form, 'aSelfie'),
      aId: await readFile(form, 'aId'),
      aSign: await readFile(form, 'aSign'),
      bSelfie: await readFile(form, 'bSelfie'),
      bId: await readFile(form, 'bId'),
      bSign: await readFile(form, 'bSign'),
    };

    const ua = (await import('@/locales/ua.json')).default;
    const ro = (await import('@/locales/ro.json')).default;
    const en = (await import('@/locales/en.json')).default;
    const dicts = { ua, ro, en } as Record<Lang, any>;

    const pdf = await renderPdf(data, dicts, images);
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${data.rid}_${data.mode}_trilingual.pdf"`
      }
    });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

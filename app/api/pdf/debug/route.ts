import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import sharpPkg from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const exec = await chromium.executablePath();
    const node = process.version;
    const cwd = process.cwd();
    const fontPath = path.join(cwd, 'public', 'fonts', 'NotoSans-Medium.ttf');
    const fontExists = fs.existsSync(fontPath);
    const sharpVersion = (sharpPkg as any)?.version || 'unknown';

    return NextResponse.json({
      ok: true,
      node,
      cwd,
      chromiumExecutablePath: exec,
      fontPath,
      fontExists,
      sharpVersion
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || String(e) }, { status: 500 });
  }
}

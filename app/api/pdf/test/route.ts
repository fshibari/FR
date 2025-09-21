import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const executablePath = await chromium.executablePath();
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><meta charset="utf-8"/><h1>PDF OK</h1><p>Minimal test on Vercel.</p>`);
    await page.emulateMediaType('print');
    const pdf = await page.pdf({ format:'A4', printBackground:true });
    await browser.close();
    return new NextResponse(pdf, { status:200, headers: { 'Content-Type':'application/pdf' }});
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Fail in /api/pdf/test' }, { status:500 });
  }
}

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><meta charset="utf-8"/><h1>PDF OK</h1><p>Minimal test on Vercel.</p>`);
    await page.emulateMediaType('print');
    const pdf = await page.pdf({ format:'A4', printBackground:true });
    const u8 = new Uint8Array(pdf);
    return new Response(u8, { status:200, headers: { 'Content-Type':'application/pdf' }});
  } finally {
    await browser.close();
  }
}

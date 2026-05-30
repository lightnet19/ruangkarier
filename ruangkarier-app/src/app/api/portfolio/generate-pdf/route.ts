import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID siswa wajib disertakan.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const targetUrl = `${origin}/portfolio/${id}`;

    console.log(`Starting PDF generation for student ID: ${id} via Puppeteer...`);
    console.log(`Target rendering URL: ${targetUrl}`);

    // Launch headless Chromium
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none'
      ],
    });

    const page = await browser.newPage();

    // Set a good viewport that mimics standard desktop printing
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2 // Higher scale factor for crisp text and high-res SVG charts
    });

    // Navigate to the student portfolio page and wait until there is no network activity
    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 seconds limit
    });

    // Emulate print media type to let Tailwind's 'print:' or 'no-print' styles apply
    await page.emulateMediaType('print');

    // Generate the A4 PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Crucial for retaining modern premium background colors, glassmorphism, and Riasec SVG colors
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm',
      },
      preferCSSPageSize: true
    });

    console.log(`Successfully generated PDF buffer of size ${pdfBuffer.length} bytes.`);

    // Return the binary PDF stream to the client
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Portofolio_RuangKarier_${id}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error during server-side PDF generation:', error);
    return NextResponse.json(
      { error: `Gagal menghasilkan berkas PDF secara server-side: ${error.message}` },
      { status: 500 }
    );
  } finally {
    if (browser) {
      console.log('Closing Puppeteer browser instance...');
      await browser.close();
    }
  }
}

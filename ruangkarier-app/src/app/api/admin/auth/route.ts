import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/flatfileDb';

// POST /api/admin/auth — validate admin passcode
export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const db = await readDb();

    // Ensure adminSettings exists (backward compat with older db.json)
    if (!db.adminSettings) {
      db.adminSettings = { passcode: 'admin123', updatedAt: new Date().toISOString() };
      await writeDb(db);
    }

    if (passcode !== db.adminSettings.passcode) {
      return NextResponse.json({ error: 'Kode sandi Admin tidak valid.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Akses Admin diberikan.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/auth — update admin passcode
export async function PATCH(req: NextRequest) {
  try {
    const { currentPasscode, newPasscode } = await req.json();
    const db = await readDb();

    if (!db.adminSettings) {
      db.adminSettings = { passcode: 'admin123', updatedAt: new Date().toISOString() };
    }

    if (currentPasscode !== db.adminSettings.passcode) {
      return NextResponse.json({ error: 'Kode sandi lama tidak cocok.' }, { status: 401 });
    }

    if (!newPasscode || newPasscode.length < 6) {
      return NextResponse.json({ error: 'Kode sandi baru minimal 6 karakter.' }, { status: 400 });
    }

    db.adminSettings.passcode = newPasscode;
    db.adminSettings.updatedAt = new Date().toISOString();
    await writeDb(db);

    return NextResponse.json({ success: true, message: 'Kode sandi Admin berhasil diperbarui.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

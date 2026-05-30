import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/flatfileDb';

// POST /api/counselor/auth — validate counselor passcode
export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const db = await readDb();

    // Ensure counselorSettings exists
    if (!db.counselorSettings) {
      db.counselorSettings = {
        passcode: 'konselor123',
        schoolName: 'SMA Negeri Pilihan',
        updatedAt: new Date().toISOString(),
      };
      await writeDb(db);
    }

    if (passcode !== db.counselorSettings.passcode) {
      return NextResponse.json(
        { error: 'Kode sandi Guru BK tidak valid. Hubungi Administrator sistem.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Akses Guru BK diberikan.',
      schoolName: db.counselorSettings.schoolName,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

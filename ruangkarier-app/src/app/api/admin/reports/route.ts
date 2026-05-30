import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/flatfileDb';

function validateAdmin(req: NextRequest, db: Awaited<ReturnType<typeof readDb>>) {
  const passcode = req.headers.get('x-admin-passcode') || req.nextUrl.searchParams.get('passcode');
  const adminPasscode = db.adminSettings?.passcode || 'ADMIN2026';
  return passcode === adminPasscode;
}

// GET /api/admin/reports — export full data as JSON report
export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    if (!validateAdmin(req, db)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const format = req.nextUrl.searchParams.get('format') || 'json';
    const students = db.students;

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'ID', 'Nama', 'Kelas', 'Holland Code', 'Cemas Awal', 'Cemas Akhir',
        'Red Flag', 'Target Karier', 'UCE Pemahaman', 'UCE Kenyamanan',
        'UCE Tindakan', 'Kirim ke BK', 'Tanggal Pengerjaan'
      ];
      const rows = students.map(s => [
        s.id,
        s.profile?.name || '',
        s.profile?.className || '',
        s.riasecScores?.top3Code || '',
        s.anxietyLogs?.graduationAnxietyScore ?? '',
        s.evaluation?.postAnxietyScore ?? '',
        s.anxietyLogs?.triggeredAlert ? 'Ya' : 'Tidak',
        s.actionPlan?.goal || '',
        s.evaluation?.understandingScore ?? '',
        s.evaluation?.comfortScore ?? '',
        s.evaluation?.actionScore ?? '',
        s.evaluation?.sentToCounselor ? 'Ya' : 'Tidak',
        new Date(s.createdAt).toLocaleDateString('id-ID'),
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

      const csv = [headers.join(','), ...rows].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="ruangkarier-report-${new Date().toISOString().split('T')[0]}.csv"`,
        }
      });
    }

    // JSON report
    const report = {
      generatedAt: new Date().toISOString(),
      schoolName: db.counselorSettings.schoolName,
      summary: {
        totalStudents: students.length,
        redFlagCount: students.filter(s => s.anxietyLogs?.triggeredAlert).length,
        completionRate: students.length > 0
          ? Math.round((students.filter(s => s.evaluation?.sentToCounselor).length / students.length) * 100)
          : 0,
        avgAnxietyReduction: (() => {
          const withBoth = students.filter(s => s.anxietyLogs?.graduationAnxietyScore && s.evaluation?.postAnxietyScore);
          if (!withBoth.length) return 0;
          const reduction = withBoth.reduce((a, s) =>
            a + ((s.anxietyLogs?.graduationAnxietyScore || 0) - (s.evaluation?.postAnxietyScore || 0)), 0);
          return parseFloat((reduction / withBoth.length).toFixed(2));
        })(),
      },
      students: students.map(s => ({
        id: s.id,
        nama: s.profile?.name,
        kelas: s.profile?.className,
        hollandCode: s.riasecScores?.top3Code,
        cemasAwal: s.anxietyLogs?.graduationAnxietyScore,
        cemasAkhir: s.evaluation?.postAnxietyScore,
        redFlag: s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp,
        targetKarier: s.actionPlan?.goal,
        kirimBK: s.evaluation?.sentToCounselor,
        catatan: s.evaluation?.notes,
        tanggal: s.createdAt,
      })),
    };

    return new NextResponse(JSON.stringify(report, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ruangkarier-report-${new Date().toISOString().split('T')[0]}.json"`,
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

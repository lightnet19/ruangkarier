import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/flatfileDb';

function validateAdmin(req: NextRequest, db: Awaited<ReturnType<typeof readDb>>) {
  const passcode = req.headers.get('x-admin-passcode') || req.nextUrl.searchParams.get('passcode');
  const adminPasscode = db.adminSettings?.passcode || 'ADMIN2026';
  return passcode === adminPasscode;
}

// GET /api/admin/data — aggregated analytics & full student list
export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    if (!validateAdmin(req, db)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const students = db.students;
    const total = students.length;
    const redFlags = students.filter(s => s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp).length;
    const completed = students.filter(s => s.evaluation?.sentToCounselor).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const avgInitial = total > 0
      ? (students.reduce((a, s) => a + (s.anxietyLogs?.graduationAnxietyScore || 0), 0) / total)
      : 0;
    const avgPost = total > 0
      ? (students.reduce((a, s) => a + (s.evaluation?.postAnxietyScore || 0), 0) / total)
      : 0;

    // RIASEC distribution
    const riasecDist: Record<string, number> = {};
    students.forEach(s => {
      const code = s.riasecScores?.top3Code;
      if (code) riasecDist[code] = (riasecDist[code] || 0) + 1;
    });

    // Counseling requests (students who want RTL with counselor)
    const counselingRequests = students
      .filter(s => s.evaluation?.sentToCounselor && s.evaluation?.counselorDiscussion)
      .map(s => ({
        id: s.id,
        name: s.profile?.name || 'Unknown',
        className: s.profile?.className || '-',
        goal: s.actionPlan?.goal || '-',
        discussion: s.evaluation?.counselorDiscussion || '',
        sentAt: s.evaluation?.sentAt || s.createdAt,
        anxiety: s.anxietyLogs?.graduationAnxietyScore || 0,
        postAnxiety: s.evaluation?.postAnxietyScore || 0,
        riasec: s.riasecScores?.top3Code || '-',
        isRedFlag: !!(s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp),
      }));

    return NextResponse.json({
      stats: {
        total,
        redFlags,
        completed,
        completionRate,
        avgInitialAnxiety: parseFloat(avgInitial.toFixed(1)),
        avgPostAnxiety: parseFloat(avgPost.toFixed(1)),
        anxietyReduction: parseFloat((avgInitial - avgPost).toFixed(1)),
        riasecDistribution: riasecDist,
      },
      students,
      counselingRequests,
      counselorSettings: db.counselorSettings,
      adminSettings: { updatedAt: db.adminSettings?.updatedAt },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/data?id=xxx — delete student or all
export async function DELETE(req: NextRequest) {
  try {
    const db = await readDb();
    if (!validateAdmin(req, db)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      db.students = db.students.filter(s => s.id !== id);
    } else {
      db.students = [];
    }
    await writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/data — update counselor settings (schoolName, passcode BK)
export async function PATCH(req: NextRequest) {
  try {
    const db = await readDb();
    if (!validateAdmin(req, db)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    if (body.schoolName) db.counselorSettings.schoolName = body.schoolName;
    if (body.bkPasscode) db.counselorSettings.passcode = body.bkPasscode;
    db.counselorSettings.updatedAt = new Date().toISOString();
    await writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

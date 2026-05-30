import { NextResponse } from 'next/server';
import { readDb, writeDb, StudentSession } from '@/lib/flatfileDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID siswa wajib disertakan.' }, { status: 400 });
    }

    const db = await readDb();
    const student = db.students.find(s => s.id === id);

    if (!student) {
      return NextResponse.json({ error: 'Data portofolio tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, profile, screeningResponses, anxietyLogs, riasecResponses, riasecScores, actionPlan, evaluation, createdAt } = body;

    if (!id || !profile?.name) {
      return NextResponse.json({ error: 'ID siswa dan nama lengkap wajib diisi.' }, { status: 400 });
    }

    const db = await readDb();
    const nowStr = new Date().toISOString();

    const existingIndex = db.students.findIndex(s => s.id === id);

    const updatedStudentData: StudentSession = {
      id,
      profile,
      screeningResponses,
      anxietyLogs,
      riasecResponses,
      riasecScores,
      actionPlan,
      evaluation,
      createdAt: existingIndex > -1 ? db.students[existingIndex].createdAt : (createdAt || nowStr),
      updatedAt: nowStr
    };

    if (existingIndex > -1) {
      db.students[existingIndex] = updatedStudentData;
    } else {
      db.students.push(updatedStudentData);
    }

    await writeDb(db);
    return NextResponse.json({ message: 'Data portofolio sukses disimpan!', data: updatedStudentData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

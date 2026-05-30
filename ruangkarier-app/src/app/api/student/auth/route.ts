import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/flatfileDb';

// POST /api/student/auth — login or register student
export async function POST(req: NextRequest) {
  try {
    const { action, name, className, nis, passcode } = await req.json();
    const db = await readDb();

    if (!db.students) db.students = [];

    if (action === 'login') {
      // Find student by NIS and passcode
      const student = db.students.find(
        (s: { nis?: string; passcode?: string }) => s.nis === nis && s.passcode === passcode
      );

      if (!student) {
        return NextResponse.json(
          { error: 'NIS atau kode sandi tidak valid. Pastikan sudah melakukan registrasi terlebih dahulu.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        student: {
          id: student.id,
          name: student.profile?.name || student.name,
          className: student.profile?.className || student.className,
          nis: student.nis,
        },
        message: `Selamat datang kembali, ${student.profile?.name || student.name}!`,
      });
    }

    if (action === 'register') {
      // Validate inputs
      if (!name || !className || !nis || !passcode) {
        return NextResponse.json(
          { error: 'Semua kolom wajib diisi.' },
          { status: 400 }
        );
      }
      if (passcode.length < 6) {
        return NextResponse.json(
          { error: 'Kode sandi minimal 6 karakter.' },
          { status: 400 }
        );
      }

      // Check if NIS already registered
      const existing = db.students.find((s: { nis?: string }) => s.nis === nis);
      if (existing) {
        return NextResponse.json(
          { error: `NIS ${nis} sudah terdaftar. Silakan login atau gunakan NIS lain.` },
          { status: 409 }
        );
      }

      // Create new student record
      const newId = `student_${nis}_${Date.now()}`;
      const newStudent = {
        id: newId,
        nis,
        passcode,
        name,
        className,
        createdAt: new Date().toISOString(),
        profile: {
          name,
          className,
          consentChecked: false,
        },
      };

      db.students.push(newStudent);
      await writeDb(db);

      return NextResponse.json({
        success: true,
        student: {
          id: newId,
          name,
          className,
          nis,
        },
        message: `Registrasi berhasil! Selamat datang, ${name}!`,
      });
    }

    return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

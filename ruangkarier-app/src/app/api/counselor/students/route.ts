import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/flatfileDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');

    const db = await readDb();

    if (!passcode || passcode !== db.counselorSettings.passcode) {
      return NextResponse.json({ error: 'Kode sandi Guru BK tidak valid!' }, { status: 403 });
    }

    return NextResponse.json({ 
      schoolName: db.counselorSettings.schoolName,
      students: db.students 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');
    const id = searchParams.get('id');

    const db = await readDb();

    if (!passcode || passcode !== db.counselorSettings.passcode) {
      return NextResponse.json({ error: 'Kode sandi Guru BK tidak valid!' }, { status: 403 });
    }

    if (id) {
      // Delete specific student session
      db.students = db.students.filter(s => s.id !== id);
      await writeDb(db);
      return NextResponse.json({ message: `Data siswa dengan ID ${id} berhasil dihapus!` });
    } else {
      // Clear all students
      db.students = [];
      await writeDb(db);
      return NextResponse.json({ message: 'Seluruh database siswa berhasil dikosongkan!' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

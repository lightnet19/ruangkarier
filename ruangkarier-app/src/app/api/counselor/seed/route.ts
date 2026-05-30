import { NextResponse } from 'next/server';
import { readDb, writeDb, StudentSession } from '@/lib/flatfileDb';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');

    const db = await readDb();

    if (!passcode || passcode !== db.counselorSettings.passcode) {
      return NextResponse.json({ error: 'Kode sandi Guru BK tidak valid!' }, { status: 403 });
    }

    const dummyStudents: StudentSession[] = [
      {
        id: "mock_ahmad_fauzi",
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        profile: {
          name: "Ahmad Fauzi",
          className: "XII-IPS 1",
          consentChecked: true,
          confidenceScore: 3,
          mainProblem: "Merasa minder karena nilai ekonomi jelek, padahal sangat ingin masuk bisnis UGM. Takut dituntut orang tua menjadi PNS.",
          prepNotes: "Membaca sekilas profil UGM, namun belum berani berdiskusi dengan orang tua."
        },
        screeningResponses: {
          S1: 3, S2: 4, S3: 3, S4: 4, S5: 4, S6: 4, S7: 3, S8: 2
        },
        anxietyLogs: {
          academicPressureScore: 9,
          graduationAnxietyScore: 9,
          needsImmediateHelp: true,
          triggeredAlert: true,
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
        },
        riasecResponses: {
          1:2, 2:2, 3:3, 4:2, 5:1,
          6:4, 7:4, 8:4, 9:3, 10:4,
          11:4, 12:5, 13:4, 14:5, 15:4,
          16:3, 17:3, 18:2, 19:3, 20:4,
          21:5, 22:5, 23:5, 24:4, 25:5,
          26:2, 27:3, 28:2, 29:3, 30:3
        },
        riasecScores: {
          R: 10, I: 19, A: 22, S: 15, E: 24, C: 13,
          top3Code: "EAI"
        },
        actionPlan: {
          goal: "Manajemen Bisnis / Kewirausahaan Universitas Gadjah Mada (UGM)",
          challengeLevel: 9,
          emotionText: "Takut, minder, tidak berdaya",
          negativeThought: "Saya pasti gagal masuk UGM karena nilai saya jelek, dan orang tua akan marah jika saya tidak mendaftar CPNS.",
          evidenceNegative: "Nilai ujian akhir sekolah semester lalu jeblok di mata pelajaran matematika IPS.",
          counterEvidence: "Saya menjuarai lomba cipta bisnis tingkat kabupaten tahun lalu, dan nilai rata-rata bahasa Inggris saya 90.",
          alternativeView: "Ahmad, kamu hebat di bidang kepemimpinan dan ide bisnis kreatif. UGM tidak hanya melihat satu nilai matematika, tapi menghargai prestasi non-akademismu. Orang tua pasti bangga jika usahamu sukses.",
          newBelief: "Saya mungkin kurang kuat di rumus matematika murni, namun potensi kepemimpinan dan wirausaha saya sangat matang. Saya berhak mengejar UGM melalui jalur prestasi!",
          selectedCommitments: [
            "Mengatur jadwal belajar harian secara teratur dan konsisten untuk menaikkan nilai mata pelajaran pendukung.",
            "Mengajak orang tua berdiskusi dengan kepala dingin mengenai pilihan jurusan dan rencana cadangannya.",
            "Berjalan ke ruang BK untuk melakukan validasi dan konsultasi mendalam bersama Guru BK sekolah."
          ],
          monthlyActions: [
            "Membuat presentasi proposal bisnis kecil untuk ditunjukkan ke orang tua.",
            "Belajar soal TPA/UTBK bagian logika verbal setengah jam setiap hari.",
            "Mengonsultasikan portofolio piagam juara bisnis ke Guru BK."
          ]
        },
        evaluation: {
          understandingScore: 9,
          comfortScore: 10,
          actionScore: 8,
          notes: "Saya merasa jauh lebih lega karena berhasil menepis ketakutan buruk mengenai tuntutan orang tua dan memiliki rencana aksi.",
          postAnxietyScore: 4,
          counselorDiscussion: "Ingin mendiskusikan cara berbicara yang dingin kepada ayah saya mengenai bisnis.",
          sentToCounselor: true,
          sentAt: new Date(Date.now() - 1.8 * 3600000).toISOString()
        }
      },
      {
        id: "mock_siti_aminah",
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        profile: {
          name: "Siti Aminah",
          className: "XII-MIPA 2",
          consentChecked: true,
          confidenceScore: 4,
          mainProblem: "Sangat cemas menghadapi persaingan masuk Kedokteran Gigi Airlangga. Merasa buntu dan tertekan oleh harapan guru bidang studi.",
          prepNotes: "Mengerjakan try-out UTBK mandiri, namun skornya baru mencapai 550."
        },
        screeningResponses: {
          S1: 2, S2: 3, S3: 3, S4: 4, S5: 4, S6: 3, S7: 2, S8: 1
        },
        anxietyLogs: {
          academicPressureScore: 8,
          graduationAnxietyScore: 8,
          needsImmediateHelp: false,
          triggeredAlert: true,
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
        },
        riasecResponses: {
          1:3, 2:3, 3:3, 4:2, 5:3,
          6:5, 7:5, 8:5, 9:5, 10:5,
          11:2, 12:2, 13:3, 14:3, 15:2,
          16:4, 17:4, 18:4, 19:4, 20:5,
          21:3, 22:3, 23:2, 24:3, 25:3,
          26:4, 27:4, 28:5, 29:4, 30:4
        },
        riasecScores: {
          R: 14, I: 25, A: 12, S: 21, E: 14, C: 21,
          top3Code: "ISC"
        },
        actionPlan: {
          goal: "Kedokteran Gigi Universitas Airlangga (UNAIR)",
          challengeLevel: 8,
          emotionText: "Cemas, ragu-ragu, tertekan",
          negativeThought: "Skor try-out saya baru 550, sedangkan kedokteran UNAIR butuh minimal 680. Saya pasti tersingkir dan dicap gagal oleh guru biologi saya.",
          evidenceNegative: "Dua kali simulasi ujian mandiri sekolah, hasil skor saya masih tertinggal.",
          counterEvidence: "Nilai biologi dan kimia saya selalu menduduki ranking 3 besar paralel di sekolah, dan tipe kepribadian saya sangat condong ke Investigative (Investigatif/Analitis) dan Social (Penolong) yang sempurna untuk profesi medis.",
          alternativeView: "Siti, jangan berkecil hati. Try-out itu media latihan, bukan vonis mutlak. Kamu masih punya waktu 3 bulan untuk mengevaluasi bab soal yang lemah. Kredibilitas biologi rapor-mu membuktikan kemampuan akademismu tangguh.",
          newBelief: "Perjalanan menuju dokter gigi UNAIR memang menantang, namun kemampuan biologi/analitis saya dan kemauan penolong saya adalah modal terkuat. Saya akan belajar lebih taktis menghadapi try-out berikutnya!",
          selectedCommitments: [
            "Membuka website resmi kampus/instansi target untuk mencatat daya tampung dan syarat masuknya.",
            "Mencoba mengerjakan simulasi soal-soal seleksi (UTBK/Kedinasan) secara mandiri setidaknya seminggu sekali.",
            "Mengatur jadwal belajar harian secara teratur dan konsisten untuk menaikkan nilai mata pelajaran pendukung."
          ],
          monthlyActions: [
            "Membedah 10 soal try-out kimia/biologi yang salah setiap sore.",
            "Membuat jadwal review materi bab fisiologi tubuh secara khusus.",
            "Mengikuti try-out eksternal dua minggu sekali."
          ]
        },
        evaluation: {
          understandingScore: 8,
          comfortScore: 8,
          actionScore: 9,
          notes: "Saya mendapat kejelasan mengenai kelemahan try-out dan merasa tertantang untuk memperbaikinya ketimbang merenungi kegagalan.",
          postAnxietyScore: 3,
          counselorDiscussion: "Ingin mendiskusikan strategi pemilihan jalur cadangan mandiri PTS Kedokteran Gigi.",
          sentToCounselor: true,
          sentAt: new Date(Date.now() - 4.5 * 3600000).toISOString()
        }
      },
      {
        id: "mock_budi_pratama",
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        profile: {
          name: "Budi Pratama",
          className: "XI-MIPA 1",
          consentChecked: true,
          confidenceScore: 6,
          mainProblem: "Bingung memilih antara fokus ke kuliah Teknik Elektro ITS atau langsung mendaftar Sekolah Kedinasan STIS karena pertimbangan biaya.",
          prepNotes: "Sudah mencatat daftar syarat masuk STIS dan ITS."
        },
        screeningResponses: {
          S1: 1, S2: 2, S3: 2, S4: 2, S5: 2, S6: 2, S7: 1, S8: 1
        },
        anxietyLogs: {
          academicPressureScore: 5,
          graduationAnxietyScore: 5,
          needsImmediateHelp: false,
          triggeredAlert: false,
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
        },
        riasecResponses: {
          1:5, 2:4, 3:5, 4:5, 5:5,
          6:4, 7:4, 8:4, 9:4, 10:4,
          11:2, 12:1, 13:2, 14:2, 15:1,
          16:3, 17:3, 18:2, 19:3, 20:3,
          21:3, 22:3, 23:4, 24:3, 25:3,
          26:4, 27:5, 28:4, 29:5, 30:5
        },
        riasecScores: {
          R: 24, I: 20, A: 8, S: 14, E: 16, C: 23,
          top3Code: "RCI"
        },
        actionPlan: {
          goal: "Teknik Elektro ITS / Statistika STIS (Ikatan Dinas)",
          challengeLevel: 6,
          emotionText: "Dilema, ragu-ragu",
          negativeThought: "Jika saya memilih ITS, biaya kuliahnya bisa membebani adik-adik saya. Namun jika memilih STIS, saya khawatir seleksi klerikal statistiknya sangat membosankan.",
          evidenceNegative: "Uang kuliah tunggal PTN saat ini melambung tinggi, dan persaingan beasiswa sangat ketat.",
          counterEvidence: "Nilai matematika dan fisika saya konsisten di atas 90. Kode Holland saya RCI (Realistic-Conventional-Investigative) yang mana merupakan kecocokan absolut baik untuk teknik praktis maupun olah data statistika STIS.",
          alternativeView: "Budi, ini dilema yang sehat, bukan kebuntuan. Kedua jalurmu sangat cemerlang dan selaras dengan kecenderungan alamiahmu yang teratur dan praktis. Kamu bisa mencoba mendaftar keduanya sekaligus tanpa rasa bersalah.",
          newBelief: "Saya beruntung memiliki otak analitis dan ketelitian data yang kuat. Saya akan mendaftar jalur Kedinasan STIS sebagai prioritas bebas biaya, dan mempersiapkan seleksi mandiri ITS dengan opsi beasiswa KIP Kuliah!",
          selectedCommitments: [
            "Membuka website resmi kampus/instansi target untuk mencatat daya tampung dan syarat masuknya.",
            "Mengajak orang tua berdiskusi dengan kepala dingin mengenai pilihan jurusan dan rencana cadangannya.",
            "Mencoba mengerjakan simulasi soal-soal seleksi (UTBK/Kedinasan) secara mandiri setidaknya seminggu sekali."
          ],
          monthlyActions: [
            "Mempelajari silabus materi seleksi masuk STIS semester lalu.",
            "Berdiskusi dengan kakak tingkat yang berkuliah di Elektro ITS.",
            "Mengajukan syarat KIP-Kuliah ke tata usaha sekolah."
          ]
        },
        evaluation: {
          understandingScore: 9,
          comfortScore: 9,
          actionScore: 8,
          notes: "Proses pemetaan RIASEC membantu saya mengafirmasi bahwa data statistika dan teknik elektro sama-sama bidang terkuat saya.",
          postAnxietyScore: 4,
          counselorDiscussion: "Ingin berkonsultasi mengenai proses pengajuan beasiswa KIP Kuliah di sekolah.",
          sentToCounselor: true,
          sentAt: new Date(Date.now() - 23.5 * 3600000).toISOString()
        }
      }
    ];

    // Merge or overwrite mock data
    // Remove existing std_mock or mock_ prefixed IDs to prevent duplicates
    db.students = [
      ...db.students.filter(s => !s.id.startsWith("mock_") && !s.id.startsWith("std_mock")),
      ...dummyStudents
    ];
    
    await writeDb(db);
    
    return NextResponse.json({ 
      message: 'Dummy data simulasi berhasil disuntikkan ke db.json!', 
      count: dummyStudents.length,
      data: dummyStudents 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

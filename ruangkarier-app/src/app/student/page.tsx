'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle,
  FileText,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AlertModal } from '@/components/AlertModal';
import { RiasecChart } from '@/components/RiasecChart';
import { riasecQuestions, riasecDescriptions } from '@/data/riasecQuestions';
import { careerContent, CareerPathway } from '@/data/careerContent';

// Interface definitions for Local Storage State
interface StudentSession {
  id: string;
  profile?: {
    name: string;
    className: string;
    consentChecked: boolean;
    confidenceScore: number;
    mainProblem: string;
    prepNotes: string;
  };
  screeningResponses?: Record<string, number>; // itemCode -> score
  anxietyLogs?: {
    academicPressureScore: number;
    graduationAnxietyScore: number;
    needsImmediateHelp: boolean;
    triggeredAlert: boolean;
    createdAt: string;
  };
  riasecResponses?: Record<number, number>; // itemNo -> score
  riasecScores?: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
    top3Code: string;
  };
  actionPlan?: {
    goal: string;
    challengeLevel: number;
    emotionText: string;
    negativeThought: string;
    evidenceNegative: string;
    counterEvidence: string;
    alternativeView: string;
    newBelief: string;
    selectedCommitments: string[];
    monthlyActions: string[];
  };
  evaluation?: {
    understandingScore: number;
    comfortScore: number;
    actionScore: number;
    notes: string;
    postAnxietyScore: number;
    counselorDiscussion: string;
    sentToCounselor: boolean;
    sentAt?: string;
  };
  createdAt: string;
}

function StudentWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Custom localStorage state for student sessions
  const [sessions, setSessions] = useLocalStorage<StudentSession[]>('ruangkarier_submissions', []);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage<string>('ruangkarier_current_session_id', '');

  // Step state (1 to 6)
  const [step, setStep] = useState(1);

  // Sync step from query parameters if present (e.g. ?step=4)
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      if (parsedStep >= 1 && parsedStep <= 6) {
        setStep(parsedStep);
      }
    }
  }, [searchParams]);

  // Form states matching components of our StudentSession
  const [profileName, setProfileName] = useState('');
  const [profileClass, setProfileClass] = useState('XI-MIPA 1');
  const [consentChecked, setConsentChecked] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(5);
  const [mainProblem, setMainProblem] = useState('');
  const [prepNotes, setPrepNotes] = useState('');

  // Step 2: Screening Responses (Item 1 to 8, scores 0 to 4)
  const screeningQuestions = [
    { id: 'S1', category: 'internal', text: "Saya merasa tidak memiliki bakat atau kelebihan apa pun yang menonjol." },
    { id: 'S2', category: 'internal', text: "Saya merasa masa depan saya akan gagal ke mana pun saya melangkah." },
    { id: 'S3', category: 'internal', text: "Saya merasa terlalu lemah dan bodoh untuk bersaing di dunia perkuliahan/kerja." },
    { id: 'S4', category: 'internal', text: "Saya sangat takut salah memilih jurusan dan menyesal di kemudian hari." },
    { id: 'S5', category: 'external', text: "Saya merasa orang lain/teman-teman jauh lebih hebat dan meninggalkan saya di belakang." },
    { id: 'S6', category: 'external', text: "Saya memandang orang tua atau lingkungan terlalu menuntut saya menjadi orang lain." },
    { id: 'S7', category: 'external', text: "Saya merasa tidak ada orang yang mendukung atau memahami impian karier saya." },
    { id: 'S8', category: 'external', text: "Saya merasa akses informasi mengenai perkuliahan dan dunia kerja sangat tertutup bagi saya." }
  ];
  const [screeningResponses, setScreeningResponses] = useState<Record<string, number>>({
    S1: 2, S2: 2, S3: 2, S4: 2, S5: 2, S6: 2, S7: 2, S8: 2
  });

  // Step 3: Anxiety logs
  const [academicPressure, setAcademicPressure] = useState(5);
  const [graduationAnxiety, setGraduationAnxiety] = useState(5);
  const [needsImmediateHelp, setNeedsImmediateHelp] = useState<boolean>(false);
  const [safetyAlertTriggered, setSafetyAlertTriggered] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  // Step 4: RIASEC responses (1 to 30, scores 1 to 5)
  const [riasecResponses, setRiasecResponses] = useState<Record<number, number>>({});
  const [riasecScores, setRiasecScores] = useState<{
    R: number; I: number; A: number; S: number; E: number; C: number; top3Code: string;
  } | null>(null);

  // Step 5: Pathway Explore and LKPD CBT Plan
  const [selectedPathway, setSelectedPathway] = useState<CareerPathway | null>(null);
  const [lkpdGoal, setLkpdGoal] = useState('');
  const [lkpdChallenge, setLkpdChallenge] = useState(5);
  const [lkpdEmotion, setLkpdEmotion] = useState('');
  const [lkpdNegativeThought, setLkpdNegativeThought] = useState('');
  const [lkpdEvidenceNegative, setLkpdEvidenceNegative] = useState('');
  const [lkpdCounterEvidence, setLkpdCounterEvidence] = useState('');
  const [lkpdAlternativeView, setLkpdAlternativeView] = useState('');
  const [lkpdNewBelief, setLkpdNewBelief] = useState('');
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([]);
  const [monthlyActions, setMonthlyActions] = useState<string[]>(['', '', '']);

  // Step 6: Evaluation
  const [evalUnderstanding, setEvalUnderstanding] = useState(7);
  const [evalComfort, setEvalComfort] = useState(7);
  const [evalAction, setEvalAction] = useState(7);
  const [evalNotes, setEvalNotes] = useState('');
  const [evalPostAnxiety, setEvalPostAnxiety] = useState(5);
  const [evalDiscussion, setEvalDiscussion] = useState('');

  // Class choices
  const classList = [
    'XI-MIPA 1', 'XI-MIPA 2', 'XI-IPS 1', 'XI-IPS 2', 'XI-Bahasa', 
    'XII-MIPA 1', 'XII-MIPA 2', 'XII-IPS 1', 'XII-IPS 2', 'XII-Bahasa',
    'X-1', 'X-2', 'X-3', 'X-4', 'Lainnya'
  ];

  // Checklist action commitments options
  const commitmentOptions = [
    "Membuka website resmi kampus/instansi target untuk mencatat daya tampung dan syarat masuknya.",
    "Mengatur jadwal belajar harian secara teratur dan konsisten untuk menaikkan nilai mata pelajaran pendukung.",
    "Membaca kembali rangkuman potensi atau keyakinan baru alternatif yang sudah saya tulis di website ini jika rasa ragu muncul kembali.",
    "Mengajak orang tua berdiskusi dengan kepala dingin mengenai pilihan jurusan dan rencana cadangannya.",
    "Mencoba mengerjakan simulasi soal-soal seleksi (UTBK/Kedinasan) secara mandiri setidaknya seminggu sekali.",
    "Berjalan ke ruang BK untuk melakukan validasi dan konsultasi mendalam bersama Guru BK sekolah."
  ];

  // Initialize RIASEC with netral (3) on load
  useEffect(() => {
    const initialResponses: Record<number, number> = {};
    riasecQuestions.forEach((q) => {
      initialResponses[q.id] = 3; // default Neutral
    });
    setRiasecResponses(initialResponses);
    
    // Create new session ID if not set
    if (!currentSessionId) {
      setCurrentSessionId('rk_' + Math.random().toString(36).substr(2, 9));
    }
  }, [currentSessionId, setCurrentSessionId]);

  // Load existing session data on mount if there is a matching ID in local storage
  useEffect(() => {
    if (currentSessionId && sessions.length > 0) {
      const activeSession = sessions.find(s => s.id === currentSessionId);
      if (activeSession) {
        // Load Profile
        if (activeSession.profile) {
          setProfileName(activeSession.profile.name || '');
          setProfileClass(activeSession.profile.className || 'XI-MIPA 1');
          setConsentChecked(activeSession.profile.consentChecked || false);
          setConfidenceScore(activeSession.profile.confidenceScore || 5);
          setMainProblem(activeSession.profile.mainProblem || '');
          setPrepNotes(activeSession.profile.prepNotes || '');
        }
        // Load Screening Responses
        if (activeSession.screeningResponses) {
          setScreeningResponses(activeSession.screeningResponses);
        }
        // Load Anxiety
        if (activeSession.anxietyLogs) {
          setAcademicPressure(activeSession.anxietyLogs.academicPressureScore || 5);
          setGraduationAnxiety(activeSession.anxietyLogs.graduationAnxietyScore || 5);
          setNeedsImmediateHelp(activeSession.anxietyLogs.needsImmediateHelp || false);
          setSafetyAlertTriggered(activeSession.anxietyLogs.triggeredAlert || false);
        }
        // Load RIASEC
        if (activeSession.riasecResponses) {
          setRiasecResponses(activeSession.riasecResponses);
        }
        if (activeSession.riasecScores) {
          setRiasecScores(activeSession.riasecScores);
        }
        // Load LKPD
        if (activeSession.actionPlan) {
          setLkpdGoal(activeSession.actionPlan.goal || '');
          setLkpdChallenge(activeSession.actionPlan.challengeLevel || 5);
          setLkpdEmotion(activeSession.actionPlan.emotionText || '');
          setLkpdNegativeThought(activeSession.actionPlan.negativeThought || '');
          setLkpdEvidenceNegative(activeSession.actionPlan.evidenceNegative || '');
          setLkpdCounterEvidence(activeSession.actionPlan.counterEvidence || '');
          setLkpdAlternativeView(activeSession.actionPlan.alternativeView || '');
          setLkpdNewBelief(activeSession.actionPlan.newBelief || '');
          setSelectedCommitments(activeSession.actionPlan.selectedCommitments || []);
          setMonthlyActions(activeSession.actionPlan.monthlyActions || ['', '', '']);
        }
        // Load Evaluation
        if (activeSession.evaluation) {
          setEvalUnderstanding(activeSession.evaluation.understandingScore || 7);
          setEvalComfort(activeSession.evaluation.comfortScore || 7);
          setEvalAction(activeSession.evaluation.actionScore || 7);
          setEvalNotes(activeSession.evaluation.notes || '');
          setEvalPostAnxiety(activeSession.evaluation.postAnxietyScore || 5);
          setEvalDiscussion(activeSession.evaluation.counselorDiscussion || '');
        }
      }
    }
  }, [currentSessionId, sessions]);

  // Handle Screening change
  const handleScreeningChange = (id: string, score: number) => {
    setScreeningResponses(prev => ({ ...prev, [id]: score }));
  };

  // Handle RIASEC answer selection
  const handleRiasecSelect = (id: number, score: number) => {
    setRiasecResponses(prev => ({ ...prev, [id]: score }));
  };

  // Logika Safety Trigger Check at Step 3
  const handleStep3Submit = () => {
    const isAnxious = academicPressure >= 8 || graduationAnxiety >= 8;
    const alertCondition = isAnxious || needsImmediateHelp;
    
    // Save state to localStorage first
    saveCurrentSessionState({
      anxietyLogs: {
        academicPressureScore: academicPressure,
        graduationAnxietyScore: graduationAnxiety,
        needsImmediateHelp: needsImmediateHelp,
        triggeredAlert: alertCondition,
        createdAt: new Date().toISOString()
      }
    });

    if (alertCondition) {
      setSafetyAlertTriggered(true);
      setIsSafetyOpen(true);
      // Let student proceed only if they close the alert or click "saya lebih tenang"
    } else {
      goToNextStep();
    }
  };

  // Standard steps transitions
  const goToNextStep = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Save current step data to local storage array
  const saveCurrentSessionState = (partialData: Partial<StudentSession>) => {
    try {
      const allSubmissions = [...sessions];
      let existingIndex = allSubmissions.findIndex(s => s.id === currentSessionId);
      
      const sessionToSave: StudentSession = existingIndex >= 0 
        ? { ...allSubmissions[existingIndex] } 
        : {
            id: currentSessionId,
            createdAt: new Date().toISOString()
          };

      // Merge deep fields as necessary
      if (partialData.profile) sessionToSave.profile = { ...sessionToSave.profile, ...partialData.profile };
      if (partialData.screeningResponses) sessionToSave.screeningResponses = { ...sessionToSave.screeningResponses, ...partialData.screeningResponses };
      if (partialData.anxietyLogs) sessionToSave.anxietyLogs = { ...sessionToSave.anxietyLogs, ...partialData.anxietyLogs };
      if (partialData.riasecResponses) sessionToSave.riasecResponses = { ...sessionToSave.riasecResponses, ...partialData.riasecResponses };
      if (partialData.riasecScores) sessionToSave.riasecScores = { ...sessionToSave.riasecScores, ...partialData.riasecScores };
      if (partialData.actionPlan) sessionToSave.actionPlan = { ...sessionToSave.actionPlan, ...partialData.actionPlan };
      if (partialData.evaluation) sessionToSave.evaluation = { ...sessionToSave.evaluation, ...partialData.evaluation };

      if (existingIndex >= 0) {
        allSubmissions[existingIndex] = sessionToSave;
      } else {
        allSubmissions.push(sessionToSave);
      }

      setSessions(allSubmissions);
      
      // Also write active session parameters to a separate key for easy access
      localStorage.setItem('ruangkarier_student_session', JSON.stringify(sessionToSave));
    } catch (e) {
      console.error("Error saving state to localStorage:", e);
    }
  };

  // Step 1 validation & submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert("Silakan masukkan nama lengkap Anda terlebih dahulu.");
      return;
    }
    if (!consentChecked) {
      alert("Anda harus menyetujui lembar kesepakatan (Consent) untuk dapat memulai bimbingan.");
      return;
    }

    saveCurrentSessionState({
      profile: {
        name: profileName,
        className: profileClass,
        consentChecked,
        confidenceScore,
        mainProblem,
        prepNotes
      }
    });

    goToNextStep();
  };

  // Step 2 submit
  const handleStep2Submit = () => {
    saveCurrentSessionState({
      screeningResponses
    });
    goToNextStep();
  };

  // Step 4 Calculations (RIASEC score parsing)
  const calculateRiasecResult = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    // Sum scores by dimension
    riasecQuestions.forEach((q) => {
      const val = riasecResponses[q.id] || 3; // default neutral
      scores[q.dimension] += val;
    });

    // Create ranked Holland code based on values
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]) // Descending
      .map(entry => entry[0]);
    
    const top3Code = sorted.slice(0, 3).join('');

    const scoresPayload = {
      ...scores,
      top3Code
    };

    setRiasecScores(scoresPayload);
    saveCurrentSessionState({
      riasecResponses,
      riasecScores: scoresPayload
    });

    goToNextStep();
  };

  // Toggle commitment checkboxes
  const handleCommitmentToggle = (opt: string) => {
    setSelectedCommitments(prev => 
      prev.includes(opt) ? prev.filter(c => c !== opt) : [...prev, opt]
    );
  };

  // Update monthly actions array
  const handleMonthlyActionChange = (index: number, text: string) => {
    setMonthlyActions(prev => {
      const clone = [...prev];
      clone[index] = text;
      return clone;
    });
  };

  // Step 5 submit
  const handleStep5Submit = () => {
    if (!lkpdGoal.trim()) {
      alert("Tuliskan kampus/karir impian Anda pada bagian situasi.");
      return;
    }
    if (selectedCommitments.length < 3) {
      alert("Pilih minimal 3 tindakan komitmen nyata yang akan Anda lakukan.");
      return;
    }

    saveCurrentSessionState({
      actionPlan: {
        goal: lkpdGoal,
        challengeLevel: lkpdChallenge,
        emotionText: lkpdEmotion,
        negativeThought: lkpdNegativeThought,
        evidenceNegative: lkpdEvidenceNegative,
        counterEvidence: lkpdCounterEvidence,
        alternativeView: lkpdAlternativeView,
        newBelief: lkpdNewBelief,
        selectedCommitments,
        monthlyActions
      }
    });

    goToNextStep();
  };

  // Step 6 final submit and export triggers
  const handleFinalSubmit = () => {
    const finalEval = {
      understandingScore: evalUnderstanding,
      comfortScore: evalComfort,
      actionScore: evalAction,
      notes: evalNotes,
      postAnxietyScore: evalPostAnxiety,
      counselorDiscussion: evalDiscussion,
      sentToCounselor: true,
      sentAt: new Date().toISOString()
    };

    saveCurrentSessionState({
      evaluation: finalEval
    });

    // Success alert with nice routing
    alert("Portofolio Karier Anda berhasil dikirim ke Dasbor Guru BK! Anda akan diarahkan ke halaman portofolio mandiri.");
    router.push(`/portfolio/${currentSessionId}`);
  };

  // Helper: filter career pathways by RIASEC Top 3 letters
  const getSuggestedPathways = () => {
    if (!riasecScores) return careerContent;
    const topLetters = riasecScores.top3Code.split('');
    
    // Sort pathways: pathways that match MORE top letters are ranked higher
    return [...careerContent].sort((a, b) => {
      const matchA = a.riasecTags.filter(t => topLetters.includes(t)).length;
      const matchB = b.riasecTags.filter(t => topLetters.includes(t)).length;
      return matchB - matchA; // descending match score
    });
  };

  // Step names
  const stepTitles = [
    "Lembar Consent",
    "Screening",
    "Cek Kecemasan",
    "Kuis RIASEC",
    "Jelajah & LKPD",
    "Kirim Portofolio"
  ];

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      
      {/* 🚥 Wizard Stepper Indicator */}
      <section className="mb-8 select-none no-print">
        <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
          {stepTitles.map((title, idx) => {
            const num = idx + 1;
            const isActive = step === num;
            const isCompleted = step > num;
            
            return (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white scale-110 border-2 border-secondary' 
                      : isCompleted 
                        ? 'bg-secondary text-primary' 
                        : 'bg-white text-muted-gray border border-primary/10'
                  }`}>
                    {isCompleted ? '✓' : num}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-primary' : 'text-muted-gray'
                  }`}>
                    {title}
                  </span>
                </div>
                {idx < stepTitles.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-secondary' : 'bg-primary/5'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* 📦 Wizard Content Panel */}
      <section className="bg-white/80 rounded-3xl p-6 md:p-8 border border-primary/5 shadow-xl glass-card relative min-h-[500px] flex flex-col justify-between">
        
        {/* Step 1: Informed Consent & Profil Awal */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
            <div className="border-b border-primary/5 pb-4 select-none">
              <div className="flex items-center gap-2 text-primary mb-1">
                <HeartHandshake className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 1: LEMBAR KESIAPAN EKSPLORASI KARIER
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Selamat datang di platform eksplorasi karier digital Anda. Website ini dirancang untuk membantumu memahami potensi diri, memetakan jalur kelulusan, serta mengelola kecemasan masa depan melalui bimbingan terstruktur.
              </p>
              <div className="bg-bg-warm/60 rounded-xl p-3 border border-primary/5 text-[11px] text-text-dark leading-relaxed mt-3">
                <strong>🛡️ Jaminan Kerahasiaan:</strong> Seluruh jawaban dan data pribadi Anda dijamin kerahasiaannya sesuai kode etik BK. Data ini hanya dapat diakses oleh Anda dan Guru BK di sekolah Anda sebagai modal pendampingan masa depan.
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary font-heading">Nama Lengkap Siswa</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full py-2.5 px-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary font-heading">Kelas / Rombel</label>
                <select 
                  value={profileClass}
                  onChange={(e) => setProfileClass(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all cursor-pointer"
                >
                  {classList.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exploratory questions */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                  <label>1. Seberapa yakin Anda dengan pilihan jurusan kuliah atau karier Anda saat ini?</label>
                  <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[10px]">{confidenceScore} / 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-gray font-bold">1 (Sangat Bingung)</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                    className="flex-1 accent-secondary cursor-pointer h-2 bg-primary/5 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] text-secondary font-bold">10 (Sangat Yakin)</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary font-heading">
                  2. Apa kendala terbesar yang paling membuat Anda cemas saat memikirkan masa depan pasca-kelulusan sekolah?
                </label>
                <textarea 
                  value={mainProblem}
                  onChange={(e) => setMainProblem(e.target.value)}
                  placeholder="Misalnya: Takut mengecewakan orang tua, bingung membedakan minat, khawatir tidak lolos seleksi PTN, terkendala finansial, atau merasa tertinggal dibanding teman..."
                  className="w-full min-h-[80px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary font-heading">
                  3. Apa saja usaha nyata yang sudah Anda lakukan selama ini untuk mempersiapkan masa depan tersebut?
                </label>
                <textarea 
                  value={prepNotes}
                  onChange={(e) => setPrepNotes(e.target.value)}
                  placeholder="Misalnya: Bertanya ke alumni, mencari informasi passing grade, mulai intensif les/belajar kelompok, menabung, atau berdiskusi dengan wali kelas..."
                  className="w-full min-h-[80px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Consent check */}
            <div className="flex items-start gap-3 bg-secondary/10 rounded-2xl p-4 border border-secondary/20 my-2 select-none">
              <input 
                type="checkbox" 
                id="consentCheck"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-secondary cursor-pointer"
              />
              <label htmlFor="consentCheck" className="text-xs font-semibold text-primary leading-relaxed cursor-pointer">
                <strong>Ya, saya siap mengeksplorasi potensi diri saya secara jujur dan sukarela.</strong> Saya memahami bahwa platform ini adalah wadah belajar pribadi yang dijamin aman dan profesional untuk merancang masa depan saya.
              </label>
            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-end pt-4 border-t border-primary/5 select-none">
              <button 
                type="submit" 
                className="flex items-center gap-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Mulai Eksplorasi</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Screening Hambatan Karier */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-primary/5 pb-4 select-none">
              <div className="flex items-center gap-2 text-primary mb-1">
                <BookOpen className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 2: SCREENING HAMBATAN KARIER (CORE BELIEFS MASA DEPAN)
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Pilih angka <strong>0 sampai 4</strong> pada setiap pernyataan di bawah ini berdasarkan seberapa besar Anda memercayai isi pernyataan tersebut!
              </p>
              <div className="grid grid-cols-5 gap-1 text-[9px] font-extrabold text-center uppercase tracking-wider my-3 max-w-xl text-primary">
                <div className="p-1 rounded bg-bg-warm border border-primary/5">0: Tidak sama sekali</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">1: Sedikit percaya</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">2: Cukup percaya</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">3: Sangat percaya</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">4: Sepenuhnya yakin</div>
              </div>
            </div>

            {/* Screening question list */}
            <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-2">
              {screeningQuestions.map((q, idx) => {
                const curScore = screeningResponses[q.id] ?? 2;
                return (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-bg-warm/40 border border-primary/5 hover:border-secondary/20 transition-all">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-text-dark leading-relaxed">
                        {q.text}
                      </span>
                    </div>

                    {/* Radio list */}
                    <div className="flex items-center gap-3.5 self-end sm:self-center">
                      {[0, 1, 2, 3, 4].map(val => (
                        <label key={val} className="flex flex-col items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`screening_${q.id}`} 
                            checked={curScore === val}
                            onChange={() => handleScreeningChange(q.id, val)}
                            className="w-4.5 h-4.5 accent-secondary cursor-pointer"
                          />
                          <span className="text-[9px] font-bold text-muted-gray">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-primary/5 select-none">
              <button 
                onClick={goToPrevStep}
                className="flex items-center gap-1 py-3 px-5 bg-white border border-primary/10 hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
              
              <button 
                onClick={handleStep2Submit}
                className="flex items-center gap-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Langkah Berikutnya</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reaksi Otomatis & Cek Kecemasan Real-Time (Safety Trigger) */}
        {step === 3 && (
          <div className="flex flex-col gap-6 select-none animate-fade-in-up">
            <div className="border-b border-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <AlertCircle className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 3: REAKSI OTOMATIS &amp; CEK KECEMASAN REAL-TIME
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Sebelum kita melangkah ke kuis minat bakat utama, mari jeda sejenak untuk memeriksa tingkat ketenangan emosional Anda hari ini. Kejujuran Anda di sini adalah pelindung utama bimbingan.
              </p>
            </div>

            <div className="flex flex-col gap-6 my-2 max-w-2xl mx-auto w-full">
              
              {/* Question 1 */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-500/5 border border-accent/25">
                <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                  <label>1. Seberapa kuat tekanan pikiran akademik yang Anda rasakan hari ini?</label>
                  <span className="text-accent bg-accent/15 py-0.5 px-2 rounded-md font-extrabold text-[10px]">{academicPressure} / 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-gray font-semibold">1 (Tidak ada tekanan)</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={academicPressure}
                    onChange={(e) => setAcademicPressure(parseInt(e.target.value))}
                    className="flex-1 accent-accent cursor-pointer h-2 bg-primary/5 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] text-accent font-bold">10 (Sangat tertekan)</span>
                </div>
              </div>

              {/* Question 2 */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-500/5 border border-accent/25">
                <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                  <label>2. Seberapa cemas Anda saat mendengar kata &ldquo;Kelulusan&rdquo; atau &ldquo;Ujian&rdquo;?</label>
                  <span className="text-accent bg-accent/15 py-0.5 px-2 rounded-md font-extrabold text-[10px]">{graduationAnxiety} / 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-gray font-semibold">1 (Biasa saja)</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={graduationAnxiety}
                    onChange={(e) => setGraduationAnxiety(parseInt(e.target.value))}
                    className="flex-1 accent-accent cursor-pointer h-2 bg-primary/5 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] text-accent font-bold">10 (Sangat cemas/takut)</span>
                </div>
              </div>

              {/* Question 3 */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-bg-warm/60 border border-primary/5">
                <div className="flex-1 text-left">
                  <label className="text-xs font-bold text-primary font-heading leading-tight block mb-1">
                    3. Apakah Anda merasa buntu dan membutuhkan bantuan konsultasi BK segera?
                  </label>
                  <p className="text-[10px] text-muted-gray">
                    Pilih Ya jika Anda merasa terbebani dan butuh teman mengobrol sekarang.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-primary/5 shadow-inner">
                  <button
                    onClick={() => setNeedsImmediateHelp(true)}
                    className={`py-1.5 px-4 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      needsImmediateHelp 
                        ? 'bg-accent text-white shadow-sm' 
                        : 'text-primary hover:bg-bg-warm'
                    }`}
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setNeedsImmediateHelp(false)}
                    className={`py-1.5 px-4 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      !needsImmediateHelp 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-primary hover:bg-bg-warm'
                    }`}
                  >
                    Tidak
                  </button>
                </div>
              </div>

            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-primary/5">
              <button 
                onClick={goToPrevStep}
                className="flex items-center gap-1 py-3 px-5 bg-white border border-primary/10 hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
              
              <button 
                onClick={handleStep3Submit}
                className="flex items-center gap-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Validasi Kecemasan</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* ⚠️ Safety modal pop up container */}
            <AlertModal 
              isOpen={isSafetyOpen} 
              onClose={() => {
                setIsSafetyOpen(false);
                goToNextStep(); // Let them proceed if they dismiss
              }} 
              studentName={profileName}
            />
          </div>
        )}

        {/* Step 4: RIASEC Holland Assessment */}
        {step === 4 && (
          <div className="flex flex-col gap-6 select-none animate-fade-in-up">
            <div className="border-b border-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Compass className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 3.5: KUIS MINAT &amp; TIPOLOGI HOLLAND (RIASEC)
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Berikan tanda nilai <strong>1 sampai 5</strong> pada setiap pernyataan di bawah ini berdasarkan seberapa besar ketertarikan Anda pada aktivitas tersebut!
              </p>
              <div className="grid grid-cols-5 gap-1 text-[8.5px] font-extrabold text-center uppercase tracking-wider my-3 max-w-xl text-primary">
                <div className="p-1 rounded bg-bg-warm border border-primary/5">1: Sangat tidak suka</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">2: Tidak suka</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">3: Netral</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">4: Suka</div>
                <div className="p-1 rounded bg-bg-warm border border-primary/5">5: Sangat Suka</div>
              </div>
            </div>

            {/* Question Scrollable Box */}
            <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-2 my-2">
              {riasecQuestions.map((q, idx) => {
                const curScore = riasecResponses[q.id] || 3;
                
                // Styling labels differently per dimensions just to make it premium
                let badgeColor = 'bg-slate-100 text-slate-700';
                if (q.dimension === 'R') badgeColor = 'bg-rose-50 text-rose-700 border-rose-100 border';
                if (q.dimension === 'I') badgeColor = 'bg-blue-50 text-blue-700 border-blue-100 border';
                if (q.dimension === 'A') badgeColor = 'bg-purple-50 text-purple-700 border-purple-100 border';
                if (q.dimension === 'S') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100 border';
                if (q.dimension === 'E') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100 border';
                if (q.dimension === 'C') badgeColor = 'bg-cyan-50 text-cyan-700 border-cyan-100 border';

                return (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-bg-warm/40 border border-primary/5 hover:border-secondary/20 transition-all">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-heading ${badgeColor}`}>
                        {q.dimension} — {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-text-dark leading-relaxed">
                        {q.statement}
                      </span>
                    </div>

                    {/* Radio Selectors */}
                    <div className="flex items-center gap-3.5 self-end sm:self-center">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className="flex flex-col items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`riasec_${q.id}`} 
                            checked={curScore === val}
                            onChange={() => handleRiasecSelect(q.id, val)}
                            className="w-4.5 h-4.5 accent-secondary cursor-pointer"
                          />
                          <span className="text-[9px] font-bold text-muted-gray">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-primary/5">
              <button 
                onClick={goToPrevStep}
                className="flex items-center gap-1 py-3 px-5 bg-white border border-primary/10 hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
              
              <button 
                onClick={calculateRiasecResult}
                className="flex items-center gap-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Proses Hasil RIASEC</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Jelajah Karier (Dynamic Filtered Content) & Ruang Aksi (LKPD Digital CBT) */}
        {step === 5 && (
          <div className="flex flex-col gap-6 select-none animate-fade-in-up">
            
            {/* 1. Header & Holland Results Visual */}
            <div className="border-b border-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <TrendingUp className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 4 &amp; 5: JELAJAH KARIER &amp; CAREER ACTION PLANNER (LKPD)
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Tinjau visualisasi potensi Holland Anda di bawah ini, pilih dan baca salah satu jalur pendidikan rekomendasi cerdas Anda, lalu isilah formulir rencana aksi karier (CBT) sebagai langkah pemecahan hambatan masa depan.
              </p>
            </div>

            {/* Radar and Holland details inside a card grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-2">
              
              {/* Radar Chart side */}
              <div className="md:col-span-5 flex flex-col items-center">
                {riasecScores && (
                  <>
                    <RiasecChart scores={riasecScores} />
                    
                    {/* Holland Code Badge banner */}
                    <div className="bg-gradient-to-tr from-primary to-primary-light text-white py-3 px-4 rounded-2xl w-full max-w-sm mt-3 text-center border border-white/10 shadow-sm flex flex-col justify-center items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary font-heading leading-none mb-1">Kode Holland Utama Anda:</span>
                      <span className="text-2xl font-black font-heading tracking-widest text-white leading-tight">
                        {riasecScores.top3Code}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Explanatory notes of top dimensions side */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-primary font-heading uppercase tracking-widest border-b border-primary/5 pb-1">
                  Analisis Tipe Kepribadian Anda:
                </h3>
                
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {riasecScores && riasecScores.top3Code.split('').map((char, index) => {
                    const desc = riasecDescriptions[char as 'R'|'I'|'A'|'S'|'E'|'C'];
                    if (!desc) return null;
                    
                    return (
                      <div key={char} className="p-3 bg-white/70 rounded-2xl border border-primary/5 flex flex-col gap-1 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-secondary text-primary font-black text-xs flex items-center justify-center font-heading">
                            {index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-primary font-heading">
                            {desc.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-text-dark/95 leading-relaxed font-semibold italic mt-0.5">
                          &ldquo;{desc.tagline}&rdquo;
                        </p>
                        <p className="text-[10px] text-muted-gray leading-relaxed mt-1">
                          {desc.description}
                        </p>
                        <div className="text-[9px] bg-bg-warm rounded py-1 px-2 text-primary font-bold border border-primary/5 mt-1">
                          Saran Karier: {desc.careers}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 2. Modul Sinkronisasi Cerdas: Jelajah Karier pathways list */}
            <div className="bg-bg-warm/60 rounded-3xl p-5 border border-primary/5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <Compass className="text-secondary" size={18} />
                <h3 className="text-sm font-bold font-heading text-primary">
                  Jelajah Jalur Masa Depan (Rekomendasi Cerdas Sesuai RIASEC)
                </h3>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed mb-4">
                Pilih dan klik salah satu kartu jalur pendidikan di bawah ini untuk melihat prasyarat, contoh instansi, dan tips strategis menggapainya. Kartu yang memuat bintang ⭐ adalah jalur yang paling selaras dengan kode Holland-mu!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                {getSuggestedPathways().map((pathway) => {
                  const isTopMatch = riasecScores ? pathway.riasecTags.includes(riasecScores.top3Code[0] as any) : false;
                  const isSelected = selectedPathway?.id === pathway.id;
                  
                  return (
                    <button
                      key={pathway.id}
                      onClick={() => setSelectedPathway(pathway)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'bg-primary text-white border-primary scale-[1.03] shadow-md' 
                          : 'bg-white/80 border-primary/5 hover:border-secondary text-primary'
                      }`}
                    >
                      {isTopMatch && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs">⭐</span>
                      )}
                      <span className="text-xs font-extrabold font-heading block leading-tight">
                        {pathway.title.split(' ')[1] || pathway.title}
                      </span>
                      <span className="text-[8px] opacity-75 font-semibold leading-none uppercase">
                        Tag: {pathway.riasecTags.join(', ')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Pathway details output box */}
              {selectedPathway ? (
                <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-sm text-left animate-fade-in-up">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/5 pb-2 mb-3">
                    <h4 className="text-xs font-bold text-primary font-heading flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-secondary text-primary font-black uppercase text-[9px]">
                        Detail Jalur
                      </span>
                      <span>{selectedPathway.title}</span>
                    </h4>
                    <span className="text-[10px] text-muted-gray uppercase font-semibold">
                      Tag Kecocokan: {selectedPathway.riasecTags.join(', ')}
                    </span>
                  </div>

                  <p className="text-xs text-text-dark/95 leading-relaxed mb-4">
                    {selectedPathway.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                    <div className="bg-bg-warm/50 rounded-xl p-3 border border-primary/5">
                      <h5 className="font-bold text-primary font-heading mb-1.5">Syarat/Kriteria Masuk:</h5>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-text-dark leading-relaxed">
                        {selectedPathway.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-bg-warm/50 rounded-xl p-3 border border-primary/5">
                      <h5 className="font-bold text-primary font-heading mb-1.5">Contoh Instansi/Jurusan Rekomendasi:</h5>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-text-dark leading-relaxed">
                        {selectedPathway.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 text-[11px]">
                    <span className="font-bold text-emerald-800 font-heading">💡 Tips Sukses BK:</span>
                    <p className="text-text-dark leading-relaxed mt-0.5">{selectedPathway.tips}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/40 rounded-2xl py-6 border-2 border-dashed border-primary/5 text-center text-xs text-muted-gray">
                  Silakan ketuk salah satu tombol jalur di atas untuk membuka ringkasan edukatifnya.
                </div>
              )}

            </div>

            {/* 3. LKPD CBT Restrukturisasi Kognitif */}
            <div className="border-t border-primary/5 pt-6 text-left flex flex-col gap-5">
              
              <div className="flex items-center gap-2 text-primary border-b border-primary/5 pb-2">
                <FileText className="text-secondary" />
                <h3 className="text-sm font-bold font-heading">
                  Form LKPD Rencana Aksi Karier Adaptif (Restrukturisasi CBT)
                </h3>
              </div>

              {/* Sub-A: Situasi */}
              <div className="bg-bg-warm/40 p-5 rounded-3xl border border-primary/5 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-heading">
                  Bagian A: Situasi &amp; Tantangan Karier Saat Ini
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    1. Apa program studi, kampus, atau pekerjaan impian yang paling ingin Anda tuju pasca-lulus sekolah nanti?
                  </label>
                  <input 
                    type="text" 
                    value={lkpdGoal}
                    onChange={(e) => setLkpdGoal(e.target.value)}
                    placeholder="Misalnya: Teknik Informatika ITB, Pendidikan Matematika UIN Malang, STAN Akuntansi, atau Membuka Kedai Roti..."
                    className="w-full py-2.5 px-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                      <label>2. Seberapa besar tantangan/hambatan yang dirasakan?</label>
                      <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[10px]">{lkpdChallenge} / 10</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-muted-gray font-semibold">1 (Sangat mudah)</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={lkpdChallenge}
                        onChange={(e) => setLkpdChallenge(parseInt(e.target.value))}
                        className="flex-1 accent-secondary cursor-pointer h-1.5 bg-primary/5 rounded-lg appearance-none"
                      />
                      <span className="text-[9px] text-secondary font-bold">10 (Sangat berat)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary font-heading">
                      3. Tuliskan emosi yang paling sering muncul saat memikirkannya:
                    </label>
                    <input 
                      type="text" 
                      value={lkpdEmotion}
                      onChange={(e) => setLkpdEmotion(e.target.value)}
                      placeholder="Misalnya: Takut, minder, ragu-ragu, tidak berdaya, cemas..."
                      className="w-full py-2.5 px-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-B: Restrukturisasi Kognitif */}
              <div className="bg-bg-warm/40 p-5 rounded-3xl border border-primary/5 flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-heading leading-tight">
                    Bagian B: Restrukturisasi Kognitif Karier
                  </span>
                  <span className="text-[10px] text-muted-gray leading-normal">
                    Mari kita bedah dan kelola pikiran negatif yang membuatmu cemas dengan strategi kognitif adaptif berikut.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    Pertanyaan 1 (Pikiran Negatif): Apa pikiran buruk/keyakinan terburuk yang mengatakan Anda tidak akan bisa sukses meraih impian tersebut?
                  </label>
                  <textarea 
                    value={lkpdNegativeThought}
                    onChange={(e) => setLkpdNegativeThought(e.target.value)}
                    placeholder="Misalnya: 'Saya ini bodoh, nilai matematika saya jelek, mana mungkin lolos ITB. Saya pasti gagal dan mempermalukan keluarga...'"
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    Pertanyaan 2 (Bukti Nyata): Apa bukti atau fakta lapangan yang membuat Anda merasa pikiran buruk itu benar-benar akan terjadi?
                  </label>
                  <textarea 
                    value={lkpdEvidenceNegative}
                    onChange={(e) => setLkpdEvidenceNegative(e.target.value)}
                    placeholder="Misalnya: 'Nilai rapor semester lalu turun, dan saya sering bingung saat mencoba latihan soal UTBK tingkat tinggi...'"
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    Pertanyaan 3 (Fakta Penyeimbang): Sekarang mari cari fakta sebaliknya. Apa saja potensi, nilai rapor yang bagus, kelebihan diri, atau usaha nyata yang Anda miliki untuk membuktikan pikiran buruk itu belum tentu benar?
                  </label>
                  <textarea 
                    value={lkpdCounterEvidence}
                    onChange={(e) => setLkpdCounterEvidence(e.target.value)}
                    placeholder="Misalnya: 'Nilai Bahasa Inggris saya selalu di atas 85, saya rajin merangkum materi belajar di rumah, dan hasil tes minat Holland menunjukkan tipe saya sangat cocok dengan IT...'"
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    Pertanyaan 4 (Sudut Pandang Alternatif): Jika ada sahabat terdekatmu yang sedang minder dan cemas merasa tidak punya masa depan, nasihat motivasi apa yang akan kamu berikan kepadanya?
                  </label>
                  <textarea 
                    value={lkpdAlternativeView}
                    onChange={(e) => setLkpdAlternativeView(e.target.value)}
                    placeholder="Tulis nasihat hangatmu untuk teman: 'Hei, jangan menyerah dulu. Rapor kita tidak buruk kok, lagian sukses itu berproses. Yuk belajar sama-sama...'"
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    Pertanyaan 5 (Keyakinan Baru): Tuliskan satu pola pikir baru yang lebih seimbang, optimis, dan realistis yang akan Anda pegang erat mulai hari ini!
                  </label>
                  <textarea 
                    value={lkpdNewBelief}
                    onChange={(e) => setLkpdNewBelief(e.target.value)}
                    placeholder="Misalnya: 'Saya mungkin memiliki kelemahan di matematika murni, namun saya sangat kuat di kreativitas bahasa dan teknologi. Saya berhak sukses dengan memaksimalkan kelebihan yang saya miliki!'"
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Sub-C: Checklist Tindakan */}
              <div className="bg-bg-warm/40 p-5 rounded-3xl border border-primary/5 flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-heading leading-tight">
                    Bagian C: Checklist Komitmen Tindakan Nyata Siswa
                  </span>
                  <span className="text-[10px] text-muted-gray leading-normal">
                    Pilih minimal <strong>3 tindakan nyata</strong> di bawah ini yang paling berkomitmen akan Anda jalankan dalam waktu dekat!
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {commitmentOptions.map((opt, i) => (
                    <label key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-primary/5 hover:border-secondary transition-all cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCommitments.includes(opt)}
                        onChange={() => handleCommitmentToggle(opt)}
                        className="w-4 h-4 mt-0.5 accent-secondary cursor-pointer"
                      />
                      <span className="text-xs text-text-dark font-medium leading-relaxed">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <label className="text-xs font-bold text-primary font-heading">
                    📌 Rencana 3 Tindakan Terbesarku Bulan Ini (Tulis secara spesifik):
                  </label>
                  
                  {[0, 1, 2].map((i) => (
                    <input 
                      key={i}
                      type="text" 
                      value={monthlyActions[i] || ''}
                      onChange={(e) => handleMonthlyActionChange(i, e.target.value)}
                      placeholder={`Tindakan ke-${i+1} (misal: belajar UTBK 1 jam tiap malam, mendownload kisi-kisi, berkunjung ke Guru BK)...`}
                      className="w-full py-2 px-3 rounded-lg border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-primary/5">
              <button 
                onClick={goToPrevStep}
                className="flex items-center gap-1 py-3 px-5 bg-white border border-primary/10 hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
              
              <button 
                onClick={handleStep5Submit}
                className="flex items-center gap-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Langkah Berikutnya</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Evaluasi Layanan UCE & Booking BK */}
        {step === 6 && (
          <div className="flex flex-col gap-6 select-none animate-fade-in-up">
            <div className="border-b border-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <MessageSquare className="text-secondary stroke-[2.5]" />
                <h2 className="text-lg font-bold font-heading">
                  KOMPONEN 6: REFLEKSI AKHIR &amp; EVALUASI LAYANAN (UCE MODEL)
                </h2>
              </div>
              <p className="text-xs text-text-dark/85 leading-relaxed">
                Anda hampir sampai di akhir proses bimbingan! Isilah lembar evaluasi akhir UCE (Understanding, Comfort, Action) di bawah ini sebagai langkah validasi pemahaman dan kenyamanan layanan bimbingan mandiri.
              </p>
            </div>

            <div className="flex flex-col gap-5 my-2 max-w-2xl mx-auto w-full text-left">
              
              {/* UCE Slider Grid */}
              <div className="bg-bg-warm/40 p-5 rounded-3xl border border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Understanding */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                    <label>Understanding (Pemahaman Jurusan/Potensi)</label>
                    <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[9px]">{evalUnderstanding} / 10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={evalUnderstanding}
                    onChange={(e) => setEvalUnderstanding(parseInt(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-1.5 bg-primary/5 rounded-lg appearance-none"
                  />
                </div>

                {/* Comfort */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                    <label>Comfort (Tingkat Kenyamanan Layanan)</label>
                    <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[9px]">{evalComfort} / 10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={evalComfort}
                    onChange={(e) => setEvalComfort(parseInt(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-1.5 bg-primary/5 rounded-lg appearance-none"
                  />
                </div>

                {/* Action */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                    <label>Action (Kemantapan Melakukan Aksi)</label>
                    <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[9px]">{evalAction} / 10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={evalAction}
                    onChange={(e) => setEvalAction(parseInt(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-1.5 bg-primary/5 rounded-lg appearance-none"
                  />
                </div>

              </div>

              {/* Evaluation Fields */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary font-heading">
                    1. Bagaimana perasaan atau tingkat ketenangan Anda setelah menyelesaikan seluruh rangkaian instrumen bimbingan di website ini?
                  </label>
                  <textarea 
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                    placeholder="Tuliskan refleksimu (misalnya: Saya merasa lebih tenang, merasa beban berkurang karena menyusun rencana cadangan, atau merasa bersemangat karena Holland sesuai)..."
                    className="w-full min-h-[60px] p-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-bg-warm/50 border border-primary/5">
                    <div className="flex justify-between items-center text-xs font-bold text-primary font-heading">
                      <label>2. Seberapa cemas Anda menghadapi masa depan SEKARANG?</label>
                      <span className="text-secondary bg-secondary/15 py-0.5 px-2 rounded-md font-extrabold text-[10px]">{evalPostAnxiety} / 10</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-muted-gray font-semibold">1 (Tidak Cemas)</span>
                      <input 
                        type="range" min="1" max="10" 
                        value={evalPostAnxiety}
                        onChange={(e) => setEvalPostAnxiety(parseInt(e.target.value))}
                        className="flex-1 accent-secondary cursor-pointer h-1.5 bg-primary/5 rounded-lg appearance-none"
                      />
                      <span className="text-[9px] text-secondary font-bold">10 (Sangat Cemas)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary font-heading">
                      3. Adakah hal krusial yang paling ingin Anda bahas secara tatap muka dengan Guru BK nanti?
                    </label>
                    <input 
                      type="text" 
                      value={evalDiscussion}
                      onChange={(e) => setEvalDiscussion(e.target.value)}
                      placeholder="Tulis hal krusial (misal: Restu orang tua, bingung menentukan cadangan PTS)..."
                      className="w-full py-2.5 px-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Central final submit block */}
              <div className="w-full bg-gradient-to-tr from-secondary to-secondary-light/30 rounded-3xl p-5 border border-secondary/20 text-primary flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="text-left flex flex-col gap-0.5">
                  <span className="text-xs font-bold font-heading flex items-center gap-1">
                    <CheckCircle size={16} className="text-primary" />
                    Kirim Portofolio Bimbingan Anda
                  </span>
                  <p className="text-[10px] text-primary/80 max-w-md">
                    Seluruh data pengerjaan, skor kecemasan, visual grafik radar RIASEC, dan checklist aksi kognitif Anda akan dikemas otomatis ke portal Guru BK untuk ditindaklanjuti.
                  </p>
                </div>
                
                <button
                  onClick={handleFinalSubmit}
                  className="py-3 px-6 bg-primary hover:bg-primary-light text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  Kirim Portofolio Karier
                </button>
              </div>

            </div>

            {/* Wizard Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-primary/5">
              <button 
                onClick={goToPrevStep}
                className="flex items-center gap-1 py-3 px-5 bg-white border border-primary/10 hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
              
              <button 
                onClick={handleFinalSubmit}
                className="flex items-center gap-1.5 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Selesai &amp; Kirim</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </section>

    </main>
  );
}

export default function StudentWizard() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 select-none">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    }>
      <StudentWizardInner />
    </Suspense>
  );
}

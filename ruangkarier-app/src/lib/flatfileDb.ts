import fs from 'fs/promises';
import path from 'path';

// Path to data/db.json
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface StudentSession {
  id: string;
  profile?: {
    name: string;
    className: string;
    consentChecked: boolean;
    confidenceScore: number;
    mainProblem: string;
    prepNotes: string;
  };
  screeningResponses?: Record<string, number>;
  anxietyLogs?: {
    academicPressureScore: number;
    graduationAnxietyScore: number;
    needsImmediateHelp: boolean;
    triggeredAlert: boolean;
    createdAt: string;
  };
  riasecResponses?: Record<number, number>;
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
  updatedAt?: string;
}

export interface DbSchema {
  students: StudentSession[];
  counselorSettings: {
    passcode: string;
    schoolName: string;
    updatedAt: string;
  };
}

// Ensure the db.json file and directory exist
async function ensureDbExists() {
  try {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    const defaultData: DbSchema = {
      students: [],
      counselorSettings: {
        passcode: "BK2026",
        schoolName: "SMA Negeri Pilihan",
        updatedAt: new Date().toISOString()
      }
    };
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Read database
export async function readDb(): Promise<DbSchema> {
  await ensureDbExists();
  const rawData = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(rawData) as DbSchema;
}

// Write to database atomically
export async function writeDb(data: DbSchema): Promise<void> {
  await ensureDbExists();
  const tmpPath = `${DB_PATH}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmpPath, DB_PATH);
}

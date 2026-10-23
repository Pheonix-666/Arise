// ── Root Stack ─────────────────────────────────────────────────
export type RootStackParamList = {
  ModeSelect: undefined;
  // Fitness stack
  FitnessTabs: undefined;
  ExerciseDetail: { exerciseId: string };
  ProgramDetail: { programId: string };
  ActiveProgram: undefined;
  CustomProgramBuilder: { programId?: string };
  WorkoutSession: { programId?: string; dayIndex?: number; exerciseIds?: string[] };
  SessionSummary: { sessionId: string };
  SessionDetail: { sessionId: string };
  ShadowArmy: undefined;
  BodyStats: undefined;
  // Other modes
  TaskHome: undefined;
  MonarchHome: undefined;
};

export type FitnessTab = 'home' | 'exercises' | 'programs' | 'history' | 'prs';
export type AppView = 'mode-select' | 'fitness' | 'tasks' | 'monarch' | 'active-session' | 'session-summary';

// ── App Modes ──────────────────────────────────────────────────
export type AppMode = 'fitness' | 'task' | 'monarch';

// ── User / Progression ─────────────────────────────────────────
export interface UserProfile {
  uid: string;
  displayName: string;
  level: number;
  xp: number;
  totalXp: number;
  rank: HunterRank;
  activeMode: AppMode | null;
  createdAt: number;
}

// ── Hunter Rank / Level ─────────────────────────────────────────
export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface RankThreshold {
  rank: HunterRank;
  minLevel: number;
  label: string;
  color: string;
}

export const RANK_THRESHOLDS: RankThreshold[] = [
  { rank: 'E', minLevel: 1,  label: 'Goblin-Rank',   color: '#6b7280' },
  { rank: 'D', minLevel: 10, label: 'Dungeon-Rank',  color: '#22c55e' },
  { rank: 'C', minLevel: 20, label: 'Gate-Rank',     color: '#4dd8ff' },
  { rank: 'B', minLevel: 35, label: 'Raid-Rank',     color: '#f59e0b' },
  { rank: 'A', minLevel: 50, label: 'Shadow-Rank',   color: '#a855f7' },
  { rank: 'S', minLevel: 75, label: 'Monarch-Rank',  color: '#ef4444' },
];

export function getRankForLevel(level: number): RankThreshold {
  return [...RANK_THRESHOLDS].reverse().find(r => level >= r.minLevel) ?? RANK_THRESHOLDS[0];
}

// ── Stats ───────────────────────────────────────────────────────
export type Stat = 'STR' | 'VIT' | 'AGI' | 'SENSE';

export const STAT_COLORS: Record<Stat, string> = {
  STR:   '#ef4444',
  VIT:   '#22c55e',
  AGI:   '#f59e0b',
  SENSE: '#a855f7',
};

export interface StatBlock {
  STR: number;
  VIT: number;
  AGI: number;
  SENSE: number;
}

// XP per stat point = 500 XP
export const STAT_XP_PER_POINT = 500;
// Global level threshold (shared across modes)
export const XP_PER_LEVEL = 1000;

// ── Exercise / Fitness ─────────────────────────────────────────
export type MuscleGroup =
  | 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms'
  | 'Core' | 'Cardio' | 'Mobility' | 'Full Body';

export type Equipment =
  | 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine'
  | 'Bodyweight' | 'Kettlebell' | 'Resistance Band' | 'Cardio Machine' | 'None';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  statWeighting: Partial<Record<Stat, number>>;  // sum should = 1.0
  instructions: string[];
  defaultSets: number;
  defaultReps: string;    // e.g. "8-12" or "60s"
  restSeconds: number;
}

// ── Programs ────────────────────────────────────────────────────
export type ProgramTier = 'Goblin' | 'Dungeon' | 'Gate' | 'Raid';
export type ProgramDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds?: number;
  note?: string;
}

export interface ProgramDay {
  name: string;               // e.g. "Day A – Push"
  exercises: ProgramExercise[];
  isRestDay?: boolean;
}

export interface Program {
  id: string;
  name: string;
  tier: ProgramTier;
  difficulty: ProgramDifficulty;
  daysPerWeek: number;
  description: string;
  primaryStats: Stat[];
  days: ProgramDay[];
  isCustom?: boolean;
  ownerId?: string;
}

// ── Workout Sessions ────────────────────────────────────────────
export interface SetLog {
  exerciseId: string;
  setIndex: number;
  weight?: number;
  reps?: number;
  durationSeconds?: number;
  distanceKm?: number;
  completedAt: number;  // timestamp
}

export interface WorkoutSession {
  id: string;
  date: string;             // ISO date string "YYYY-MM-DD"
  programId?: string;
  programDayName?: string;
  sets: SetLog[];
  durationSeconds: number;
  xpEarned: Partial<Record<Stat, number>>;
  totalXp: number;
  prsHit: string[];         // exerciseIds
  synced: boolean;
}

// ── Personal Records ────────────────────────────────────────────
export interface PersonalRecord {
  exerciseId: string;
  bestWeight: number;
  bestReps: number;
  achievedDate: string;     // ISO date
  oneRepMax?: number;       // Epley formula: weight × (1 + reps/30)
}

// ── User Fitness Profile ────────────────────────────────────────
export interface UserFitnessProfile {
  activeProgramId?: string;
  currentProgramWeek: number;
  currentProgramDayIndex: number;   // which day of the week we're on
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: string;         // ISO date
  totalSessionsLogged: number;
  lifetimeFitnessXp: number;
  stats: StatBlock;                 // cumulative stat points
  statXpProgress: StatBlock;        // XP toward next point per stat
  shadowRoster: ShadowSoldier[];
  lastGateClearWeek?: string;       // e.g. "2026-W35" or "P1_W1"
}

// ── Tasks / Quests ─────────────────────────────────────────────
export type TaskDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  xpReward: number;
  completed: boolean;
  dueDate?: number;
  createdAt: number;
}

// ── Monarch Mode & Shadow Army ─────────────────────────────────
export interface ShadowSoldier {
  id: string;
  name: string;
  tier: HunterRank;
  sourceType: 'PR' | 'ProgramClear' | 'Chance';
  extractedAt: number;
  power?: number;
}


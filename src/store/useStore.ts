'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  Quest,
  WorkoutSession,
  UserFitnessProfile,
  PersonalRecord,
  SetLog,
  HunterRank,
  ShadowSoldier,
  XP_PER_LEVEL,
  getRankForLevel,
  TaskDifficulty,
  AppMode,
} from '../types';
import { applyStatXp, buildUpdatedPrs, calculateSessionXp, checkLevelUp } from '../utils/xpEngine';
import { PROGRAM_BY_ID } from '../data/programs';
import { systemSound } from '../utils/sound';

const SHADOW_TITLES = [
  'Infantry',
  'Knight',
  'Commander',
  'Beast',
  'Archmage',
  'General',
  'Warlord',
  'Guardian',
  'Assassin',
  'Vanguard',
  'Ironclaw',
  'Bloodfang',
  'Void Stalker',
];

export function generateShadowSoldier(
  userRank: HunterRank,
  sourceType: 'PR' | 'ProgramClear' | 'Chance' | 'Awakening'
): ShadowSoldier {
  const RANKS: HunterRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
  const userRankIdx = Math.max(0, RANKS.indexOf(userRank));

  // Chance of pulling 1 or 2 tiers above user's rank (capped at 'S')
  let tier = userRank;
  if (sourceType === 'Awakening') {
    tier = Math.random() < 0.6 ? 'S' : 'A';
  } else if (Math.random() < 0.15 && userRankIdx < RANKS.length - 1) {
    tier = RANKS[Math.min(userRankIdx + 1, RANKS.length - 1)];
  }

  const randomTitle = SHADOW_TITLES[Math.floor(Math.random() * SHADOW_TITLES.length)];
  const shadowId = `shadow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return {
    id: shadowId,
    name: `Shadow ${randomTitle}`,
    tier,
    sourceType: sourceType === 'Awakening' ? 'Chance' : sourceType,
    extractedAt: Date.now(),
    power: (RANKS.indexOf(tier) + 1) * 200 + Math.floor(Math.random() * 80),
  };
}

export const DIFFICULTY_XP: Record<TaskDifficulty, number> = {
  E: 50,
  D: 100,
  C: 200,
  B: 400,
  A: 750,
  S: 1500,
};

const DEFAULT_USER: UserProfile = {
  uid: 'hunter_01',
  displayName: 'Sung Jin-Woo',
  level: 1,
  xp: 0,
  totalXp: 0,
  rank: 'E',
  activeMode: 'fitness',
  createdAt: Date.now(),
};

const DEFAULT_FITNESS_PROFILE: UserFitnessProfile = {
  activeProgramId: 'full_body_3x',
  currentProgramWeek: 1,
  currentProgramDayIndex: 0,
  currentStreak: 3,
  longestStreak: 5,
  totalSessionsLogged: 2,
  lifetimeFitnessXp: 450,
  stats: { STR: 12, VIT: 11, AGI: 10, SENSE: 10 },
  statXpProgress: { STR: 210, VIT: 140, AGI: 50, SENSE: 50 },
  shadowRoster: [
    {
      id: 'init_shadow_1',
      name: 'Shadow Infantry',
      tier: 'E',
      sourceType: 'Chance',
      extractedAt: Date.now() - 86400000 * 2,
      power: 240,
    },
    {
      id: 'init_shadow_2',
      name: 'Shadow Knight Igris',
      tier: 'A',
      sourceType: 'PR',
      extractedAt: Date.now() - 86400000,
      power: 1150,
    },
  ],
  lastGateClearWeek: undefined,
};

const SEED_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Daily Protocol: 100 Push-ups',
    description: 'Full range of motion. Chest must touch floor. The System demands consistency.',
    difficulty: 'D',
    xpReward: 100,
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'q2',
    title: 'Cognitive Enhancement: 30 Mins Tactical Reading',
    description: 'Expand your mental acuity and strategic understanding.',
    difficulty: 'E',
    xpReward: 50,
    completed: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'q3',
    title: 'Mental Fortitude: Cold Shower Protocol',
    description: '3 minutes freezing water conditioning. SENSE and VIT stat calibration.',
    difficulty: 'C',
    xpReward: 200,
    completed: false,
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'q4',
    title: 'Dungeon Run: 5KM Endurance March',
    description: 'Maintain zone 3 aerobic heart rate without stopping.',
    difficulty: 'B',
    xpReward: 400,
    completed: false,
    createdAt: Date.now() - 14400000,
  },
];

const SEED_PRS: Record<string, PersonalRecord> = {
  bench_press: {
    exerciseId: 'bench_press',
    bestWeight: 80,
    bestReps: 6,
    achievedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    oneRepMax: 96,
  },
  squat: {
    exerciseId: 'squat',
    bestWeight: 100,
    bestReps: 5,
    achievedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    oneRepMax: 117,
  },
  deadlift: {
    exerciseId: 'deadlift',
    bestWeight: 120,
    bestReps: 4,
    achievedDate: new Date(Date.now() - 86400000).toISOString(),
    oneRepMax: 136,
  },
};

const SEED_SESSIONS: WorkoutSession[] = [
  {
    id: 'ws_demo_1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    programId: 'full_body_3x',
    programDayName: 'Day A — Full Body',
    sets: [
      { exerciseId: 'bench_press', setIndex: 0, weight: 80, reps: 6, completedAt: Date.now() - 86400000 * 2 },
      { exerciseId: 'squat', setIndex: 1, weight: 100, reps: 5, completedAt: Date.now() - 86400000 * 2 },
    ],
    durationSeconds: 2450,
    xpEarned: { STR: 180, VIT: 70 },
    totalXp: 250,
    prsHit: ['bench_press'],
    synced: true,
  },
];

interface ActiveSessionState {
  isActive: boolean;
  programId?: string;
  dayName?: string;
  startTime: number;
  sets: SetLog[];
}

export interface AppState {
  // User
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Navigation mode
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;

  // Quests
  quests: Quest[];
  addQuest: (title: string, description: string, difficulty: TaskDifficulty) => void;
  completeQuest: (id: string) => void;
  removeQuest: (id: string) => void;

  // Fitness Mode
  fitnessProfile: UserFitnessProfile;
  sessions: WorkoutSession[];
  personalRecords: Record<string, PersonalRecord>;
  activeSession: ActiveSessionState;

  // Fitness Actions
  setActiveProgram: (programId: string) => void;
  advanceProgramDay: () => void;
  startWorkout: (programId?: string, dayName?: string) => void;
  logSet: (set: Omit<SetLog, 'completedAt' | 'setIndex'>) => void;
  removeSet: (setIndex: number) => void;
  finishWorkout: () => { sessionId: string; prsHit: string[]; totalXp: number; extractedShadow: ShadowSoldier | null; leveledUp: boolean };
  cancelWorkout: () => void;

  // Monarch Awakening
  summonAwakeningShadow: () => ShadowSoldier;

  // Reset
  resetToDefaults: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      setUser: (user) => set({ user }),

      soundEnabled: true,
      toggleSound: () => {
        const next = !get().soundEnabled;
        systemSound.enabled = next;
        set({ soundEnabled: next });
        if (next) systemSound.playClick();
      },

      activeMode: 'fitness',
      setActiveMode: (mode) => {
        systemSound.playClick();
        set({ activeMode: mode });
      },

      quests: SEED_QUESTS,
      addQuest: (title, description, difficulty) => {
        const newQuest: Quest = {
          id: `quest_${Date.now()}`,
          title: title.trim(),
          description: description.trim(),
          difficulty,
          xpReward: DIFFICULTY_XP[difficulty],
          completed: false,
          createdAt: Date.now(),
        };
        systemSound.playClick();
        set((state) => ({ quests: [newQuest, ...state.quests] }));
      },

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);
        if (!quest || quest.completed) return;

        systemSound.playQuestComplete();
        const xpEarned = quest.xpReward;
        const { newLevel, newXp } = checkLevelUp(state.user.level, state.user.xp, xpEarned, XP_PER_LEVEL);
        const newRank = getRankForLevel(newLevel).rank;

        if (newLevel > state.user.level) {
          setTimeout(() => systemSound.playLevelUp(), 400);
        }

        set({
          quests: state.quests.map((q) => (q.id === id ? { ...q, completed: true } : q)),
          user: {
            ...state.user,
            xp: newXp,
            totalXp: state.user.totalXp + xpEarned,
            level: newLevel,
            rank: newRank,
          },
        });
      },

      removeQuest: (id) => {
        systemSound.playClick();
        set((state) => ({ quests: state.quests.filter((q) => q.id !== id) }));
      },

      fitnessProfile: DEFAULT_FITNESS_PROFILE,
      sessions: SEED_SESSIONS,
      personalRecords: SEED_PRS,
      activeSession: {
        isActive: false,
        startTime: 0,
        sets: [],
      },

      setActiveProgram: (programId) => {
        systemSound.playClick();
        set((state) => ({
          fitnessProfile: {
            ...state.fitnessProfile,
            activeProgramId: programId,
            currentProgramWeek: 1,
            currentProgramDayIndex: 0,
          },
        }));
      },

      advanceProgramDay: () => {
        systemSound.playClick();
        set((state) => ({
          fitnessProfile: {
            ...state.fitnessProfile,
            currentProgramDayIndex: state.fitnessProfile.currentProgramDayIndex + 1,
          },
        }));
      },

      startWorkout: (programId, dayName) => {
        systemSound.playClick();
        set({
          activeSession: {
            isActive: true,
            programId,
            dayName,
            startTime: Date.now(),
            sets: [],
          },
        });
      },

      logSet: (setLog) => {
        const state = get();
        const newSet: SetLog = {
          ...setLog,
          setIndex: state.activeSession.sets.length,
          completedAt: Date.now(),
        };

        const currentPr = setLog.weight && setLog.reps ? state.personalRecords[setLog.exerciseId] : null;
        const prevBest = (currentPr?.bestWeight || 0) * (currentPr?.bestReps || 0);
        const thisScore = (setLog.weight || 0) * (setLog.reps || 0);

        if (thisScore > prevBest && prevBest > 0) {
          systemSound.playBossKill();
        } else {
          systemSound.playClick();
        }

        set({
          activeSession: {
            ...state.activeSession,
            sets: [...state.activeSession.sets, newSet],
          },
        });
      },

      removeSet: (setIndex) => {
        systemSound.playClick();
        set((state) => {
          const updated = state.activeSession.sets
            .filter((s) => s.setIndex !== setIndex)
            .map((s, idx) => ({ ...s, setIndex: idx }));
          return {
            activeSession: {
              ...state.activeSession,
              sets: updated,
            },
          };
        });
      },

      finishWorkout: () => {
        const state = get();
        if (!state.activeSession.isActive) {
          return { sessionId: '', prsHit: [], totalXp: 0, extractedShadow: null, leveledUp: false };
        }

        const endTime = Date.now();
        const durationSeconds = Math.max(1, Math.round((endTime - state.activeSession.startTime) / 1000));
        const dateStr = new Date().toISOString();

        // 1. Calculate XP
        const { statXp, totalXp, prsHit } = calculateSessionXp(
          state.activeSession.sets,
          state.personalRecords
        );

        // 2. Gate clear bonus
        const activeProg = state.activeSession.programId ? PROGRAM_BY_ID[state.activeSession.programId] : null;
        const daysPerWeek = activeProg ? activeProg.daysPerWeek : 3;
        const nextDayIndex = state.fitnessProfile.currentProgramDayIndex + 1;
        let bonusXp = 0;
        let lastGateClearWeek = state.fitnessProfile.lastGateClearWeek;

        if (nextDayIndex > 0 && nextDayIndex % daysPerWeek === 0) {
          const weekKey = `P_${state.activeSession.programId || 'custom'}_W${state.fitnessProfile.currentProgramWeek}`;
          if (lastGateClearWeek !== weekKey) {
            bonusXp = 500;
            lastGateClearWeek = weekKey;
          }
        }

        const grandTotalXp = Math.max(50, totalXp + bonusXp);

        // 3. Shadow Extraction Check
        let extractedShadow: ShadowSoldier | null = null;
        if (prsHit.length > 0) {
          extractedShadow = generateShadowSoldier(state.user.rank, 'PR');
        } else if (state.activeSession.programId) {
          extractedShadow = generateShadowSoldier(state.user.rank, 'ProgramClear');
        } else if (Math.random() < 0.25) {
          extractedShadow = generateShadowSoldier(state.user.rank, 'Chance');
        }

        const updatedShadowRoster = extractedShadow
          ? [extractedShadow, ...(state.fitnessProfile.shadowRoster || [])]
          : state.fitnessProfile.shadowRoster || [];

        // 4. Update PRs
        const newPrs = buildUpdatedPrs(state.personalRecords, state.activeSession.sets, dateStr);

        // 5. Update Stats & Levels
        const { newStats, newProgress } = applyStatXp(
          state.fitnessProfile.stats,
          state.fitnessProfile.statXpProgress,
          statXp
        );

        const { newLevel, newXp } = checkLevelUp(
          state.user.level,
          state.user.xp,
          grandTotalXp,
          XP_PER_LEVEL
        );

        const leveledUp = newLevel > state.user.level;
        const newRank = getRankForLevel(newLevel).rank;

        const sessionId = `ws_${Date.now()}`;
        const newSession: WorkoutSession = {
          id: sessionId,
          date: dateStr,
          programId: state.activeSession.programId,
          programDayName: state.activeSession.dayName,
          sets: state.activeSession.sets,
          durationSeconds,
          xpEarned: statXp,
          totalXp: grandTotalXp,
          prsHit,
          synced: true,
        };

        if (prsHit.length > 0) {
          systemSound.playBossKill();
        } else if (leveledUp) {
          systemSound.playLevelUp();
        } else {
          systemSound.playQuestComplete();
        }

        set({
          sessions: [newSession, ...state.sessions],
          personalRecords: newPrs,
          activeSession: { isActive: false, startTime: 0, sets: [] },
          user: {
            ...state.user,
            xp: newXp,
            totalXp: state.user.totalXp + grandTotalXp,
            level: newLevel,
            rank: newRank,
          },
          fitnessProfile: {
            ...state.fitnessProfile,
            stats: newStats,
            statXpProgress: newProgress,
            lifetimeFitnessXp: state.fitnessProfile.lifetimeFitnessXp + grandTotalXp,
            totalSessionsLogged: state.fitnessProfile.totalSessionsLogged + 1,
            currentProgramDayIndex: nextDayIndex,
            lastSessionDate: dateStr,
            shadowRoster: updatedShadowRoster,
            lastGateClearWeek,
          },
        });

        return { sessionId, prsHit, totalXp: grandTotalXp, extractedShadow, leveledUp };
      },

      cancelWorkout: () => {
        systemSound.playClick();
        set({
          activeSession: { isActive: false, startTime: 0, sets: [] },
        });
      },

      summonAwakeningShadow: () => {
        systemSound.playAriseResonance();
        const soldier = generateShadowSoldier(get().user.rank, 'Awakening');
        set((prev) => ({
          fitnessProfile: {
            ...prev.fitnessProfile,
            shadowRoster: [soldier, ...(prev.fitnessProfile.shadowRoster || [])],
          },
        }));
        return soldier;
      },

      resetToDefaults: () => {
        systemSound.playClick();
        set({
          user: DEFAULT_USER,
          fitnessProfile: DEFAULT_FITNESS_PROFILE,
          quests: SEED_QUESTS,
          sessions: SEED_SESSIONS,
          personalRecords: SEED_PRS,
          activeSession: { isActive: false, startTime: 0, sets: [] },
        });
      },
    }),
    {
      name: 'arise_system_store_v2',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

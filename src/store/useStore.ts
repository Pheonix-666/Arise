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
  StatBlock,
  Stat,
  FinishWorkoutResult,
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
  displayName: 'Hunter',
  level: 1,
  xp: 0,
  totalXp: 0,
  rank: 'E',
  createdAt: Date.now(),
};

const DEFAULT_FITNESS_PROFILE: UserFitnessProfile = {
  activeProgramId: 'full_body_3x',
  currentProgramWeek: 1,
  currentProgramDayIndex: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalSessionsLogged: 0,
  lifetimeFitnessXp: 0,
  stats: { STR: 10, VIT: 10, AGI: 10, SENSE: 10 },
  statXpProgress: { STR: 0, VIT: 0, AGI: 0, SENSE: 0 },
  shadowRoster: [],
  lastGateClearWeek: undefined,
};

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

  // Post-Raid Summary
  pendingSummary: FinishWorkoutResult | null;
  setPendingSummary: (summary: FinishWorkoutResult | null) => void;

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
  finishWorkout: () => FinishWorkoutResult;
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

      pendingSummary: null,
      setPendingSummary: (summary) => set({ pendingSummary: summary }),

      quests: [],
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
      sessions: [],
      personalRecords: {},
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
          quests: [],
          sessions: [],
          personalRecords: {},
          activeSession: { isActive: false, startTime: 0, sets: [] },
          pendingSummary: null,
        });
      },
    }),
    {
      name: 'arise_system_store_v2',
      version: 4,
      migrate: (persistedState: unknown, version: number) => {
        try {
          if (!persistedState || typeof persistedState !== 'object') {
            return {
              user: DEFAULT_USER,
              soundEnabled: true,
              pendingSummary: null,
              quests: [],
              fitnessProfile: DEFAULT_FITNESS_PROFILE,
              sessions: [],
              personalRecords: {},
              activeSession: { isActive: false, startTime: 0, sets: [] },
            };
          }

          const rawState = persistedState as Record<string, unknown>;
          let state = rawState;

          if (version < 3) {
            // 1. Remove seeded session 'ws_demo_1'
            const rawSessions = Array.isArray(rawState.sessions)
              ? (rawState.sessions as WorkoutSession[])
              : [];
            const sessions = rawSessions.filter(
              (s): s is WorkoutSession => Boolean(s && s.id !== 'ws_demo_1')
            );

            // 2. PR exercise ids filter: remove 'bench_press', 'squat', 'deadlift' ONLY if achievedDate matches no real session
            const seededPrIds = new Set(['bench_press', 'squat', 'deadlift']);
            const rawPrs = rawState.personalRecords as Record<string, PersonalRecord> | undefined;
            const personalRecords: Record<string, PersonalRecord> = {};

            if (rawPrs && typeof rawPrs === 'object') {
              for (const [key, pr] of Object.entries(rawPrs)) {
                if (!pr || typeof pr !== 'object') continue;
                if (seededPrIds.has(key)) {
                  const prDate = pr.achievedDate;
                  const matchesRealSession = sessions.some((s) => {
                    if (!s.date || !prDate) return false;
                    return s.date === prDate || s.date.startsWith(prDate) || prDate.startsWith(s.date);
                  });
                  if (!matchesRealSession) {
                    continue; // drop seeded PR
                  }
                }
                personalRecords[key] = pr;
              }
            }

            // 3. Remove seeded quests: q1, q2, q3, q4
            const seededQuestIds = new Set(['q1', 'q2', 'q3', 'q4']);
            const rawQuests = Array.isArray(rawState.quests)
              ? (rawState.quests as Quest[])
              : [];
            const quests = rawQuests.filter(
              (q): q is Quest => Boolean(q && !seededQuestIds.has(q.id))
            );

            // 4. Remove seeded shadows: init_shadow_1, init_shadow_2
            const seededShadowIds = new Set(['init_shadow_1', 'init_shadow_2']);
            const rawFitness = rawState.fitnessProfile as Partial<UserFitnessProfile> | undefined;
            const rawShadows = Array.isArray(rawFitness?.shadowRoster)
              ? (rawFitness.shadowRoster as ShadowSoldier[])
              : [];
            const shadowRoster = rawShadows.filter(
              (sh): sh is ShadowSoldier => Boolean(sh && !seededShadowIds.has(sh.id))
            );

            // 5. Recompute from what remains
            const totalSessionsLogged = sessions.length;
            const lifetimeFitnessXp = sessions.reduce((sum, s) => sum + (s.totalXp || 0), 0);

            // Stats and statXpProgress from baseline 10 plus sum of session xpEarned via applyStatXp
            const earnedStatXpTotals: Partial<Record<Stat, number>> = {
              STR: 0,
              VIT: 0,
              AGI: 0,
              SENSE: 0,
            };
            for (const session of sessions) {
              if (session.xpEarned) {
                for (const [statKey, xpVal] of Object.entries(session.xpEarned)) {
                  if (typeof xpVal === 'number') {
                    const sk = statKey as Stat;
                    earnedStatXpTotals[sk] = (earnedStatXpTotals[sk] || 0) + xpVal;
                  }
                }
              }
            }
            const baselineStats: StatBlock = { STR: 10, VIT: 10, AGI: 10, SENSE: 10 };
            const baselineProgress: StatBlock = { STR: 0, VIT: 0, AGI: 0, SENSE: 0 };
            const { newStats, newProgress } = applyStatXp(
              baselineStats,
              baselineProgress,
              earnedStatXpTotals
            );

            // user.totalXp from sessions plus completed quests
            const completedQuestXp = quests
              .filter((q) => q.completed)
              .reduce((sum, q) => sum + (q.xpReward || 0), 0);
            const totalUserXp = lifetimeFitnessXp + completedQuestXp;

            // user level/xp/rank from totalXp via checkLevelUp
            const { newLevel, newXp } = checkLevelUp(1, 0, totalUserXp, XP_PER_LEVEL);
            const newRank = getRankForLevel(newLevel).rank;

            const rawUser = rawState.user as Partial<UserProfile> | undefined;

            const updatedUser: UserProfile = {
              uid: rawUser?.uid || DEFAULT_USER.uid,
              displayName:
                rawUser?.displayName && rawUser.displayName !== 'Sung Jin-Woo'
                  ? rawUser.displayName
                  : DEFAULT_USER.displayName,
              level: newLevel,
              xp: newXp,
              totalXp: totalUserXp,
              rank: newRank,
              createdAt: rawUser?.createdAt || DEFAULT_USER.createdAt,
            };

            const updatedFitnessProfile: UserFitnessProfile = {
              activeProgramId: rawFitness?.activeProgramId || DEFAULT_FITNESS_PROFILE.activeProgramId,
              currentProgramWeek: rawFitness?.currentProgramWeek ?? DEFAULT_FITNESS_PROFILE.currentProgramWeek,
              currentProgramDayIndex: rawFitness?.currentProgramDayIndex ?? DEFAULT_FITNESS_PROFILE.currentProgramDayIndex,
              currentStreak: 0,
              longestStreak: 0,
              lastSessionDate: rawFitness?.lastSessionDate,
              totalSessionsLogged,
              lifetimeFitnessXp,
              stats: newStats,
              statXpProgress: newProgress,
              shadowRoster,
              lastGateClearWeek: rawFitness?.lastGateClearWeek,
            };

            state = {
              ...state,
              user: updatedUser,
              fitnessProfile: updatedFitnessProfile,
              quests,
              sessions,
              personalRecords,
              activeSession: { isActive: false, startTime: 0, sets: [] },
            };
          }

          if (version < 4) {
            const { activeMode: _rootMode, ...restState } = state;
            let cleanUser = DEFAULT_USER;
            if (restState.user && typeof restState.user === 'object') {
              const { activeMode: _userMode, ...rawUserClean } = restState.user as Record<string, unknown>;
              cleanUser = {
                ...DEFAULT_USER,
                ...rawUserClean,
              } as UserProfile;
            }
            state = {
              ...restState,
              user: cleanUser,
              pendingSummary: null,
            };
          }

          return state;
        } catch (err) {
          console.error('[System Store] Migration failed, falling back to defaults:', err);
          return {
            user: DEFAULT_USER,
            soundEnabled: true,
            pendingSummary: null,
            quests: [],
            fitnessProfile: DEFAULT_FITNESS_PROFILE,
            sessions: [],
            personalRecords: {},
            activeSession: { isActive: false, startTime: 0, sets: [] },
          };
        }
      },
      partialize: (state) => {
        const { pendingSummary: _omitted, ...persistedFields } = state;
        return persistedFields;
      },
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

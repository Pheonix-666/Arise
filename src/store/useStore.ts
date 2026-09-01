import { create } from 'zustand';
import { 
  AppMode, 
  UserProfile, 
  Quest, 
  WorkoutSession,
  UserFitnessProfile,
  PersonalRecord,
  SetLog,
  StatBlock,
  HunterRank,
  ShadowSoldier,
  XP_PER_LEVEL,
  getRankForLevel
} from '../types';
import { applyStatXp, buildUpdatedPrs, calculateSessionXp, checkLevelUp } from '../utils/xpEngine';

import { PROGRAM_BY_ID } from '../data/programs';

const SHADOW_TITLES = ['Infantry', 'Knight', 'Commander', 'Beast', 'Archmage', 'General', 'Warlord', 'Guardian', 'Assassin', 'Vanguard'];

function generateShadowSoldier(
  userRank: HunterRank,
  sourceType: 'PR' | 'ProgramClear' | 'Chance'
): ShadowSoldier {
  const RANKS: HunterRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
  const userRankIdx = Math.max(0, RANKS.indexOf(userRank));
  
  // ~10% chance of pulling 1 tier above user's rank (capped at 'S')
  let tier = userRank;
  if (Math.random() < 0.10 && userRankIdx < RANKS.length - 1) {
    tier = RANKS[userRankIdx + 1];
  }
  
  const randomTitle = SHADOW_TITLES[Math.floor(Math.random() * SHADOW_TITLES.length)];
  const shadowId = `shadow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  return {
    id: shadowId,
    name: `Shadow ${randomTitle}`,
    tier,
    sourceType,
    extractedAt: Date.now(),
    power: (RANKS.indexOf(tier) + 1) * 150 + Math.floor(Math.random() * 50),
  };
}

// Initial default user state
const DEFAULT_USER: UserProfile = {
  uid: 'hunter_01',
  displayName: 'Sung Jin-Woo',
  level: 1,
  xp: 0,
  totalXp: 0,
  rank: 'E',
  activeMode: null,
  createdAt: Date.now(),
};

const DEFAULT_FITNESS_PROFILE: UserFitnessProfile = {
  activeProgramId: undefined,
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

interface AppState {
  // User
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Mode selection
  activeMode: AppMode | null;
  setActiveMode: (mode: AppMode) => void;

  // Quests
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  completeQuest: (id: string) => void;
  removeQuest: (id: string) => void;

  // ── FITNESS MODE STATE ──
  fitnessProfile: UserFitnessProfile;
  sessions: WorkoutSession[];
  personalRecords: Record<string, PersonalRecord>;
  activeSession: ActiveSessionState;
  
  // Fitness Actions
  setActiveProgram: (programId: string) => void;
  advanceProgramDay: () => void;
  rollShadowExtraction: (sourceType: 'PR' | 'ProgramClear' | 'Chance') => ShadowSoldier | null;
  getShadowRoster: () => ShadowSoldier[];
  getWeeklyGateProgress: () => { completed: number; total: number; isCleared: boolean };
  
  // Active Workout Actions
  startWorkout: (programId?: string, dayName?: string) => void;
  logSet: (set: Omit<SetLog, 'completedAt' | 'setIndex'>) => void;
  removeSet: (setIndex: number) => void;
  finishWorkout: () => string; // returns sessionId
  cancelWorkout: () => void;

  // UI
  isLoading: boolean;
  setLoading: (val: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // ── User ────────────────────────────────────────────────────
  user: DEFAULT_USER,
  setUser: (user) => set({ user }),

  // ── Mode ────────────────────────────────────────────────────
  activeMode: null,
  setActiveMode: (mode) => set({ activeMode: mode }),

  // ── Quests ──────────────────────────────────────────────────
  quests: [],
  addQuest: (quest) => set((state) => ({ quests: [quest, ...state.quests] })),
  completeQuest: (id) => set((state) => ({
    quests: state.quests.map((q) => q.id === id ? { ...q, completed: true } : q),
  })),
  removeQuest: (id) => set((state) => ({ quests: state.quests.filter((q) => q.id !== id) })),

  // ── FITNESS MODE ────────────────────────────────────────────
  fitnessProfile: DEFAULT_FITNESS_PROFILE,
  sessions: [],
  personalRecords: {},
  activeSession: {
    isActive: false,
    startTime: 0,
    sets: [],
  },

  setActiveProgram: (programId) => set((state) => ({
    fitnessProfile: {
      ...state.fitnessProfile,
      activeProgramId: programId,
      currentProgramWeek: 1,
      currentProgramDayIndex: 0,
    }
  })),

  advanceProgramDay: () => set((state) => {
    return {
      fitnessProfile: {
        ...state.fitnessProfile,
        currentProgramDayIndex: state.fitnessProfile.currentProgramDayIndex + 1,
      }
    };
  }),

  rollShadowExtraction: (sourceType) => {
    const state = get();
    if (sourceType === 'PR' || sourceType === 'ProgramClear' || Math.random() < 0.15) {
      const soldier = generateShadowSoldier(state.user.rank, sourceType);
      set((prev) => ({
        fitnessProfile: {
          ...prev.fitnessProfile,
          shadowRoster: [soldier, ...(prev.fitnessProfile.shadowRoster || [])],
        },
      }));
      return soldier;
    }
    return null;
  },

  getShadowRoster: () => {
    return get().fitnessProfile.shadowRoster || [];
  },

  getWeeklyGateProgress: () => {
    const state = get();
    const activeProgram = state.fitnessProfile.activeProgramId 
      ? PROGRAM_BY_ID[state.fitnessProfile.activeProgramId] 
      : null;
    const total = activeProgram ? activeProgram.daysPerWeek : 3;
    const completed = state.fitnessProfile.currentProgramDayIndex % total;
    return {
      completed,
      total,
      isCleared: completed >= total,
    };
  },

  startWorkout: (programId, dayName) => set({
    activeSession: {
      isActive: true,
      programId,
      dayName,
      startTime: Date.now(),
      sets: [],
    }
  }),

  logSet: (setLog) => set((state) => {
    const newSet: SetLog = {
      ...setLog,
      setIndex: state.activeSession.sets.length,
      completedAt: Date.now(),
    };
    return {
      activeSession: {
        ...state.activeSession,
        sets: [...state.activeSession.sets, newSet],
      }
    };
  }),

  removeSet: (setIndex) => set((state) => {
    const updatedSets = state.activeSession.sets
      .filter((s) => s.setIndex !== setIndex)
      .map((s, i) => ({ ...s, setIndex: i })); // re-index
    return {
      activeSession: {
        ...state.activeSession,
        sets: updatedSets,
      }
    };
  }),

  finishWorkout: () => {
    const state = get();
    if (!state.activeSession.isActive) return '';

    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - state.activeSession.startTime) / 1000);
    const dateStr = new Date().toISOString();

    // 1. Calculate XP from the session
    const { statXp, totalXp, prsHit } = calculateSessionXp(
      state.activeSession.sets,
      state.personalRecords
    );

    // 2. Shadow Extraction Check
    const userRank = state.user.rank;
    let extractedShadow: ShadowSoldier | null = null;
    if (prsHit.length > 0) {
      extractedShadow = generateShadowSoldier(userRank, 'PR');
    } else if (state.activeSession.programId) {
      extractedShadow = generateShadowSoldier(userRank, 'ProgramClear');
    } else if (Math.random() < 0.15) {
      extractedShadow = generateShadowSoldier(userRank, 'Chance');
    }

    const updatedShadowRoster = extractedShadow
      ? [extractedShadow, ...(state.fitnessProfile.shadowRoster || [])]
      : (state.fitnessProfile.shadowRoster || []);

    // 3. Weekly Gate Clear Check
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

    const grandTotalXp = totalXp + bonusXp;

    // 4. Build the WorkoutSession record
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
      synced: false,
    };

    // 5. Update PRs
    const newPrs = buildUpdatedPrs(state.personalRecords, state.activeSession.sets, dateStr);

    // 6. Update Stats & XP
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

    const newRank = getRankForLevel(newLevel).rank;

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
      }
    });

    return sessionId;
  },

  cancelWorkout: () => set({
    activeSession: { isActive: false, startTime: 0, sets: [] }
  }),

  // ── UI ──────────────────────────────────────────────────────
  isLoading: false,
  setLoading: (val) => set({ isLoading: val }),
}));

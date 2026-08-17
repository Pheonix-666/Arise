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
  XP_PER_LEVEL,
  getRankForLevel
} from '../types';
import { applyStatXp, buildUpdatedPrs, calculateSessionXp, checkLevelUp } from '../utils/xpEngine';

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
    // Note: this simplistic logic just increments the day.
    // In a real app, you'd check `program.daysPerWeek` and rollover to week+1
    return {
      fitnessProfile: {
        ...state.fitnessProfile,
        currentProgramDayIndex: state.fitnessProfile.currentProgramDayIndex + 1,
      }
    };
  }),

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

    // 2. Build the WorkoutSession record
    const sessionId = `ws_${Date.now()}`;
    const newSession: WorkoutSession = {
      id: sessionId,
      date: dateStr,
      programId: state.activeSession.programId,
      programDayName: state.activeSession.dayName,
      sets: state.activeSession.sets,
      durationSeconds,
      xpEarned: statXp,
      totalXp,
      prsHit,
      synced: false,
    };

    // 3. Update PRs
    const newPrs = buildUpdatedPrs(state.personalRecords, state.activeSession.sets, dateStr);

    // 4. Update Stats & XP
    const { newStats, newProgress } = applyStatXp(
      state.fitnessProfile.stats,
      state.fitnessProfile.statXpProgress,
      statXp
    );

    const { newLevel, newXp } = checkLevelUp(
      state.user.level,
      state.user.xp,
      totalXp,
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
        totalXp: state.user.totalXp + totalXp,
        level: newLevel,
        rank: newRank,
      },
      fitnessProfile: {
        ...state.fitnessProfile,
        stats: newStats,
        statXpProgress: newProgress,
        lifetimeFitnessXp: state.fitnessProfile.lifetimeFitnessXp + totalXp,
        totalSessionsLogged: state.fitnessProfile.totalSessionsLogged + 1,
        lastSessionDate: dateStr,
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

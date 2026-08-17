import { SetLog, Stat, StatBlock, PersonalRecord, STAT_XP_PER_POINT, WorkoutSession } from '../types';
import { EXERCISE_BY_ID } from '../data/exercises';

// ── Base XP per set ──────────────────────────────────────────
const BASE_XP_STRENGTH = 10;     // per weight×rep set
const BASE_XP_CARDIO_PER_KM = 15;
const BASE_XP_CARDIO_PER_MIN = 5;
const BASE_XP_DURATION_PER_30S = 8;  // holds/mobility

// ── Intensity multiplier ─────────────────────────────────────
// Compares weight×reps against the previous best for that exercise
function getIntensityMultiplier(
  setLog: SetLog,
  prevBestWeight: number,
  prevBestReps: number
): number {
  if (!setLog.weight || !setLog.reps) return 1.0;
  const thisScore = setLog.weight * setLog.reps;
  const prevScore = prevBestWeight * prevBestReps;
  if (prevScore === 0) return 1.0;
  const ratio = thisScore / prevScore;
  if (ratio >= 1.0) return Math.min(1.5, 0.9 + ratio * 0.5);   // beating old numbers
  if (ratio >= 0.8) return 1.0;                                  // roughly the same
  return 0.7;                                                     // well below
}

// ── Per-set raw XP ────────────────────────────────────────────
function calcSetRawXp(
  setLog: SetLog,
  prevBestWeight: number,
  prevBestReps: number
): number {
  const exercise = EXERCISE_BY_ID[setLog.exerciseId];
  if (!exercise) return 0;

  const group = exercise.muscleGroup;

  if (group === 'Cardio') {
    if (setLog.distanceKm) return BASE_XP_CARDIO_PER_KM * setLog.distanceKm;
    if (setLog.durationSeconds) return BASE_XP_CARDIO_PER_MIN * (setLog.durationSeconds / 60);
    return 5;
  }

  if (group === 'Mobility' || (setLog.durationSeconds && !setLog.reps)) {
    const segments = Math.floor((setLog.durationSeconds ?? 30) / 30);
    return BASE_XP_DURATION_PER_30S * segments;
  }

  // Strength / everything else with weight × reps
  const multiplier = getIntensityMultiplier(setLog, prevBestWeight, prevBestReps);
  return BASE_XP_STRENGTH * multiplier;
}

// ── Distribute set XP across stats ────────────────────────────
function distributeStatXp(
  rawXp: number,
  exerciseId: string
): Partial<Record<Stat, number>> {
  const exercise = EXERCISE_BY_ID[exerciseId];
  if (!exercise) return {};
  const out: Partial<Record<Stat, number>> = {};
  for (const [stat, weight] of Object.entries(exercise.statWeighting)) {
    out[stat as Stat] = Math.floor(rawXp * (weight as number));
  }
  return out;
}

// ── Main session XP calculator ────────────────────────────────
export function calculateSessionXp(
  sets: SetLog[],
  personalRecords: Record<string, PersonalRecord>
): { statXp: Partial<Record<Stat, number>>; totalXp: number; prsHit: string[] } {
  const statXp: Partial<Record<Stat, number>> = {};
  let totalXp = 0;
  const prsHit: string[] = [];
  
  // Track within-session bests for PR detection
  const sessionBests: Record<string, { weight: number; reps: number }> = {};

  for (const setLog of sets) {
    const pr = personalRecords[setLog.exerciseId];
    const prevWeight = pr?.bestWeight ?? 0;
    const prevReps   = pr?.bestReps ?? 0;

    const rawXp = calcSetRawXp(setLog, prevWeight, prevReps);
    const setStatXp = distributeStatXp(rawXp, setLog.exerciseId);

    // Accumulate
    for (const [stat, xp] of Object.entries(setStatXp)) {
      statXp[stat as Stat] = (statXp[stat as Stat] ?? 0) + (xp as number);
    }
    totalXp += rawXp;

    // PR detection
    if (setLog.weight && setLog.reps) {
      const prev = sessionBests[setLog.exerciseId];
      const newScore = setLog.weight * setLog.reps;
      const prevScore = (prev?.weight ?? 0) * (prev?.reps ?? 0);
      const globalBest = prevWeight * prevReps;

      if (newScore > prevScore) {
        sessionBests[setLog.exerciseId] = { weight: setLog.weight, reps: setLog.reps };
      }
      if (newScore > globalBest && !prsHit.includes(setLog.exerciseId)) {
        prsHit.push(setLog.exerciseId);
      }
    }
  }

  return { statXp, totalXp: Math.round(totalXp), prsHit };
}

// ── Apply stat XP → stat points ──────────────────────────────
export function applyStatXp(
  current: StatBlock,
  progress: StatBlock,
  earned: Partial<Record<Stat, number>>
): { newStats: StatBlock; newProgress: StatBlock } {
  const newStats    = { ...current };
  const newProgress = { ...progress };

  for (const [statKey, xp] of Object.entries(earned)) {
    const stat = statKey as Stat;
    newProgress[stat] += xp as number;
    while (newProgress[stat] >= STAT_XP_PER_POINT) {
      newProgress[stat] -= STAT_XP_PER_POINT;
      newStats[stat]    += 1;
    }
  }

  return { newStats, newProgress };
}

// ── Level-up check ─────────────────────────────────────────
export function checkLevelUp(
  currentLevel: number,
  currentXp: number,
  xpToAdd: number,
  xpPerLevel: number
): { newLevel: number; newXp: number; levelsGained: number } {
  let xp    = currentXp + xpToAdd;
  let level = currentLevel;
  let levelsGained = 0;

  while (xp >= xpPerLevel) {
    xp -= xpPerLevel;
    level++;
    levelsGained++;
  }

  return { newLevel: level, newXp: xp, levelsGained };
}

// ── One-rep max (Epley formula) ───────────────────────────────
export function calcOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

// ── Build updated PR map after session ───────────────────────
export function buildUpdatedPrs(
  existing: Record<string, PersonalRecord>,
  sets: SetLog[],
  sessionDate: string
): Record<string, PersonalRecord> {
  const updated = { ...existing };

  for (const setLog of sets) {
    if (!setLog.weight || !setLog.reps) continue;
    const current = updated[setLog.exerciseId];
    const newScore = setLog.weight * setLog.reps;
    const oldScore = (current?.bestWeight ?? 0) * (current?.bestReps ?? 0);

    if (newScore > oldScore) {
      updated[setLog.exerciseId] = {
        exerciseId:   setLog.exerciseId,
        bestWeight:   setLog.weight,
        bestReps:     setLog.reps,
        achievedDate: sessionDate,
        oneRepMax:    calcOneRepMax(setLog.weight, setLog.reps),
      };
    }
  }

  return updated;
}

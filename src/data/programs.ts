import { Program } from '../types';

export const PROGRAMS: Program[] = [
  // ── GOBLIN TIER (Beginner) ──────────────────────────────────
  {
    id: 'full_body_3x',
    name: 'Full Body Awakening',
    tier: 'Goblin',
    difficulty: 'Beginner',
    daysPerWeek: 3,
    description:
      'A 3-day full-body protocol designed for those who have just awakened. Each session hits every major muscle group, building the foundation for rank advancement.',
    primaryStats: ['STR', 'VIT'],
    days: [
      {
        name: 'Day A — Full Body',
        exercises: [
          { exerciseId: 'squat',          sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'bench_press',    sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'barbell_row',    sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'plank',          sets: 2, reps: '60s', restSeconds: 60 },
        ],
      },
      {
        name: 'Rest Day',
        exercises: [],
        isRestDay: true,
      },
      {
        name: 'Day B — Full Body',
        exercises: [
          { exerciseId: 'squat',          sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'ohp',            sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'deadlift',       sets: 1, reps: '5', restSeconds: 240 },
          { exerciseId: 'ab_wheel',       sets: 2, reps: '8', restSeconds: 60 },
        ],
      },
      {
        name: 'Rest Day',
        exercises: [],
        isRestDay: true,
      },
      {
        name: 'Day A — Full Body (Repeat)',
        exercises: [
          { exerciseId: 'squat',          sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'bench_press',    sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'barbell_row',    sets: 3, reps: '5', restSeconds: 180 },
          { exerciseId: 'plank',          sets: 2, reps: '60s', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      { name: 'Rest Day', exercises: [], isRestDay: true },
    ],
  },
  {
    id: 'bodyweight_foundation',
    name: 'Shadow Hunter Basics',
    tier: 'Goblin',
    difficulty: 'Beginner',
    daysPerWeek: 4,
    description:
      'No equipment required. Pure bodyweight conditioning designed to forge the foundation. Ideal for hunters with no access to a gate... or a gym.',
    primaryStats: ['VIT', 'AGI'],
    days: [
      {
        name: 'Day 1 — Push',
        exercises: [
          { exerciseId: 'push_up',          sets: 4, reps: '15', restSeconds: 60 },
          { exerciseId: 'dips',             sets: 3, reps: '12', restSeconds: 90 },
          { exerciseId: 'plank',            sets: 3, reps: '45s', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 2 — Pull & Legs',
        exercises: [
          { exerciseId: 'pull_up',          sets: 4, reps: '8', restSeconds: 120 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '12 each', restSeconds: 60 },
          { exerciseId: 'burpee',           sets: 3, reps: '10', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      {
        name: 'Day 3 — Full Body Circuit',
        exercises: [
          { exerciseId: 'push_up',          sets: 3, reps: '20', restSeconds: 60 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '15 each', restSeconds: 60 },
          { exerciseId: 'pull_up',          sets: 3, reps: '8', restSeconds: 90 },
          { exerciseId: 'plank',            sets: 3, reps: '60s', restSeconds: 60 },
          { exerciseId: 'burpee',           sets: 3, reps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 4 — Cardio & Mobility',
        exercises: [
          { exerciseId: 'jump_rope',        sets: 5, reps: '60s', restSeconds: 30 },
          { exerciseId: 'hip_flexor_stretch', sets: 2, reps: '45s each', restSeconds: 30 },
          { exerciseId: 'yoga_sun_salutation', sets: 5, reps: '1 round', restSeconds: 30 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      { name: 'Rest Day', exercises: [], isRestDay: true },
    ],
  },

  // ── DUNGEON TIER (Intermediate) ────────────────────────────
  {
    id: 'ppl_6day',
    name: 'Push / Pull / Legs',
    tier: 'Dungeon',
    difficulty: 'Intermediate',
    daysPerWeek: 6,
    description:
      'The 6-day PPL split — a proven dungeon-clearing protocol for intermediate hunters. Each muscle group trained twice per week for accelerated strength and hypertrophy.',
    primaryStats: ['STR', 'VIT'],
    days: [
      {
        name: 'Day 1 — Push',
        exercises: [
          { exerciseId: 'bench_press',      sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'ohp',              sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseId: 'incline_db_press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'lateral_raise',    sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'tricep_pushdown',  sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 2 — Pull',
        exercises: [
          { exerciseId: 'deadlift',         sets: 3, reps: '5', restSeconds: 240 },
          { exerciseId: 'pull_up',          sets: 4, reps: '6-10', restSeconds: 150 },
          { exerciseId: 'barbell_row',      sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseId: 'lat_pulldown',     sets: 3, reps: '12-14', restSeconds: 90 },
          { exerciseId: 'barbell_curl',     sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 3 — Legs',
        exercises: [
          { exerciseId: 'squat',            sets: 4, reps: '6-8', restSeconds: 240 },
          { exerciseId: 'rdl',              sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'leg_press',        sets: 3, reps: '12-15', restSeconds: 120 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '12 each', restSeconds: 90 },
        ],
      },
      {
        name: 'Day 4 — Push (Volume)',
        exercises: [
          { exerciseId: 'incline_db_press', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'bench_press',      sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'cable_fly',        sets: 3, reps: '12-15', restSeconds: 90 },
          { exerciseId: 'lateral_raise',    sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'tricep_pushdown',  sets: 3, reps: '15', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 5 — Pull (Volume)',
        exercises: [
          { exerciseId: 'barbell_row',      sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'lat_pulldown',     sets: 4, reps: '12-15', restSeconds: 90 },
          { exerciseId: 'pull_up',          sets: 3, reps: '8-12', restSeconds: 120 },
          { exerciseId: 'barbell_curl',     sets: 4, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 6 — Legs (Volume)',
        exercises: [
          { exerciseId: 'leg_press',        sets: 4, reps: '15-20', restSeconds: 120 },
          { exerciseId: 'squat',            sets: 3, reps: '10-12', restSeconds: 150 },
          { exerciseId: 'rdl',              sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '15 each', restSeconds: 90 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
    ],
  },
  {
    id: 'upper_lower',
    name: 'Upper / Lower Split',
    tier: 'Dungeon',
    difficulty: 'Intermediate',
    daysPerWeek: 4,
    description:
      'Classic 4-day Upper/Lower split. Train each half of the body twice a week with a mix of strength and hypertrophy days.',
    primaryStats: ['STR', 'VIT'],
    days: [
      {
        name: 'Day 1 — Upper Strength',
        exercises: [
          { exerciseId: 'bench_press',      sets: 4, reps: '4-6', restSeconds: 210 },
          { exerciseId: 'barbell_row',      sets: 4, reps: '4-6', restSeconds: 210 },
          { exerciseId: 'ohp',              sets: 3, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'pull_up',          sets: 3, reps: '6-8', restSeconds: 150 },
          { exerciseId: 'barbell_curl',     sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'tricep_pushdown',  sets: 3, reps: '8-10', restSeconds: 90 },
        ],
      },
      {
        name: 'Day 2 — Lower Strength',
        exercises: [
          { exerciseId: 'squat',            sets: 4, reps: '4-6', restSeconds: 240 },
          { exerciseId: 'deadlift',         sets: 3, reps: '4-6', restSeconds: 240 },
          { exerciseId: 'leg_press',        sets: 3, reps: '8-12', restSeconds: 120 },
          { exerciseId: 'ab_wheel',         sets: 3, reps: '10', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      {
        name: 'Day 3 — Upper Hypertrophy',
        exercises: [
          { exerciseId: 'incline_db_press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'lat_pulldown',     sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'lateral_raise',    sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'cable_fly',        sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'barbell_curl',     sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'dips',             sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Day 4 — Lower Hypertrophy',
        exercises: [
          { exerciseId: 'rdl',              sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'leg_press',        sets: 4, reps: '15-20', restSeconds: 90 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '12 each', restSeconds: 90 },
          { exerciseId: 'plank',            sets: 3, reps: '60s', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      { name: 'Rest Day', exercises: [], isRestDay: true },
    ],
  },

  // ── GATE TIER (Advanced) ────────────────────────────────────
  {
    id: 'bro_split_5day',
    name: 'The Hunter Bro Split',
    tier: 'Gate',
    difficulty: 'Advanced',
    daysPerWeek: 5,
    description:
      'Five days. Five muscle groups. Each given full attention and annihilation. A classic for a reason — maximise hypertrophy by training each muscle group with high volume once per week.',
    primaryStats: ['STR', 'SENSE'],
    days: [
      {
        name: 'Monday — Chest',
        exercises: [
          { exerciseId: 'bench_press',      sets: 5, reps: '5-8', restSeconds: 210 },
          { exerciseId: 'incline_db_press', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseId: 'cable_fly',        sets: 4, reps: '12-15', restSeconds: 90 },
          { exerciseId: 'push_up',          sets: 3, reps: '20', restSeconds: 60 },
        ],
      },
      {
        name: 'Tuesday — Back',
        exercises: [
          { exerciseId: 'deadlift',         sets: 4, reps: '4-6', restSeconds: 240 },
          { exerciseId: 'barbell_row',      sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'pull_up',          sets: 4, reps: '8-12', restSeconds: 150 },
          { exerciseId: 'lat_pulldown',     sets: 4, reps: '12-14', restSeconds: 90 },
        ],
      },
      {
        name: 'Wednesday — Shoulders',
        exercises: [
          { exerciseId: 'ohp',              sets: 5, reps: '5-8', restSeconds: 210 },
          { exerciseId: 'lateral_raise',    sets: 5, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'tricep_pushdown',  sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
      {
        name: 'Friday — Legs',
        exercises: [
          { exerciseId: 'squat',            sets: 5, reps: '5-8', restSeconds: 240 },
          { exerciseId: 'rdl',              sets: 4, reps: '10-12', restSeconds: 150 },
          { exerciseId: 'leg_press',        sets: 4, reps: '12-15', restSeconds: 120 },
          { exerciseId: 'walking_lunge',    sets: 3, reps: '15 each', restSeconds: 90 },
        ],
      },
      {
        name: 'Saturday — Arms',
        exercises: [
          { exerciseId: 'barbell_curl',     sets: 5, reps: '8-12', restSeconds: 90 },
          { exerciseId: 'tricep_pushdown',  sets: 5, reps: '10-15', restSeconds: 90 },
          { exerciseId: 'dips',             sets: 4, reps: '10-15', restSeconds: 90 },
          { exerciseId: 'ab_wheel',         sets: 4, reps: '10-15', restSeconds: 60 },
        ],
      },
      { name: 'Rest Day', exercises: [], isRestDay: true },
    ],
  },
];

export const PROGRAM_BY_ID: Record<string, Program> = Object.fromEntries(
  PROGRAMS.map(p => [p.id, p])
);

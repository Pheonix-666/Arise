'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PROGRAMS, PROGRAM_BY_ID } from '../data/programs';
import { EXERCISES, EXERCISE_BY_ID } from '../data/exercises';
import { MuscleGroup, ProgramTier, Exercise } from '../types';
import {
  Flame,
  Swords,
  Trophy,
  History,
  BookOpen,
  Play,
  CheckCircle2,
  Layers,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';

type FitnessSubTab = 'overview' | 'programs' | 'codex' | 'prs' | 'history';

interface FitnessViewProps {
  onStartWorkout: (programId?: string, dayName?: string) => void;
  onOpenMonarch: () => void;
}

export default function FitnessView({ onStartWorkout, onOpenMonarch }: FitnessViewProps) {
  const {
    fitnessProfile,
    personalRecords,
    sessions,
    setActiveProgram,
    advanceProgramDay,
  } = useStore();

  const [activeTab, setActiveTab] = useState<FitnessSubTab>('overview');

  // Exercise Codex Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

  // Program Filters
  const [selectedTier, setSelectedTier] = useState<ProgramTier | 'All'>('All');

  // Active Program and Day
  const activeProgram = fitnessProfile.activeProgramId
    ? PROGRAM_BY_ID[fitnessProfile.activeProgramId]
    : null;

  const currentDay = activeProgram
    ? activeProgram.days[fitnessProfile.currentProgramDayIndex % activeProgram.days.length]
    : null;

  // Filtered Exercises
  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  // Filtered Programs
  const filteredPrograms = PROGRAMS.filter((p) => {
    return selectedTier === 'All' || p.tier === selectedTier;
  });

  // PRs List
  const prsList = Object.values(personalRecords).sort(
    (a, b) => new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime()
  );

  const muscleGroups: MuscleGroup[] = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Cardio',
    'Mobility',
    'Full Body',
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Subtab Navigation Bar */}
      <div className="subtab-bar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`subtab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <Swords size={14} />
          ACTIVE GATE & STATS
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`subtab-btn ${activeTab === 'programs' ? 'active' : ''}`}
        >
          <Layers size={14} />
          GATE PROTOCOLS ({PROGRAMS.length})
        </button>

        <button
          onClick={() => setActiveTab('codex')}
          className={`subtab-btn ${activeTab === 'codex' ? 'active' : ''}`}
        >
          <BookOpen size={14} />
          HUNTER CODEX ({EXERCISES.length})
        </button>

        <button
          onClick={() => setActiveTab('prs')}
          className={`subtab-btn ${activeTab === 'prs' ? 'active' : ''}`}
        >
          <Trophy size={14} />
          BOSS KILLS ({prsList.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`subtab-btn ${activeTab === 'history' ? 'active' : ''}`}
        >
          <History size={14} />
          RAID LOG ({sessions.length})
        </button>
      </div>

      {/* ──────────────── TAB 1: OVERVIEW & ACTIVE GATE ──────────────── */}
      {activeTab === 'overview' && (
        <div className="fitness-two-col">
          {/* Left Column: Hunter Stats Box */}
          <div className="cyber-panel cyber-panel-corner stats-box">
            <div className="stats-header">
              <span style={{ color: 'var(--cyan-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> HUNTER ATTRIBUTES
              </span>
              <span style={{ color: 'var(--text-muted)' }}>SYSTEM APPRAISAL</span>
            </div>

            {/* STR */}
            <div className="stat-row">
              <div className="stat-row-label">
                <span style={{ color: '#f87171' }}>STR [STRENGTH]</span>
                <span style={{ color: '#fff' }}>{fitnessProfile.stats.STR} PTS</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (fitnessProfile.statXpProgress.STR / 500) * 100)}%`,
                    backgroundColor: '#ef4444',
                  }}
                />
              </div>
              <div className="stat-row-sub">
                <span>Power Output</span>
                <span>{fitnessProfile.statXpProgress.STR} / 500 XP to next pt</span>
              </div>
            </div>

            {/* VIT */}
            <div className="stat-row">
              <div className="stat-row-label">
                <span style={{ color: '#34d399' }}>VIT [VITALITY]</span>
                <span style={{ color: '#fff' }}>{fitnessProfile.stats.VIT} PTS</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (fitnessProfile.statXpProgress.VIT / 500) * 100)}%`,
                    backgroundColor: '#10b981',
                  }}
                />
              </div>
              <div className="stat-row-sub">
                <span>Recovery & Stamina</span>
                <span>{fitnessProfile.statXpProgress.VIT} / 500 XP to next pt</span>
              </div>
            </div>

            {/* AGI */}
            <div className="stat-row">
              <div className="stat-row-label">
                <span style={{ color: '#fbbf24' }}>AGI [AGILITY]</span>
                <span style={{ color: '#fff' }}>{fitnessProfile.stats.AGI} PTS</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (fitnessProfile.statXpProgress.AGI / 500) * 100)}%`,
                    backgroundColor: '#f59e0b',
                  }}
                />
              </div>
              <div className="stat-row-sub">
                <span>Speed & Mobility</span>
                <span>{fitnessProfile.statXpProgress.AGI} / 500 XP to next pt</span>
              </div>
            </div>

            {/* SENSE */}
            <div className="stat-row">
              <div className="stat-row-label">
                <span style={{ color: '#c084fc' }}>SENSE [PERCEPTION]</span>
                <span style={{ color: '#fff' }}>{fitnessProfile.stats.SENSE} PTS</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (fitnessProfile.statXpProgress.SENSE / 500) * 100)}%`,
                    backgroundColor: '#8b5cf6',
                  }}
                />
              </div>
              <div className="stat-row-sub">
                <span>Precision & Form</span>
                <span>{fitnessProfile.statXpProgress.SENSE} / 500 XP to next pt</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="quick-stats-row">
              <div className="quick-stat-item">
                <span className="qs-label">STREAK</span>
                <span className="qs-val" style={{ color: '#fb923c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Flame size={14} /> {fitnessProfile.currentStreak}D
                </span>
              </div>

              <div className="quick-stat-item">
                <span className="qs-label">RAIDS</span>
                <span className="qs-val" style={{ color: 'var(--cyan-primary)' }}>
                  {fitnessProfile.totalSessionsLogged}
                </span>
              </div>

              <div className="quick-stat-item">
                <span className="qs-label">TOTAL XP</span>
                <span className="qs-val">
                  {Math.floor(fitnessProfile.lifetimeFitnessXp)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detected Gate & Army Box */}
          <div>
            {/* Gate Box */}
            <div className="cyber-panel cyber-panel-corner gate-box">
              {activeProgram && currentDay && !currentDay.isRestDay ? (
                <div>
                  <div className="gate-box-header">
                    <span style={{ color: 'var(--cyan-primary)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Swords size={16} /> [ DETECTED GATE: {activeProgram.tier.toUpperCase()}-TIER ]
                    </span>
                    <span className="threat-tag">
                      THREAT: {activeProgram.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="gate-title">{activeProgram.name}</h2>
                  <div className="gate-day-subtitle">
                    Week {fitnessProfile.currentProgramWeek} • {currentDay.name}
                  </div>
                  <p className="gate-desc">{activeProgram.description}</p>

                  {/* Scheduled Boss Raids */}
                  <div className="raids-preview-box">
                    <div style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      SCHEDULED BOSS RAIDS ({currentDay.exercises.length}):
                    </div>
                    <div className="raids-grid">
                      {currentDay.exercises.map((item, idx) => {
                        const ex = EXERCISE_BY_ID[item.exerciseId];
                        return (
                          <div key={idx} className="raid-item">
                            <span style={{ color: '#fff' }}>• {ex?.name || item.exerciseId}</span>
                            <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>
                              {item.sets} × {item.reps}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="gate-footer">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Weekly Gate Clearance: </span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>
                        {fitnessProfile.currentProgramDayIndex % activeProgram.daysPerWeek} / {activeProgram.daysPerWeek} Cleared
                      </span>
                    </div>

                    <button
                      onClick={() => onStartWorkout(activeProgram.id, currentDay.name)}
                      className="btn-cyber-primary"
                    >
                      <Play size={16} />
                      ENTER GATE & START PROTOCOL_
                    </button>
                  </div>
                </div>
              ) : activeProgram && currentDay && currentDay.isRestDay ? (
                <div>
                  <div className="gate-box-header">
                    <span style={{ color: 'var(--amber-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      [ RECOVERY PROTOCOL ACTIVE ]
                    </span>
                  </div>

                  <h2 className="gate-title">{activeProgram.name}</h2>
                  <div className="gate-day-subtitle" style={{ color: 'var(--text-dim)' }}>
                    Week {fitnessProfile.currentProgramWeek} • Rest Day
                  </div>
                  <p className="gate-desc">
                    Recovery protocol active. Cellular repair and stat consolidation required before the next gate raid.
                  </p>

                  <div className="gate-footer" style={{ marginTop: '20px' }}>
                    <button
                      onClick={() => advanceProgramDay()}
                      className="btn-cyber-outline"
                    >
                      SKIP REST DAY & ADVANCE_
                    </button>

                    <button
                      onClick={() => onStartWorkout(activeProgram.id, 'Freeform Protocol')}
                      className="btn-cyber-primary"
                    >
                      OVERRIDE REST & TRAIN ANYWAY
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
                    No Active Training Protocol Assigned
                  </h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                    Select a gate protocol from the catalog to commence training.
                  </p>
                  <button
                    onClick={() => setActiveTab('programs')}
                    className="btn-cyber-primary"
                  >
                    BROWSE GATE PROTOCOLS_
                  </button>
                </div>
              )}
            </div>

            {/* Shadow Army Quick Banner */}
            <div onClick={onOpenMonarch} className="shadow-quick-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '1.6rem' }}>🌑</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                    [ SHADOW ARMY ROSTER ] ({fitnessProfile.shadowRoster?.length || 0} Warriors Extracted)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Command fallen warriors extracted from gate boss kills and PR breakthroughs.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--purple-secondary)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                OPEN THRONE ROOM <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: GATE PROTOCOLS ──────────────── */}
      {activeTab === 'programs' && (
        <div>
          {/* Tier Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
            {(['All', 'Goblin', 'Dungeon', 'Gate'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`hud-icon-btn ${selectedTier === tier ? 'btn-cyber-primary' : ''}`}
                style={selectedTier === tier ? { color: '#030508' } : {}}
              >
                {tier === 'All' ? 'ALL TIERS' : `${tier.toUpperCase()} TIER`}
              </button>
            ))}
          </div>

          <div className="protocols-grid">
            {filteredPrograms.map((prog) => {
              const isActive = fitnessProfile.activeProgramId === prog.id;

              return (
                <div
                  key={prog.id}
                  className={`cyber-panel protocol-card ${isActive ? 'active-protocol' : ''}`}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="rank-badge rank-D">{prog.tier.toUpperCase()} TIER</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {prog.daysPerWeek} DAYS / WK
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{prog.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '10px 0', lineHeight: 1.5 }}>
                      {prog.description}
                    </p>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      PRIMARY STATS: {prog.primaryStats.join(', ')}
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '14px' }}>
                      {prog.days.slice(0, 3).map((d, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '4px' }}>
                          <span>• {d.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{d.isRestDay ? 'Rest' : `${d.exercises.length} raids`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveProgram(prog.id)}
                    disabled={isActive}
                    className={isActive ? 'btn-cyber-outline' : 'btn-cyber-primary'}
                    style={{ width: '100%' }}
                  >
                    {isActive ? 'CURRENT ACTIVE PROTOCOL' : 'ASSIGN THIS PROTOCOL_'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: HUNTER CODEX (EXERCISES) ──────────────── */}
      {activeTab === 'codex' && (
        <div>
          {/* Search & Muscle Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search exercise codex..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-dim)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setSelectedMuscle('All')}
                className={`hud-icon-btn ${selectedMuscle === 'All' ? 'btn-cyber-primary' : ''}`}
                style={selectedMuscle === 'All' ? { color: '#030508' } : {}}
              >
                ALL
              </button>
              {muscleGroups.map((mg) => (
                <button
                  key={mg}
                  onClick={() => setSelectedMuscle(mg)}
                  className={`hud-icon-btn ${selectedMuscle === mg ? 'btn-cyber-primary' : ''}`}
                  style={selectedMuscle === mg ? { color: '#030508' } : {}}
                >
                  {mg.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="exercises-grid">
            {filteredExercises.map((ex) => {
              const pr = personalRecords[ex.id];

              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExerciseModal(ex)}
                  className="cyber-panel exercise-card"
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--cyan-primary)' }}>{ex.muscleGroup}</span>
                      <span>{ex.equipment}</span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                      {ex.name}
                    </h4>

                    {pr && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber-gold)', marginTop: '6px' }}>
                        PR: {pr.bestWeight}kg × {pr.bestReps} reps
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>Target: {ex.defaultSets} × {ex.defaultReps}</span>
                    <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>VIEW CODEX →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exercise Detail Modal */}
          {selectedExerciseModal && (
            <div className="modal-overlay">
              <div className="cyber-panel cyber-panel-corner modal-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid var(--border-dim)' }}>
                  <div>
                    <span className="rank-badge rank-C">
                      {selectedExerciseModal.muscleGroup.toUpperCase()} // {selectedExerciseModal.difficulty.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
                      {selectedExerciseModal.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedExerciseModal(null)}
                    className="hud-icon-btn"
                  >
                    ✕
                  </button>
                </div>

                {/* Stat Matrix */}
                <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                    STAT GAIN WEIGHTING:
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {Object.entries(selectedExerciseModal.statWeighting).map(([st, wt]) => (
                      <div key={st} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{st}:</span>
                        <span style={{ color: 'var(--cyan-primary)' }}>{Math.round((wt as number) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                    COMBAT INSTRUCTIONS & FORM EXECUTION:
                  </h4>
                  <ol style={{ paddingLeft: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    {selectedExerciseModal.instructions.map((inst, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{inst}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setSelectedExerciseModal(null)}
                    className="btn-cyber-outline"
                  >
                    CLOSE CODEX
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 4: BOSS KILLS (PRS) ──────────────── */}
      {activeTab === 'prs' && (
        <div>
          <div style={{ padding: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', border: '1px solid var(--border-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
            Records of maximum human output. Each personal record surpassed slays a dungeon boss and strengthens your connection with the Shadow Realm.
          </div>

          {prsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-mono)' }}>
              <Trophy size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ color: '#fff', fontSize: '1rem' }}>NO BOSS KILLS LOGGED YET</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
                Conquer workout sessions to register your benchmark personal records.
              </p>
            </div>
          ) : (
            <div className="prs-grid">
              {prsList.map((pr) => {
                const ex = EXERCISE_BY_ID[pr.exerciseId];
                if (!ex) return null;

                return (
                  <div key={pr.exerciseId} className="cyber-panel pr-card">
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {ex.muscleGroup.toUpperCase()}
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                        {ex.name}
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        Achieved: {new Date(pr.achievedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-gold)' }}>
                        {pr.bestWeight}kg × {pr.bestReps}
                      </div>
                      {pr.oneRepMax && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Est 1RM: {pr.oneRepMax} kg
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 5: RAID LOG (HISTORY) ──────────────── */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-mono)' }}>
              <History size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ color: '#fff', fontSize: '1rem' }}>NO RAID LOGS RECORDED</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
                Complete gate raids to write your legacy in the hunter archives.
              </p>
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="cyber-panel"
                style={{ padding: '16px 20px', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>
                    {sess.programDayName || 'Freeform Protocol'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(sess.date).toLocaleDateString()} // {Math.round(sess.durationSeconds / 60)} mins
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-dim)' }}>
                  <span>Sets Logged: {sess.sets.length}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>+{sess.totalXp} XP EARNED</span>
                </div>

                {sess.prsHit.length > 0 && (
                  <div style={{ color: 'var(--amber-gold)', marginTop: '4px', fontWeight: 700 }}>
                    ★ PRs Shattered: {sess.prsHit.map((id) => EXERCISE_BY_ID[id]?.name || id).join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

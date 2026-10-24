'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { PROGRAM_BY_ID } from '@/data/programs';
import { EXERCISE_BY_ID } from '@/data/exercises';
import { systemSound } from '@/utils/sound';
import {
  Timer,
  Plus,
  Trash2,
  Flame,
  Swords,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function RaidConsole() {
  const router = useRouter();
  const {
    activeSession,
    logSet,
    removeSet,
    cancelWorkout,
    finishWorkout,
    personalRecords,
    setPendingSummary,
  } = useStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [combo, setCombo] = useState(0);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(60);
  const [isRestActive, setIsRestActive] = useState(false);

  // Redirect to /missions if no active session
  useEffect(() => {
    if (!activeSession.isActive) {
      router.replace('/missions');
    }
  }, [activeSession.isActive, router]);

  // Track session timer
  useEffect(() => {
    if (!activeSession.isActive) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession.isActive, activeSession.startTime]);

  // Track rest timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRestActive && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            systemSound.playTimerBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRestActive, restSecondsLeft]);

  if (!activeSession.isActive) {
    return null;
  }

  // Active Program and Exercises
  const program = activeSession.programId ? PROGRAM_BY_ID[activeSession.programId] : null;
  const currentDay = program?.days.find((d) => d.name === activeSession.dayName) || program?.days[0];
  const plannedExercises = currentDay?.exercises || [];

  const currentPlannedEx = plannedExercises[currentExIndex];
  const currentEx = currentPlannedEx ? EXERCISE_BY_ID[currentPlannedEx.exerciseId] : null;

  // Previous PR for ghost stats
  const ghostPr = currentEx ? personalRecords[currentEx.id] : null;

  // Filter sets logged for current exercise
  const currentExSets = activeSession.sets.filter((s) => s.exerciseId === currentEx?.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEx) return;

    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);

    if (isNaN(w) || isNaN(r) || r <= 0) {
      alert('Please enter valid numeric values for weight and reps.');
      return;
    }

    logSet({
      exerciseId: currentEx.id,
      weight: w,
      reps: r,
    });

    setCombo((c) => c + 1);

    // Trigger Rest Timer
    const rest = currentPlannedEx?.restSeconds || currentEx.restSeconds || 60;
    setRestTotalSeconds(rest);
    setRestSecondsLeft(rest);
    setIsRestActive(true);
  };

  const handleFinishRaid = () => {
    if (activeSession.sets.length === 0) {
      if (!confirm('No sets logged yet. Complete Gate Raid anyway?')) return;
    }
    const result = finishWorkout();
    setPendingSummary(result);
    router.push('/missions');
  };

  const handleCancel = () => {
    if (confirm('SYSTEM WARNING: Abort Gate Raid? All unlogged sets will be discarded.')) {
      cancelWorkout();
      router.push('/missions');
    }
  };

  return (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div className="cyber-panel cyber-panel-corner" style={{ padding: 'clamp(12px, 3.5vw, 20px)' }}>
        {/* Header Console */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--border-dim)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--crimson-accent)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--crimson-accent)', display: 'inline-block' }} />
              [ GATE RAID IN PROGRESS // COMBAT ENGAGED ]
            </div>
            <h2 style={{ fontSize: 'clamp(1.05rem, 4vw, 1.25rem)', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {program?.name || 'Tactical Protocol'} — {activeSession.dayName || 'Boss Hunt'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px 14px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cyan-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Timer size={15} />
              {formatTime(elapsedSeconds)}
            </div>

            <button
              onClick={handleCancel}
              className="hud-icon-btn hud-icon-btn-danger"
            >
              ABORT
            </button>
          </div>
        </div>

        {/* Rest Timer Box */}
        {isRestActive && (
          <div style={{ margin: '16px 0', padding: '14px 18px', borderRadius: '6px', border: '1px solid var(--purple-secondary)', background: 'rgba(139,92,246,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--purple-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                {restSecondsLeft}s
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--purple-secondary)' }}>
                  REST & RECOVERY PROTOCOL
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Stamina replenishment before engaging next set.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setRestSecondsLeft((s) => s + 30)}
                className="hud-icon-btn"
                title="Add 30 seconds"
              >
                +30s
              </button>
              <button
                onClick={() => setIsRestActive(false)}
                className="hud-icon-btn hud-icon-btn-danger"
                title="Skip Rest"
              >
                SKIP REST
              </button>
            </div>
          </div>
        )}

        {/* Planned Exercises Navigation */}
        {plannedExercises.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 12px' }}>
            <button
              onClick={() => setCurrentExIndex((i) => Math.max(0, i - 1))}
              disabled={currentExIndex === 0}
              className="hud-icon-btn"
              style={{ opacity: currentExIndex === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft size={16} /> PREV
            </button>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 800 }}>
              OBJECTIVE {currentExIndex + 1} OF {plannedExercises.length}
            </div>

            <button
              onClick={() => setCurrentExIndex((i) => Math.min(plannedExercises.length - 1, i + 1))}
              disabled={currentExIndex === plannedExercises.length - 1}
              className="hud-icon-btn"
              style={{ opacity: currentExIndex === plannedExercises.length - 1 ? 0.3 : 1 }}
            >
              NEXT <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Current Exercise Card */}
        {currentEx ? (
          <div style={{ padding: '16px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="rank-badge rank-C">
                  {currentEx.muscleGroup.toUpperCase()} // {currentEx.equipment}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  {currentEx.name}
                </h3>
              </div>

              {ghostPr && (
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--amber-gold)', fontWeight: 800 }}>
                    ★ BENCHMARK PR
                  </span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                    {ghostPr.bestWeight}kg × {ghostPr.bestReps}
                  </div>
                </div>
              )}
            </div>

            {/* Target Recommendation */}
            {currentPlannedEx && (
              <div style={{ margin: '10px 0', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                Protocol Prescription: <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>{currentPlannedEx.sets} sets × {currentPlannedEx.reps} reps</span>
                {currentPlannedEx.note && <span> — {currentPlannedEx.note}</span>}
              </div>
            )}

            {/* Set Input Form */}
            <form onSubmit={handleLogSet} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: '14px' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  LOAD (KG)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--border-dim)', borderRadius: '4px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  REPETITIONS
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--border-dim)', borderRadius: '4px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn-cyber-primary"
                style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
              >
                <Plus size={16} />
                LOG SET_
              </button>
            </form>

            {/* Logged Sets Table for this Exercise */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '8px' }}>
                <span>SETS COMPLETED FOR THIS EXERCISE ({currentExSets.length})</span>
                {combo > 1 && (
                  <span style={{ color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={13} style={{ color: '#fb923c' }} />
                    COMBO x{(1 + Math.min(combo * 0.1, 0.5)).toFixed(1)}
                  </span>
                )}
              </div>

              {currentExSets.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                  No sets logged yet for {currentEx.name}. Enter load and reps above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentExSets.map((s, idx) => (
                    <div
                      key={s.setIndex}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.65rem, 2.4vw, 0.75rem)', gap: '4px' }}
                    >
                      <span style={{ color: 'var(--cyan-primary)', fontWeight: 800, whiteSpace: 'nowrap' }}>SET {idx + 1}</span>
                      <span style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.weight ?? 0} kg × {s.reps ?? 0}</span>
                      <span style={{ color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{(s.weight || 0) * (s.reps || 0)} kg</span>
                      <button
                        onClick={() => removeSet(s.setIndex)}
                        style={{ color: 'rgba(255,100,120,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                        title="Delete Set"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Freeform Session active. Log any set above.
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-dim)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Total Sets Logged: <span style={{ color: 'var(--cyan-primary)', fontWeight: 800 }}>{activeSession.sets.length}</span>
          </div>

          <button
            onClick={handleFinishRaid}
            className="btn-cyber-crimson"
          >
            <Swords size={16} />
            CONQUER GATE & FINISH RAID
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { PROGRAM_BY_ID } from '@/data/programs';
import { EXERCISE_BY_ID } from '@/data/exercises';
import { Swords, Play } from 'lucide-react';
import ShadowBanner from './ShadowBanner';
import SummaryModal from './SummaryModal';

export default function ActiveGate() {
  const router = useRouter();
  const {
    fitnessProfile,
    startWorkout,
    advanceProgramDay,
    pendingSummary,
    setPendingSummary,
  } = useStore();

  const activeProgram = fitnessProfile.activeProgramId
    ? PROGRAM_BY_ID[fitnessProfile.activeProgramId]
    : null;

  const currentDay = activeProgram
    ? activeProgram.days[fitnessProfile.currentProgramDayIndex % activeProgram.days.length]
    : null;

  const handleStartWorkout = (programId?: string, dayName?: string) => {
    startWorkout(programId, dayName);
    router.push('/missions/raid');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Gate Box */}
      <div className="cyber-panel cyber-panel-corner gate-box" style={{ marginBottom: '16px' }}>
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
                onClick={() => handleStartWorkout(activeProgram.id, currentDay.name)}
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
                onClick={() => handleStartWorkout(activeProgram.id, 'Freeform Protocol')}
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
            <Link
              href="/missions/protocols"
              className="btn-cyber-primary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              BROWSE GATE PROTOCOLS_
            </Link>
          </div>
        )}
      </div>

      {/* Shadow Army Quick Banner */}
      <ShadowBanner />

      {/* Post-Raid Summary Modal */}
      {pendingSummary && (
        <SummaryModal
          data={pendingSummary}
          onClose={() => setPendingSummary(null)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { EXERCISES } from '@/data/exercises';
import { MuscleGroup, Exercise } from '@/types';
import { Search } from 'lucide-react';

export default function Codex() {
  const { personalRecords } = useStore();

  // Exercise Codex Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

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

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Search & Muscle Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
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
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
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
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
  );
}

'use client';

import React from 'react';
import { useStore } from '../../../store/useStore';
import { EXERCISE_BY_ID } from '../../../data/exercises';
import { Trophy } from 'lucide-react';

export default function RecordsPage() {
  const { personalRecords } = useStore();

  const prsList = Object.values(personalRecords).sort(
    (a, b) => new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime()
  );

  return (
    <div style={{ width: '100%' }}>
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
  );
}

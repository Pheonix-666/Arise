'use client';

import React from 'react';
import { useStore } from '../../../store/useStore';
import { EXERCISE_BY_ID } from '../../../data/exercises';
import { History } from 'lucide-react';

export default function LogPage() {
  const { sessions } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
  );
}

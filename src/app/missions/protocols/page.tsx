'use client';

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { PROGRAMS } from '../../../data/programs';
import { ProgramTier } from '../../../types';

export default function ProtocolsPage() {
  const { fitnessProfile, setActiveProgram } = useStore();
  const [selectedTier, setSelectedTier] = useState<ProgramTier | 'All'>('All');

  const filteredPrograms = PROGRAMS.filter((p) => {
    return selectedTier === 'All' || p.tier === selectedTier;
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Tier Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
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
  );
}

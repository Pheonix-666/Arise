'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FinishWorkoutResult, ShadowSoldier } from '../types';
import { EXERCISE_BY_ID } from '../data/exercises';
import { Trophy, Zap, Skull, ShieldCheck, ArrowRight } from 'lucide-react';

interface SummaryModalProps {
  data: FinishWorkoutResult;
  onClose: () => void;
}

export default function SummaryModal({ data, onClose }: SummaryModalProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#8b5cf6', '#ff0033', '#fbbf24'],
      });
    } catch {}
  }, []);

  return (
    <div className="modal-overlay">
      <div className="cyber-panel cyber-panel-corner modal-box">
        {/* Banner */}
        <div style={{ textAlign: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-dim)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan-primary)', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            [ SYSTEM PROTOCOL: DEBRIEFING ]
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }} className="glow-cyan">
            GATE CLEARED // VICTORY
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Dungeon raid concluded. Experience and soul extractions registered.
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          <div style={{ padding: '10px 4px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>EXP EARNED</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cyan-primary)', display: 'block', marginTop: '2px' }}>
              +{data.totalXp} XP
            </span>
          </div>

          <div style={{ padding: '10px 4px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>NEW PRS</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--amber-gold)', display: 'block', marginTop: '2px' }}>
              {data.prsHit.length}
            </span>
          </div>

          <div style={{ padding: '10px 4px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>STATUS</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
              <ShieldCheck size={14} /> CLEARED
            </span>
          </div>
        </div>

        {/* Leveled Up Notification */}
        {data.leveledUp && (
          <div style={{ padding: '10px 14px', borderRadius: '4px', background: 'rgba(0,242,255,0.15)', border: '1px solid var(--cyan-primary)', textAlign: 'center', margin: '10px 0', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan-primary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} className="glow-cyan">
              <Zap size={14} /> LEVEL UP REGISTERED! ATTRIBUTES ASCENDED!
            </span>
          </div>
        )}

        {/* PRs Hit List */}
        {data.prsHit.length > 0 && (
          <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: '4px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--amber-gold)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Trophy size={14} /> BOSS KILLS (PERSONAL RECORDS SURPASSED):
            </div>
            {data.prsHit.map((exId) => {
              const ex = EXERCISE_BY_ID[exId];
              return (
                <div key={exId} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.72rem', marginTop: '2px' }}>
                  <span>• {ex?.name || exId}</span>
                  <span style={{ color: 'var(--amber-gold)', fontWeight: 800 }}>[ LIMIT BROKEN ]</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Shadow Extraction Card */}
        {data.extractedShadow ? (
          <div className="cyber-panel arise-card" style={{ margin: '14px 0', padding: '14px 16px', borderRadius: '6px', border: '2px solid var(--purple-secondary)', background: 'rgba(139,92,246,0.16)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid rgba(139,92,246,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--purple-secondary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }} className="glow-purple">
                <Skull size={14} /> [ SHADOW EXTRACTION SUCCESSFUL ]
              </span>
              <span className={`rank-badge rank-${data.extractedShadow.tier}`}>
                {data.extractedShadow.tier}-RANK
              </span>
            </div>

            <div style={{ marginTop: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }} className="glow-purple">
                {data.extractedShadow.name}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Source: {data.extractedShadow.sourceType.toUpperCase()} // Power: {data.extractedShadow.power} CP
              </div>
              <p style={{ fontSize: '0.75rem', color: '#d8b4fe', fontStyle: 'italic', marginTop: '8px' }}>
                &ldquo;The fallen warrior&apos;s soul has submitted to your Monarch command and sworn eternal allegiance.&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div style={{ margin: '12px 0', padding: '10px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            No shadow souls extracted during this raid. Continue pushing your limits to awaken dormant shadows.
          </div>
        )}

        {/* Action Button */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-dim)' }}>
          <button
            onClick={onClose}
            className="btn-cyber-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            RETURN TO SYSTEM HUB
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

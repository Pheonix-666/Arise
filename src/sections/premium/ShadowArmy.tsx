'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { RANK_THRESHOLDS, ShadowSoldier } from '@/types';
import {
  Crown,
  Skull,
  Zap,
} from 'lucide-react';

export default function ShadowArmy() {
  const { fitnessProfile, summonAwakeningShadow } = useStore();
  const [extractedToast, setExtractedToast] = useState<ShadowSoldier | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);

  const roster = fitnessProfile.shadowRoster || [];
  const eliteCount = roster.filter((s) => s.tier === 'S' || s.tier === 'A').length;
  const totalPower = roster.reduce((sum, s) => sum + (s.power || 300), 0);

  const handleSummon = () => {
    setIsSummoning(true);
    setTimeout(() => {
      const soldier = summonAwakeningShadow();
      setExtractedToast(soldier);
      setIsSummoning(false);
    }, 800);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Monarch Throne Room Banner */}
      <div className="cyber-panel cyber-panel-corner monarch-hero">
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--purple-secondary)', boxShadow: '0 0 8px var(--purple-secondary)' }} />
            <span style={{ color: 'var(--purple-secondary)', fontWeight: 800, letterSpacing: '1px' }}>
              [ DOMAIN OF THE SHADOW MONARCH // RESTRICTED ]
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }} className="glow-purple">
            THE SHADOW THRONE
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '8px', lineHeight: 1.6 }}>
            As the Monarch of Shadows, the boundary between life and death bends to your command. Souls extracted from defeated foes transcend mortality to serve in your eternal army.
          </p>

          {/* Summoning Ritual Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleSummon}
              disabled={isSummoning}
              className="btn-cyber-crimson arise-card"
              style={{ padding: '12px 14px', fontSize: 'clamp(0.72rem, 3.2vw, 0.88rem)', width: '100%' }}
            >
              <Skull size={18} />
              {isSummoning ? 'CHANNELING MANA INTO THE VOID...' : '🌑 ARISE (일어나라) — SUMMON SHADOW_'}
            </button>
          </div>
        </div>
      </div>

      {/* Extraction Toast Notification */}
      {extractedToast && (
        <div className="cyber-panel arise-card" style={{ padding: '14px 16px', borderRadius: '6px', border: '2px solid var(--purple-secondary)', background: 'rgba(139,92,246,0.18)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.6rem' }}>⚡</span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--purple-secondary)', fontWeight: 800, display: 'block' }}>
                A NEW SHADOW SOLDIER HAS SUBMITTED!
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                {extractedToast.name} // {extractedToast.tier}-RANK // {extractedToast.power} CP
              </span>
            </div>
          </div>

          <button
            onClick={() => setExtractedToast(null)}
            className="btn-cyber-outline"
            style={{ padding: '6px 14px', fontSize: '0.75rem', width: 'auto' }}
          >
            ACKNOWLEDGE
          </button>
        </div>
      )}

      {/* Army Overview Metrics */}
      <div className="army-overview-grid">
        <div className="cyber-panel army-stat-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL SHADOW WARRIORS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', display: 'block', marginTop: '4px' }}>
            {roster.length}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan-primary)', marginTop: '2px', display: 'block' }}>
            Under Monarch Command
          </span>
        </div>

        <div className="cyber-panel army-stat-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ELITE COMMANDERS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--purple-secondary)', display: 'block', marginTop: '4px' }} className="glow-purple">
            {eliteCount}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
            S-Rank & A-Rank Guardians
          </span>
        </div>

        <div className="cyber-panel army-stat-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>COMBAT POWER (CP)</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--amber-gold)', display: 'block', marginTop: '4px' }} className="glow-gold">
            {totalPower.toLocaleString()} CP
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
            Cumulative Shadow Force
          </span>
        </div>
      </div>

      {/* Shadow Roster Cards */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: '16px' }}>
          <span style={{ color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skull size={15} style={{ color: 'var(--purple-secondary)' }} />
            EXTRACTED SHADOW SOLDIER ROSTER ({roster.length})
          </span>
          <span style={{ color: 'var(--text-muted)' }}>ACTIVE REGIMENT</span>
        </div>

        {roster.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-mono)' }}>
            <Skull size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h3 style={{ color: '#fff', fontSize: '1rem' }}>NO SHADOWS IN YOUR ROSTER</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
              Clear Gate raids, surpass Personal Records, or execute the Arise Ritual above.
            </p>
          </div>
        ) : (
          <div className="roster-grid">
            {roster.map((soldier) => (
              <div key={soldier.id} className="cyber-panel soldier-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                    {soldier.name}
                  </span>
                  <span className={`rank-badge rank-${soldier.tier}`}>
                    {soldier.tier}-RANK
                  </span>
                </div>

                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Power Rating:</span>
                    <span style={{ color: 'var(--amber-gold)', fontWeight: 800 }}>{soldier.power} CP</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Source:</span>
                    <span style={{ color: '#fff' }}>{soldier.sourceType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <span>Extracted:</span>
                    <span>{new Date(soldier.extractedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monarch Passive Privileges */}
      <div className="cyber-panel" style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Zap size={16} style={{ color: 'var(--cyan-primary)' }} />
          MONARCH PASSIVE PRIVILEGES
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'var(--cyan-primary)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              Domain of the Monarch
            </span>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}>
              All shadow soldiers fighting in your gate raids receive a +20% damage amplification aura.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'var(--purple-secondary)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              Ruler&apos;s Authority
            </span>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Psychokinetic energy increases concentration and mind-muscle control during heavy lifts.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'var(--crimson-accent)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              Shadow Exchange
            </span>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Instant stamina revitalization through temporal synchronization with your shadow army.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

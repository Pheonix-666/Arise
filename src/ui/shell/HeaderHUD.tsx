'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { RANK_THRESHOLDS, XP_PER_LEVEL } from '@/types';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

export default function HeaderHUD() {
  const pathname = usePathname();
  const { user, soundEnabled, toggleSound, resetToDefaults } = useStore();

  // Hide on full-screen raid view
  if (pathname === '/missions/raid') {
    return null;
  }

  const currentRankInfo = RANK_THRESHOLDS.find((r) => r.rank === user.rank) || RANK_THRESHOLDS[0];
  const nextRankInfo = RANK_THRESHOLDS.find((r) => r.minLevel > user.level);

  const xpPercent = Math.min(100, Math.floor((user.xp / XP_PER_LEVEL) * 100));

  const handleReset = () => {
    if (confirm('SYSTEM WARNING: Reset all hunter progression, quest logs, and workout records to factory calibration?')) {
      resetToDefaults();
    }
  };

  return (
    <header className="mobile-hud">
      {/* Top Status Indicators */}
      <div className="mobile-hud-status-row">
        <div className="hud-pulse-status">
          <span className="hud-pulse-dot" />
          <span>SYSTEM.ACTIVE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleSound}
            className="hud-icon-btn"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={12} style={{ color: 'var(--cyan-primary)' }} /> : <VolumeX size={12} />}
            <span>{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={handleReset}
            className="hud-icon-btn hud-icon-btn-danger"
            title="Reset Calibration"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Hunter Identity & Rank Crest */}
      <div className="mobile-hud-profile">
        <div className="mobile-hunter-left">
          <div className={`mobile-rank-crest rank-${user.rank}`}>
            <span className="mobile-rank-letter">{user.rank}</span>
            <span className="mobile-rank-label">RANK</span>
          </div>

          <div>
            <div className="mobile-hunter-name">
              <span>{user.displayName}</span>
              <span className="mobile-level-tag">Lv. {user.level}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginTop: '2px' }}>
              <span style={{ color: currentRankInfo.color, fontWeight: 800 }}>
                [{currentRankInfo.label.toUpperCase()}]
              </span>
              {nextRankInfo && (
                <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                  Next: Lv.{nextRankInfo.minLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EXP Progress Gauge */}
      <div className="mobile-exp-box">
        <div className="mobile-exp-labels">
          <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} style={{ color: 'var(--cyan-primary)' }} />
            EXP CALIBRATION
          </span>
          <span style={{ color: 'var(--cyan-primary)', fontWeight: 800 }}>
            {user.xp} / {XP_PER_LEVEL} ({xpPercent}%)
          </span>
        </div>
        <div className="mobile-exp-track">
          <div className="mobile-exp-fill progress-stripes" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>
    </header>
  );
}

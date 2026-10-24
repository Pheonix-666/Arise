'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Sparkles, Flame } from 'lucide-react';

export default function StatusPanel() {
  const { fitnessProfile } = useStore();

  return (
    <div style={{ width: '100%' }}>
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
    </div>
  );
}

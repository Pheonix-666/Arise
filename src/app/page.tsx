'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import { PROGRAM_BY_ID } from '../data/programs';
import { Activity, ListTodo, Swords, Crown, ChevronRight, Shield } from 'lucide-react';

export default function Home() {
  const { user, quests, fitnessProfile } = useStore();

  const activeProgram = fitnessProfile.activeProgramId
    ? PROGRAM_BY_ID[fitnessProfile.activeProgramId]
    : null;

  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const shadowCount = fitnessProfile.shadowRoster?.length || 0;

  return (
    <div style={{ width: '100%', padding: '4px 0' }}>
      {/* System Hub Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-primary)' }}>
          <Shield size={14} /> [ SYSTEM GATEWAY // COMMAND HUB ]
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px', letterSpacing: '0.5px' }}>
          HUNTER COMMAND NEXUS
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
          Select a subsystem below to inspect attributes, undertake quests, or engage dungeon gates.
        </p>
      </div>

      {/* 2x2 Hub Grid */}
      <div className="hub-grid">
        {/* Tile 1: STATUS */}
        <Link href="/profile" className="cyber-panel cyber-panel-corner hub-tile">
          <div className="hub-tile-top">
            <div className="hub-icon-wrap status-accent">
              <Activity size={20} />
            </div>
            <ChevronRight size={16} className="hub-arrow" />
          </div>
          <div className="hub-tile-body">
            <div className="hub-tile-tag">ATTRIBUTES</div>
            <h2 className="hub-tile-title">STATUS</h2>
            <div className="hub-tile-status">
              Lv. {user.level} · {user.xp} XP
            </div>
          </div>
        </Link>

        {/* Tile 2: DAILY */}
        <Link href="/daily" className="cyber-panel cyber-panel-corner hub-tile">
          <div className="hub-tile-top">
            <div className="hub-icon-wrap daily-accent">
              <ListTodo size={20} />
            </div>
            <ChevronRight size={16} className="hub-arrow" />
          </div>
          <div className="hub-tile-body">
            <div className="hub-tile-tag">ROUTINE</div>
            <h2 className="hub-tile-title">DAILY</h2>
            <div className="hub-tile-status">
              {completedQuestsCount} Cleared Today
            </div>
          </div>
        </Link>

        {/* Tile 3: MISSIONS */}
        <Link href="/missions" className="cyber-panel cyber-panel-corner hub-tile">
          <div className="hub-tile-top">
            <div className="hub-icon-wrap missions-accent">
              <Swords size={20} />
            </div>
            <ChevronRight size={16} className="hub-arrow" />
          </div>
          <div className="hub-tile-body">
            <div className="hub-tile-tag">GATE COMBAT</div>
            <h2 className="hub-tile-title">MISSIONS</h2>
            <div className="hub-tile-status" title={activeProgram?.name || 'No Protocol'}>
              {activeProgram?.name || 'No Protocol Assigned'}
            </div>
          </div>
        </Link>

        {/* Tile 4: DOMAIN */}
        <Link href="/domain" className="cyber-panel cyber-panel-corner hub-tile">
          <div className="hub-tile-top">
            <div className="hub-icon-wrap domain-accent">
              <Crown size={20} />
            </div>
            <span className="hub-tile-badge">PREMIUM · SOON</span>
          </div>
          <div className="hub-tile-body">
            <div className="hub-tile-tag">MONARCH THRONE</div>
            <h2 className="hub-tile-title">DOMAIN</h2>
            <div className="hub-tile-status">
              {shadowCount} Shadows Commanded
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { PROGRAM_BY_ID } from '@/data/programs';
import { Activity, ListTodo, Swords, Crown, Shield } from 'lucide-react';
import SectionTile from './SectionTile';

export default function MainPage() {
  const { user, quests, fitnessProfile } = useStore();

  // 1. Profile Status
  const profileStatus = `Lv ${user.level} · ${user.rank}-Rank`;

  // 2. Daily Tasks Status
  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.completed).length;
  const dailyStatus = totalQuests === 0 ? 'No tasks yet' : `${completedQuests}/${totalQuests} cleared`;

  // 3. Missions Status
  const activeProgram = fitnessProfile.activeProgramId
    ? PROGRAM_BY_ID[fitnessProfile.activeProgramId]
    : null;
  const currentDay = activeProgram
    ? activeProgram.days[fitnessProfile.currentProgramDayIndex % activeProgram.days.length]
    : null;
  const missionsStatus = activeProgram && currentDay
    ? `${activeProgram.name} · ${currentDay.name}`
    : 'Choose a gate';

  // 4. Premium Status
  const shadowCount = fitnessProfile.shadowRoster?.length || 0;
  const premiumStatus = `Shadow Army · ${shadowCount} shadows`;

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
      <div className="hub-grid" style={{ gap: '12px' }}>
        {/* Tile 1: PROFILE */}
        <SectionTile
          href="/profile"
          icon={<Activity size={20} />}
          tag="ATTRIBUTES"
          title="PROFILE"
          status={profileStatus}
          accentClass="status-accent"
        />

        {/* Tile 2: DAILY TASKS */}
        <SectionTile
          href="/daily"
          icon={<ListTodo size={20} />}
          tag="ROUTINE"
          title="DAILY TASKS"
          status={dailyStatus}
          accentClass="daily-accent"
        />

        {/* Tile 3: MISSIONS */}
        <SectionTile
          href="/missions"
          icon={<Swords size={20} />}
          tag="GATE COMBAT"
          title="MISSIONS"
          status={missionsStatus}
          accentClass="missions-accent"
        />

        {/* Tile 4: PREMIUM */}
        <SectionTile
          href="/premium"
          icon={<Crown size={20} />}
          tag="MONARCH THRONE"
          title="PREMIUM"
          status={premiumStatus}
          badge="SOON"
          accentClass="domain-accent"
        />
      </div>
    </div>
  );
}

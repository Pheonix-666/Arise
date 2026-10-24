'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { ChevronRight } from 'lucide-react';

export default function ShadowBanner() {
  const { fitnessProfile } = useStore();
  const shadowCount = fitnessProfile.shadowRoster?.length || 0;

  return (
    <Link href="/premium" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="shadow-quick-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '1.6rem' }}>🌑</div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
              [ SHADOW ARMY ROSTER ] ({shadowCount} Warriors Extracted)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Command fallen warriors extracted from gate boss kills and PR breakthroughs.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--purple-secondary)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
          OPEN THRONE ROOM <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
}

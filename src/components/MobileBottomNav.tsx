'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, ListTodo, Swords, Crown } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on full-screen active workout
  if (pathname === '/missions/raid') {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isStatusActive = pathname === '/profile';
  const isDailyActive = pathname === '/daily';
  const isMissionsActive = pathname.startsWith('/missions');
  const isDomainActive = pathname === '/domain';

  return (
    <nav className="mobile-bottom-nav" aria-label="Main Navigation">
      {/* 1. HOME */}
      <Link
        href="/"
        className={`mobile-nav-item ${isHomeActive ? 'active-nav' : ''}`}
        aria-current={isHomeActive ? 'page' : undefined}
      >
        <Home size={18} />
        <span>HOME</span>
      </Link>

      {/* 2. STATUS */}
      <Link
        href="/profile"
        className={`mobile-nav-item ${isStatusActive ? 'active-nav' : ''}`}
        aria-current={isStatusActive ? 'page' : undefined}
      >
        <Activity size={18} />
        <span>STATUS</span>
      </Link>

      {/* 3. DAILY */}
      <Link
        href="/daily"
        className={`mobile-nav-item ${isDailyActive ? 'active-nav' : ''}`}
        aria-current={isDailyActive ? 'page' : undefined}
      >
        <ListTodo size={18} />
        <span>DAILY</span>
      </Link>

      {/* 4. MISSIONS */}
      <Link
        href="/missions"
        className={`mobile-nav-item ${isMissionsActive ? 'active-nav' : ''}`}
        aria-current={isMissionsActive ? 'page' : undefined}
      >
        <Swords size={18} />
        <span>MISSIONS</span>
      </Link>

      {/* 5. DOMAIN */}
      <Link
        href="/domain"
        className={`mobile-nav-item ${isDomainActive ? 'active-nav' : ''}`}
        aria-current={isDomainActive ? 'page' : undefined}
        style={{ position: 'relative' }}
      >
        <span className="nav-badge-soon">PREM · SOON</span>
        <Crown size={18} />
        <span>DOMAIN</span>
      </Link>
    </nav>
  );
}

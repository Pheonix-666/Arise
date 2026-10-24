'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, ListTodo, Swords, Crown } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on full-screen active workout
  if (pathname === '/missions/raid') {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isProfileActive = pathname.startsWith('/profile');
  const isDailyActive = pathname.startsWith('/daily');
  const isMissionsActive = pathname.startsWith('/missions');
  const isPremiumActive = pathname.startsWith('/premium');

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

      {/* 2. PROFILE */}
      <Link
        href="/profile"
        className={`mobile-nav-item ${isProfileActive ? 'active-nav' : ''}`}
        aria-current={isProfileActive ? 'page' : undefined}
      >
        <Activity size={18} />
        <span>PROFILE</span>
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

      {/* 5. PREMIUM */}
      <Link
        href="/premium"
        className={`mobile-nav-item ${isPremiumActive ? 'active-nav' : ''}`}
        aria-current={isPremiumActive ? 'page' : undefined}
        style={{ position: 'relative' }}
      >
        <span className="nav-badge-soon">SOON</span>
        <Crown size={18} />
        <span>PREMIUM</span>
      </Link>
    </nav>
  );
}

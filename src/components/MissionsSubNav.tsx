'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Layers, BookOpen, Trophy, History } from 'lucide-react';

export default function MissionsSubNav() {
  const pathname = usePathname();

  // Hide subnav on full-screen active workout
  if (pathname === '/missions/raid') {
    return null;
  }

  const subLinks = [
    { href: '/missions', label: 'OVERVIEW', icon: Swords, exact: true },
    { href: '/missions/protocols', label: 'PROTOCOLS', icon: Layers, exact: false },
    { href: '/missions/codex', label: 'CODEX', icon: BookOpen, exact: false },
    { href: '/missions/records', label: 'RECORDS', icon: Trophy, exact: false },
    { href: '/missions/log', label: 'LOG', icon: History, exact: false },
  ];

  return (
    <div className="subtab-bar" style={{ marginBottom: '16px' }} role="navigation" aria-label="Missions Subnavigation">
      {subLinks.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`subtab-btn ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={14} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

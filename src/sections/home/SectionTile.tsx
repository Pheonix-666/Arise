'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionTileProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  status: string;
  badge?: string;
  tag?: string;
  accentClass?: string;
}

export default function SectionTile({
  href,
  icon,
  title,
  status,
  badge,
  tag,
  accentClass = '',
}: SectionTileProps) {
  return (
    <Link href={href} className="cyber-panel cyber-panel-corner hub-tile" style={{ minHeight: '120px' }}>
      <div className="hub-tile-top">
        <div className={`hub-icon-wrap ${accentClass}`}>
          {icon}
        </div>
        {badge ? (
          <span className="hub-tile-badge">{badge}</span>
        ) : (
          <ChevronRight size={16} className="hub-arrow" />
        )}
      </div>
      <div className="hub-tile-body">
        {tag && <div className="hub-tile-tag">{tag}</div>}
        <h2 className="hub-tile-title">{title}</h2>
        <div className="hub-tile-status" title={status}>
          {status}
        </div>
      </div>
    </Link>
  );
}

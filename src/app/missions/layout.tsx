'use client';

import React from 'react';
import MissionsSubNav from '../../components/MissionsSubNav';

export default function MissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <MissionsSubNav />
      {children}
    </div>
  );
}

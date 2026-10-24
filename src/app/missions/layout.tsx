import React from 'react';
import MissionsSubNav from '@/sections/missions/MissionsSubNav';

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

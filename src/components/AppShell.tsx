'use client';

import React from 'react';
import HeaderHUD from './HeaderHUD';
import MobileBottomNav from './MobileBottomNav';
import GlobalSummaryModal from './GlobalSummaryModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-app-shell">
      {/* Persistent Mobile Top Header HUD */}
      <HeaderHUD />

      {/* Main Mobile Content Area */}
      <main className="mobile-content-area">
        {children}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar (hidden on /missions/raid) */}
      <MobileBottomNav />

      {/* Global Post-Raid Summary Modal from pendingSummary */}
      <GlobalSummaryModal />
    </div>
  );
}

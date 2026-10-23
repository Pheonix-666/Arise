'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import HeaderHUD from '../components/HeaderHUD';
import MobileBottomNav from '../components/MobileBottomNav';
import FitnessView from '../components/FitnessView';
import QuestsView from '../components/QuestsView';
import MonarchView from '../components/MonarchView';
import ActiveWorkoutModal from '../components/ActiveWorkoutModal';
import SummaryModal from '../components/SummaryModal';

export default function Home() {
  const { activeMode, setActiveMode, startWorkout } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [summaryData, setSummaryData] = useState<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="mobile-app-shell" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--cyan-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <span style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>
          INITIALIZING SYSTEM PROTOCOL...
        </span>
      </div>
    );
  }

  const handleStartWorkout = (programId?: string, dayName?: string) => {
    startWorkout(programId, dayName);
  };

  const handleWorkoutFinished = (result: any) => {
    setSummaryData(result);
  };

  return (
    <div className="mobile-app-shell">
      {/* Mobile Top Header HUD */}
      <HeaderHUD />

      {/* Main Mobile Content Area */}
      <main className="mobile-content-area">
        {activeMode === 'fitness' && (
          <FitnessView
            onStartWorkout={handleStartWorkout}
            onOpenMonarch={() => setActiveMode('monarch')}
          />
        )}

        {activeMode === 'task' && <QuestsView />}

        {activeMode === 'monarch' && <MonarchView />}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Active Workout Console Overlay */}
      <ActiveWorkoutModal onFinish={handleWorkoutFinished} />

      {/* Post-Raid Summary Modal */}
      {summaryData && (
        <SummaryModal
          data={summaryData}
          onClose={() => setSummaryData(null)}
        />
      )}
    </div>
  );
}

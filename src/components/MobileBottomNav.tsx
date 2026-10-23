'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { Dumbbell, ListTodo, Crown } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeMode, setActiveMode } = useStore();

  return (
    <nav className="mobile-bottom-nav">
      <button
        onClick={() => setActiveMode('fitness')}
        className={`mobile-nav-item ${activeMode === 'fitness' ? 'active-fitness' : ''}`}
      >
        <Dumbbell size={20} />
        <span>FITNESS</span>
      </button>

      <button
        onClick={() => setActiveMode('task')}
        className={`mobile-nav-item ${activeMode === 'task' ? 'active-task' : ''}`}
      >
        <ListTodo size={20} />
        <span>DAILY QUESTS</span>
      </button>

      <button
        onClick={() => setActiveMode('monarch')}
        className={`mobile-nav-item ${activeMode === 'monarch' ? 'active-monarch' : ''}`}
      >
        <Crown size={20} />
        <span>MONARCH</span>
      </button>
    </nav>
  );
}

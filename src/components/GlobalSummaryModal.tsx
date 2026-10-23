'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import SummaryModal from './SummaryModal';

export default function GlobalSummaryModal() {
  const { pendingSummary, setPendingSummary } = useStore();

  if (!pendingSummary) return null;

  return (
    <SummaryModal
      data={pendingSummary}
      onClose={() => setPendingSummary(null)}
    />
  );
}

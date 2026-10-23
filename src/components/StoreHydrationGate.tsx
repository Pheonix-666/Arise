'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export default function StoreHydrationGate({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if hydration already completed
    if (useStore.persist?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }

    // Subscribe to hydration finish event
    const unsub = useStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    // Double check in case it completed synchronously during mounting
    if (useStore.persist?.hasHydrated?.()) {
      setHydrated(true);
    }

    return () => {
      unsub?.();
    };
  }, []);

  if (!hydrated) {
    return (
      <div
        className="mobile-app-shell"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          color: 'var(--cyan-primary)',
          minHeight: '100vh',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid var(--cyan-primary)',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
          }}
        />
        <span style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 700 }}>
          INITIALIZING SYSTEM PROTOCOL...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

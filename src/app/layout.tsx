import type { Metadata, Viewport } from 'next';
import './globals.css';
import StoreHydrationGate from '@/ui/shell/StoreHydrationGate';
import HeaderHUD from '@/ui/shell/HeaderHUD';
import BottomNav from '@/ui/shell/BottomNav';

export const metadata: Metadata = {
  title: 'ARISE // Solo Leveling Hunter System',
  description: 'Gamified physical conditioning, gate clearing, daily quests, and shadow army extraction protocol.',
  keywords: ['Solo Leveling', 'Hunter System', 'Fitness Gamification', 'Workout Tracker', 'Shadow Monarch', 'Arise'],
  authors: [{ name: 'System Architect' }],
  icons: {
    icon: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#030508',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="system-bg" />
        <div className="crt-scanlines" />
        <StoreHydrationGate>
          <div className="mobile-app-shell">
            <HeaderHUD />
            <main className="mobile-content-area">
              {children}
            </main>
            <BottomNav />
          </div>
        </StoreHydrationGate>
      </body>
    </html>
  );
}

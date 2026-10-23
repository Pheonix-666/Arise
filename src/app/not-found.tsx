import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mobile-app-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', fontFamily: 'var(--font-mono)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--crimson-accent)' }}>
        404 // GATE UNREACHABLE
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px', marginBottom: '20px' }}>
        The dimensional coordinates requested could not be located in this realm.
      </p>
      <Link href="/" className="btn-cyber-primary" style={{ width: 'auto', padding: '10px 20px' }}>
        RETURN TO SYSTEM HUB
      </Link>
    </div>
  );
}

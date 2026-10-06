import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AURA Health AI',
  description: 'Offline-first AI health early-warning and care continuity platform',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#087a4c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Quub | The Future of Work in Kerala',
  description: 'Connect with elite local talent or find your next big opportunity. Quub is the smartest way to hire and get hired across Kerala.',
  keywords: ['freelance', 'Kerala jobs', 'Kochi tech', 'Trivandrum talent', 'Quub', 'work marketplace'],
  authors: [{ name: 'Quub Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
        <FirebaseClientProvider>
          <ErrorBoundary>
            <Navbar />
            <main className="relative">{children}</main>
            <MobileNav />
            <Toaster />
          </ErrorBoundary>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

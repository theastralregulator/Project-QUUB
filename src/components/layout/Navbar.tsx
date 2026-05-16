"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-muted/20 hidden md:block">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-xl font-headline font-black italic -ml-0.5">Q</span>
          </div>
          <span className="text-2xl font-headline font-black text-[#111827] tracking-tight">Quub</span>
        </Link>

        {/* Navigation Links - Conditional or simplified for Landing */}
        {!isLandingPage && (
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-8 text-sm font-bold text-muted-foreground">
            <Link href="/work" className="hover:text-primary transition-colors">Work</Link>
            <Link href="/workers" className="hover:text-primary transition-colors">Workers</Link>
            <Link href="/messages" className="hover:text-primary transition-colors">Messages</Link>
          </nav>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-6">
          <Link href="/auth/signin" className="text-sm font-bold text-[#4B5563] hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup">
            <Button className="font-bold rounded-xl px-7 h-11 bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

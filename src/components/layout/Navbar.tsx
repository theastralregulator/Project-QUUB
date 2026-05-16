"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { Bell, MapPin, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-muted/10 hidden md:block">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-xl font-headline font-black italic -ml-0.5">Q</span>
          </div>
          <span className="text-2xl font-headline font-black text-[#111827] tracking-tight">Quub</span>
        </Link>

        {/* Dynamic Nav Content */}
        {user ? (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-2xl relative bg-muted/30 hover:bg-muted/50 w-11 h-11">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6366f1] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black">3</span>
              </Button>
              
              <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-[1.25rem] border border-muted-foreground/10 shadow-sm cursor-pointer hover:bg-muted/5 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Your Location</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#111827]">Kathmandu, Nepal</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <Link href="/auth/signin" className="text-sm font-bold text-[#4B5563] hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button className="font-bold rounded-[1.25rem] px-8 h-12 bg-[#6366f1] shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

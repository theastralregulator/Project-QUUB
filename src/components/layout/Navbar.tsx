"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, MessageSquare, User, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-headline font-extrabold text-primary tracking-tighter">Quub.</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/work" className="transition-colors hover:text-primary flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              Work
            </Link>
            <Link href="/workers" className="transition-colors hover:text-primary flex items-center gap-1">
              <Users className="w-4 h-4" />
              Workers
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-center max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search work or workers..."
              className="w-full rounded-full border bg-muted/50 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/messages" className="text-muted-foreground hover:text-primary p-2">
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link href="/auth/signin">
            <Button variant="ghost" className="font-semibold">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="font-semibold rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
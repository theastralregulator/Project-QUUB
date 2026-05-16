"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Users, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Briefcase, label: 'Work', href: '/work' },
    { icon: Users, label: 'Workers', href: '/workers' },
    { icon: MessageSquare, label: 'Chat', href: '/messages' },
    { icon: User, label: 'Profile', href: '/profile/me' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-primary/10")} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-t-full" />}
          </Link>
        );
      })}
    </nav>
  );
}
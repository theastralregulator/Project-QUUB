import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Sparkles, TrendingUp, Zap, MapPin, Star, ArrowRight, Laptop, Brush, Megaphone, Code, PenTool, Database } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const heroSrc = heroImg?.imageUrl || 'https://picsum.photos/seed/quub-hero/1200/800';
  
  const popularCategories = [
    { name: "UI/UX Design", icon: Brush, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Development", icon: Code, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Marketing", icon: Megaphone, color: "text-green-500", bg: "bg-green-50" },
    { name: "Copywriting", icon: PenTool, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Data Science", icon: Database, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Video Editing", icon: Laptop, color: "text-red-500", bg: "bg-red-50" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Badge variant="secondary" className="px-6 py-2 text-primary bg-primary/10 rounded-full border-primary/20 animate-pulse text-sm font-bold">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Smart Match is here
            </Badge>
            
            <h1 className="text-5xl md:text-8xl font-headline font-black leading-[0.9] tracking-tight">
              Find <span className="text-primary italic">Work.</span><br />
              Find <span className="text-primary italic">Workers.</span><br />
              Build Faster.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              The elite marketplace connecting world-class freelancers with ambitious employers in a mobile-first experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-xl px-12 h-16 rounded-2xl font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
              <Link href="/work" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 h-16 rounded-2xl font-bold border-2 hover:bg-primary/5 transition-all">
                  Explore Jobs
                </Button>
              </Link>
            </div>

            <div className="max-w-2xl mx-auto pt-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-6 h-6" />
                <input 
                  className="w-full h-18 rounded-3xl pl-14 pr-6 text-lg border-2 border-muted bg-white/80 backdrop-blur-xl focus:outline-none focus:border-primary/50 shadow-2xl transition-all"
                  placeholder="Search skills, projects, or people..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold">Popular Categories</h2>
              <p className="text-xl text-muted-foreground">Find the best talent across trending industries.</p>
            </div>
            <Link href="/work" className="text-primary text-lg font-bold flex items-center gap-2 hover:gap-3 transition-all hover:underline">
              View all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCategories.map((cat, i) => (
              <Card key={i} className="group hover:border-primary transition-all cursor-pointer border-muted/50 rounded-3xl overflow-hidden hover:shadow-2xl shadow-sm">
                <CardContent className="p-8 text-center space-y-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3", cat.bg)}>
                    <cat.icon className={cn("w-8 h-8", cat.color)} />
                  </div>
                  <span className="font-bold text-base block">{cat.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Hire Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-destructive/10 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-4xl font-headline font-bold">Urgent Hire</h2>
            <Badge className="bg-destructive hover:bg-destructive text-sm px-4 py-1 rounded-full animate-bounce">Hot</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all p-2 bg-white group">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1 bg-muted/30 border-none">Remote</Badge>
                    <span className="font-black text-2xl text-primary">$1,200+</span>
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">Logo & Brand Identity for Fintech</h3>
                  <p className="text-muted-foreground line-clamp-2 text-base">
                    Looking for an expert designer to create a complete visual language within 48 hours for our series A launch.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-muted text-xs font-semibold px-3 py-1 rounded-lg">Figma</Badge>
                    <Badge variant="secondary" className="bg-muted text-xs font-semibold px-3 py-1 rounded-lg">Branding</Badge>
                  </div>
                  <div className="pt-6 border-t flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      Global
                    </div>
                    <span>Posted 2h ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Quub? */}
      <section className="py-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image 
                src={heroSrc} 
                alt="Quub Platform" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                data-ai-hint="freelance workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-12">
                <div className="text-white space-y-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-2xl font-medium italic leading-relaxed">"Quub helped me find a developer for my SaaS in just 4 hours. The talent here is truly next-level."</p>
                  <p className="text-lg font-bold opacity-90">— Sarah Jenkins, Founder at Flowly</p>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <h2 className="text-5xl md:text-6xl font-headline font-bold leading-tight">Designed for the <span className="text-primary">Next Gen</span> of Work.</h2>
              <ul className="grid gap-8">
                {[
                  { title: "Mobile-First Experience", desc: "Manage projects, chat, and get paid entirely from your phone with ease.", icon: Zap },
                  { title: "Verified Elite Talent", desc: "Every worker undergoes a rigorous vetting process to ensure world-class quality.", icon: Star },
                  { title: "Smart AI Matching", desc: "Our AI finds the perfect match based on your skills and project history.", icon: Sparkles },
                  { title: "Secure Payments", desc: "Escrow protection for every milestone ensures everyone is protected.", icon: Zap }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 group">
                    <div className="shrink-0 w-16 h-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="rounded-2xl px-12 h-16 text-xl font-bold shadow-xl shadow-primary/20">Join the Community</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="space-y-6">
              <h3 className="text-4xl font-headline font-black tracking-tighter">Quub.</h3>
              <p className="text-primary-foreground/70 text-lg leading-relaxed">Empowering the world to work from anywhere with the best tools and talent.</p>
            </div>
            <div className="space-y-6 text-lg">
              <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/work" className="hover:text-accent transition-colors">Find Work</Link></li>
                <li><Link href="/workers" className="hover:text-accent transition-colors">Find Workers</Link></li>
                <li><Link href="/ai-match" className="hover:text-accent transition-colors font-bold text-accent-foreground">AI Match</Link></li>
              </ul>
            </div>
            <div className="space-y-6 text-lg">
              <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-accent transition-colors">Support</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Newsletter</h4>
              <div className="flex gap-2">
                <input className="bg-white/10 border-none text-white placeholder:text-white/40 px-6 py-3 rounded-2xl focus:outline-none flex-1 text-lg" placeholder="Email" />
                <Button variant="secondary" className="rounded-2xl h-14 px-8 font-bold">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-bold text-primary-foreground/50">
            <p>© 2024 Quub Inc. All rights reserved.</p>
            <div className="flex gap-12">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { cn } from '@/lib/utils';

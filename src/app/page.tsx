import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Sparkles, TrendingUp, Zap, MapPin, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const heroSrc = heroImg?.imageUrl || 'https://picsum.photos/seed/quub-hero/1200/800';
  
  const popularCategories = [
    "UI/UX Design", "Web Development", "Content Writing", "Video Editing", "Marketing", "SEO"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge variant="secondary" className="px-4 py-1 text-primary bg-primary/10 rounded-full border-primary/20 animate-pulse">
              <Sparkles className="w-3 h-3 mr-2" />
              New: AI-Powered Smart Match
            </Badge>
            <h1 className="text-4xl md:text-7xl font-headline font-extrabold leading-tight">
              Find <span className="text-primary italic">Work.</span><br />
              Find <span className="text-primary italic">Workers.</span><br />
              Build Faster.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              The elite marketplace connecting world-class freelancers with ambitious employers in a mobile-first, premium experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14 rounded-full font-bold shadow-lg shadow-primary/25">
                  Get Started
                </Button>
              </Link>
              <Link href="/work" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-14 rounded-full font-bold">
                  Explore Jobs
                </Button>
              </Link>
            </div>

            <div className="max-w-2xl mx-auto pt-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  className="w-full h-16 rounded-full pl-12 pr-4 text-lg border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/40 shadow-xl"
                  placeholder="Search skills, projects, or people..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Sections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline">Popular Categories</h2>
              <p className="text-muted-foreground">Find the best talent across trending industries.</p>
            </div>
            <Link href="/work" className="text-primary font-bold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((cat, i) => (
              <Card key={i} className="group hover:border-primary transition-all cursor-pointer hover:shadow-lg overflow-hidden border-muted/50">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-sm block">{cat}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Jobs Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-3xl font-headline">Urgent Hire</h2>
            <Badge className="bg-destructive hover:bg-destructive">Hot</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="rounded-2xl border-none shadow-sm hover:shadow-xl transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-xs">Remote</Badge>
                    <span className="font-bold text-primary">$1,200 - $2,500</span>
                  </div>
                  <h3 className="text-xl font-bold">Logo & Brand Identity for Fintech Startup</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Looking for an expert designer to create a complete visual language within 48 hours.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-muted text-xs">Figma</Badge>
                    <Badge variant="secondary" className="bg-muted text-xs">Branding</Badge>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
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
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src={heroSrc} 
                alt="Quub Platform" 
                fill 
                className="object-cover"
                data-ai-hint="freelance workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
                <div className="text-white space-y-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="font-medium italic">"Quub helped me find a developer for my SaaS in just 4 hours. The talent here is truly next-level."</p>
                  <p className="text-sm opacity-80">— Sarah Jenkins, Founder at Flowly</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-headline">Designed for the <span className="text-primary">Next Generation</span> of Work.</h2>
              <ul className="space-y-6">
                {[
                  { title: "Mobile-First Experience", desc: "Manage projects, chat, and get paid entirely from your phone.", icon: Zap },
                  { title: "Verified Elite Talent", desc: "Every worker undergoes a vetting process to ensure quality.", icon: Star },
                  { title: "Smart AI Matching", desc: "Our AI finds the perfect match based on your skills and history.", icon: Sparkles },
                  { title: "Secure Payments", desc: "Escrow protection for every milestone you complete.", icon: Zap }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="rounded-full px-8 h-14 font-bold">Join the Community</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-extrabold tracking-tighter">Quub.</h3>
              <p className="text-primary-foreground/60 text-sm">Empowering the world to work from anywhere with the best tools and talent.</p>
            </div>
            <div className="space-y-4 text-sm">
              <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/work" className="hover:text-accent transition-colors">Find Work</Link></li>
                <li><Link href="/workers" className="hover:text-accent transition-colors">Find Workers</Link></li>
                <li><Link href="/ai-match" className="hover:text-accent transition-colors">AI Match</Link></li>
              </ul>
            </div>
            <div className="space-y-4 text-sm">
              <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Newsletter</h4>
              <div className="flex gap-2">
                <input className="bg-white/10 border-none text-white placeholder:text-white/40 px-4 py-2 rounded-md focus:outline-none flex-1" placeholder="Your email" />
                <Button variant="secondary">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-primary-foreground/60">
            <p>© 2024 Quub Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

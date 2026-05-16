
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Users, 
  MessageSquare, 
  MapPin, 
  Bookmark,
  Star,
  Users2,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const mockups = [
    PlaceHolderImages.find(img => img.id === 'hero-mockup-1'),
    PlaceHolderImages.find(img => img.id === 'hero-mockup-2'),
  ];
  
  const avatarGroup = [
    PlaceHolderImages.find(img => img.id === 'avatar-group-1'),
    PlaceHolderImages.find(img => img.id === 'avatar-group-2'),
    PlaceHolderImages.find(img => img.id === 'avatar-group-3'),
    PlaceHolderImages.find(img => img.id === 'avatar-group-4'),
  ];

  const features = [
    {
      title: "Find Work",
      desc: "Discover real opportunities that match your skills and earn on your terms.",
      icon: Briefcase,
    },
    {
      title: "Find Workers",
      desc: "Hire trusted and skilled workers for any job, nearby or remote.",
      icon: Users,
    },
    {
      title: "Real-time Messaging",
      desc: "Chat instantly, share files, and stay updated in real-time.",
      icon: MessageSquare,
    },
    {
      title: "Nearby Opportunities",
      desc: "Find jobs and workers near you and get things done faster.",
      icon: MapPin,
    },
    {
      title: "Save & Track",
      desc: "Save jobs and workers, and easily track your recent activity.",
      icon: Bookmark,
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users2 },
    { label: "Jobs Posted", value: "25K+", icon: Briefcase },
    { label: "User Rating", value: "4.8/5", icon: Star },
    { label: "Trusted Platform", value: "100%", icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-b from-white to-[#F3F4F6]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000">
              <Badge variant="secondary" className="px-4 py-1.5 text-primary bg-primary/10 rounded-full border-primary/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                The smarter way to find & get work done
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-headline font-black leading-[1.1] tracking-tight text-[#111827]">
                Find <span className="text-primary">Work.</span><br />
                Find <span className="text-primary">Workers.</span><br />
                Build Faster.
              </h1>
              
              <p className="text-lg md:text-xl text-[#4B5563] max-w-xl font-medium leading-relaxed">
                Quub connects skilled people with real opportunities. Post jobs, find trusted workers nearby, and get things done — faster and better.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-2xl font-bold shadow-xl shadow-primary/30 gap-2 bg-primary">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-2xl font-bold border-2 hover:bg-muted/50">
                    Explore Quub
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {avatarGroup.map((avatar, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative shadow-sm">
                      <Image 
                        src={avatar?.imageUrl || ''} 
                        alt="User" 
                        fill 
                        className="object-cover"
                        data-ai-hint="human face"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-[#4B5563]">
                  Join 10,000+ people building<br />and growing with Quub 💜
                </p>
              </div>
            </div>

            <div className="relative h-[600px] hidden lg:block animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
              <div className="absolute top-0 right-0 w-[300px] h-[580px] rounded-[3rem] border-8 border-[#111827] bg-[#111827] shadow-2xl z-20 overflow-hidden transform rotate-6 translate-y-10">
                <Image src={mockups[1]?.imageUrl || ''} alt="Worker Profile" fill className="object-cover" data-ai-hint="worker profile" />
              </div>
              <div className="absolute top-10 left-10 w-[300px] h-[580px] rounded-[3rem] border-8 border-[#111827] bg-[#111827] shadow-2xl z-10 overflow-hidden transform -rotate-6">
                <Image src={mockups[0]?.imageUrl || ''} alt="Dashboard" fill className="object-cover" data-ai-hint="mobile dashboard" />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 -right-10 w-20 h-20 bg-primary/10 rounded-2xl blur-xl" />
              <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Quub? */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-headline font-black text-[#111827]">Why Choose Quub?</h2>
            <p className="text-lg text-[#6B7280] font-medium">Everything you need to connect, collaborate, and get results.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-[#111827]">{f.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center justify-center gap-4 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black leading-none">{s.value}</p>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#F3F4F6]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-sm flex flex-col lg:flex-row items-center gap-16">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-primary flex items-center justify-center shrink-0">
               <span className="text-white text-7xl md:text-9xl font-headline font-black tracking-tighter">Q.</span>
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-headline font-black text-[#111827]">About Quub</h2>
              <p className="text-lg text-[#4B5563] leading-relaxed max-w-2xl font-medium">
                Quub is a mobile-first platform that connects people who get things done with those who need things done. Whether you're looking for work or looking to hire, Quub makes it simple, fast, and reliable.
              </p>
            </div>
            <div className="bg-[#F9FAFB] p-10 rounded-[2.5rem] space-y-6 w-full lg:w-[350px]">
              <p className="text-xl font-bold text-[#111827]">Ready to get started?</p>
              <p className="text-sm text-[#6B7280] font-medium">Join Quub today and be a part of a growing community.</p>
              <Link href="/auth/signup" className="block">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-primary shadow-lg shadow-primary/20">
                  Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl font-headline font-black text-primary tracking-tighter">Quub.</span>
              </Link>
              <p className="text-[#6B7280] text-base max-w-xs font-medium">Find Work. Find Workers. Build Faster.</p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-xl w-10 h-10"><Facebook className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl w-10 h-10"><Instagram className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl w-10 h-10"><Twitter className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl w-10 h-10"><Linkedin className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl w-10 h-10"><Github className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#111827] mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
                <li><Link href="#" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link href="/jobs?tab=workers" className="hover:text-primary transition-colors">Browse Workers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111827] mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111827] mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Safety</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm font-bold text-[#9CA3AF]">
            <p>© 2025 Quub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

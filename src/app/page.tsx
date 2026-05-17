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
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
      title: "Smart Job Hub",
      desc: "Discover premium opportunities curated by AI to match your exact expertise.",
      icon: Briefcase,
    },
    {
      title: "Vetted Talent",
      desc: "Hire verified professionals across Kerala, from Kochi to Trivandrum.",
      icon: Users,
    },
    {
      title: "Enterprise Messaging",
      desc: "Secure, real-time collaboration with integrated file sharing and updates.",
      icon: MessageSquare,
    },
    {
      title: "Hyper-Local Focus",
      desc: "The only platform dedicated to the Kerala freelance economy.",
      icon: MapPin,
    },
    {
      title: "Secure Payments",
      desc: "Trust-based system ensuring you get paid for every milestone reached.",
      icon: ShieldCheck,
    }
  ];

  const stats = [
    { label: "Active Workers", value: "15k+", icon: Users },
    { label: "Jobs Completed", value: "45k+", icon: CheckCircle2 },
    { label: "Total Earnings", value: "₹5Cr+", icon: TrendingUp },
    { label: "District Coverage", value: "14", icon: Globe },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 md:pt-28 md:pb-48 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-5 py-2 text-primary bg-primary/10 rounded-full border-primary/20 text-xs font-black uppercase tracking-widest animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Now Live Across Kerala
                </Badge>
                <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.95] tracking-tighter text-[#111827]">
                  The Future of <br />
                  <span className="text-primary">Work</span> is Local.
                </h1>
                <p className="text-xl md:text-2xl text-[#4B5563] max-w-2xl font-medium leading-relaxed">
                  Quub is Kerala's elite workspace. We connect skilled professionals with ambitious projects, helping you build faster and smarter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-xl px-12 h-20 rounded-3xl font-black shadow-2xl shadow-primary/40 gap-3 bg-primary hover:scale-[1.02] active:scale-95 transition-all">
                    Get Started <ArrowRight className="w-6 h-6" />
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 h-20 rounded-3xl font-black border-2 border-muted-foreground/10 hover:bg-muted/50 transition-all">
                    Explore Hub
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-10 border-t border-muted-foreground/10">
                <div className="flex -space-x-4">
                  {avatarGroup.map((avatar, i) => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden relative shadow-xl hover:translate-y-[-4px] transition-transform">
                      <Image 
                        src={avatar?.imageUrl || ''} 
                        alt="User" 
                        fill 
                        className="object-cover"
                        data-ai-hint="human face"
                      />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white font-black text-xs shadow-xl">
                    +15k
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black text-[#111827] uppercase tracking-widest">Global Standard</p>
                  <p className="text-sm font-medium text-[#4B5563]">Join Kerala's fastest growing professional network.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[700px] hidden lg:block animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
              <div className="absolute top-0 right-0 w-[350px] h-[650px] rounded-[4rem] border-[12px] border-[#111827] bg-[#111827] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-20 overflow-hidden transform rotate-6 translate-y-12">
                <Image src={mockups[1]?.imageUrl || ''} alt="Worker Profile" fill className="object-cover" data-ai-hint="worker profile" />
              </div>
              <div className="absolute top-20 left-0 w-[350px] h-[650px] rounded-[4rem] border-[12px] border-[#111827] bg-[#111827] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-10 overflow-hidden transform -rotate-6">
                <Image src={mockups[0]?.imageUrl || ''} alt="Dashboard" fill className="object-cover" data-ai-hint="mobile dashboard" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500/10 rounded-[3rem] blur-2xl z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-24 bg-white border-y border-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-5xl font-black tracking-tighter text-[#111827]">{stat.value}</h3>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-[#F8F9FE]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Core Infrastructure</Badge>
              <h2 className="text-5xl font-black tracking-tight text-[#111827]">Built for the <br/>Modern Economy.</h2>
              <p className="text-xl text-[#6B7280] font-medium">Everything you need to hire, collaborate, and scale your operations.</p>
            </div>
            <Link href="/auth/signup">
              <Button variant="ghost" className="font-black text-primary gap-2 text-lg hover:bg-primary/5">Explore All Features <ArrowRight className="w-5 h-5" /></Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="border-none shadow-sm rounded-[3rem] bg-white group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <CardContent className="p-10 text-left space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <f.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-black text-xl text-[#111827] leading-tight">{f.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary to-[#6366f1] rounded-[4rem] p-12 lg:p-24 text-white text-center space-y-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/bg-noise/1200/800')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">Ready to join the <br /> elite workforce?</h2>
              <p className="text-xl md:text-2xl text-white/80 font-medium">Stop hunting for work. Start building your legacy on Kerala's most trusted professional platform.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 h-20 px-14 rounded-3xl font-black text-xl shadow-2xl">Create Free Account</Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 h-20 px-14 rounded-3xl font-black text-xl">Browse Openings</Button>
                </Link>
              </div>
            </div>
            
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F9FE] pt-32 pb-16 border-t border-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-20 mb-24">
            <div className="lg:col-span-5 space-y-10">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <span className="text-white text-2xl font-headline font-black italic">Q</span>
                </div>
                <span className="text-4xl font-headline font-black text-[#111827] tracking-tighter">Quub</span>
              </Link>
              <p className="text-[#6B7280] text-xl max-w-md font-medium leading-relaxed">
                Empowering the professional community of Kerala. Find work, hire talent, and build the future — together.
              </p>
              <div className="flex gap-5">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <Button key={i} variant="outline" size="icon" className="rounded-2xl w-14 h-14 border-muted-foreground/10 bg-white hover:bg-primary hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-8">
                <h4 className="font-black text-sm uppercase tracking-widest text-[#111827]">Platform</h4>
                <ul className="space-y-5 text-base font-bold text-[#6B7280]">
                  <li><Link href="/jobs" className="hover:text-primary transition-colors">Job Hub</Link></li>
                  <li><Link href="/jobs?tab=workers" className="hover:text-primary transition-colors">Browse Talent</Link></li>
                  <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                  <li><Link href="/profile/me" className="hover:text-primary transition-colors">My Profile</Link></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="font-black text-sm uppercase tracking-widest text-[#111827]">Company</h4>
                <ul className="space-y-5 text-base font-bold text-[#6B7280]">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Press Kit</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Brand Assets</Link></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="font-black text-sm uppercase tracking-widest text-[#111827]">Legal</h4>
                <ul className="space-y-5 text-base font-bold text-[#6B7280]">
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-muted-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-black text-[#9CA3AF] uppercase tracking-widest">
            <p>© 2025 Quub Technologies Pvt Ltd. All rights reserved.</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Kochi, Kerala, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

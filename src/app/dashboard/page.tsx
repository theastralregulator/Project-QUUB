
"use client"

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  MapPin, 
  User, 
  Plus, 
  Bookmark, 
  ChevronRight, 
  Clock, 
  Lightbulb,
  Zap,
  LayoutDashboard,
  Bell,
  TrendingUp,
  Navigation,
  RefreshCw,
  Flame,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';
import { collection, query, limit, orderBy, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, Cell } from 'recharts';
import { recommendRecommendations, type RecommendationOutput } from '@/ai/flows/recommendation-flow';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [location, setLocation] = useState<string>('Remote');
  const [isLocating, setIsLocating] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationOutput | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const savedLoc = typeof window !== 'undefined' ? localStorage.getItem('quub_location') : null;
    if (savedLoc) setLocation(savedLoc);
  }, []);

  const updateLocation = (newLoc: string) => {
    setLocation(newLoc);
    localStorage.setItem('quub_location', newLoc);
    toast({ title: "Location Updated", description: `Showing opportunities in ${newLoc}.` });
  };

  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast({ title: "Unsupported", description: "Geolocation is not supported by your browser." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const mockCity = "Kochi"; 
        updateLocation(mockCity);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        toast({ 
          variant: "destructive", 
          title: "Location Access Denied", 
          description: "Please enable location permissions or select manually." 
        });
      }
    );
  };

  const nearbyJobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    if (location === 'Kerala' || location === 'Remote') {
        return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(4));
    }
    return query(
      collection(db, 'jobs'), 
      where('location', '==', location), 
      limit(4)
    );
  }, [db, location]);

  const trendingJobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(5));
  }, [db]);

  const { data: nearbyJobs, loading: nearbyLoading } = useCollection(nearbyJobsQuery);
  const { data: trendingJobs } = useCollection(trendingJobsQuery);

  useEffect(() => {
    if (mounted && user && !recommendations && !isRecommending) {
      setIsRecommending(true);
      recommendRecommendations({
        userType: 'worker',
        userProfile: {
          name: user.displayName || 'User',
          bio: 'Looking for exciting projects in Kerala',
          skills: ['React', 'Next.js', 'Firebase', 'Strategy'],
          location: location,
          preferences: ['Remote', 'Full-time', 'Freelance'],
          activity: ['Recently viewed high-growth opportunities']
        }
      }).then(res => {
        setRecommendations(res);
        setIsRecommending(false);
      }).catch(() => setIsRecommending(false));
    }
  }, [mounted, user, location, recommendations, isRecommending]);

  const activityData = [
    { day: 'Mon', apps: 4 },
    { day: 'Tue', apps: 7 },
    { day: 'Wed', apps: 5 },
    { day: 'Thu', apps: 12 },
    { day: 'Fri', apps: 8 },
    { day: 'Sat', apps: 2 },
    { day: 'Sun', apps: 3 },
  ];

  const chartConfig = {
    apps: {
      label: "Applications",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 bg-[#F8F9FE]">
        <div className="w-28 h-28 bg-primary/10 rounded-[3rem] flex items-center justify-center animate-pulse">
          <Zap className="w-14 h-14 text-primary" />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-5xl font-black tracking-tighter text-[#111827]">Secure Access</h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">Sign in to access your Quub workspace and manage your professional profile.</p>
        </div>
        <Link href="/auth/signin">
          <Button className="rounded-[1.75rem] px-14 h-20 font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all bg-primary">Sign In to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleQuickApply = (job: any) => {
    if (!db || !user) return;
    const appRef = doc(collection(db, 'applications'));
    setDoc(appRef, {
      jobId: job.id,
      jobTitle: job.title,
      userId: user.uid,
      userName: user.displayName,
      status: 'pending',
      appliedAt: serverTimestamp()
    });
    toast({ title: "Application Sent!", description: `Success! You applied for ${job.title}.` });
  };

  const locations = [
    "Kerala", "Kochi", "Trivandrum", "Kozhikode", "Thrissur", "Kollam", 
    "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kottayam", 
    "Idukki", "Wayanad", "Pathanamthitta", "Kasaragod", "Tamil Nadu", 
    "Karnataka", "Maharashtra", "Delhi", "Remote"
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Workspace Live</Badge>
                  <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-[#111827]">{greeting}, {user.displayName?.split(' ')[0] || 'Member'} 👋</h1>
                <p className="text-muted-foreground font-medium text-lg">Your professional control center is active.</p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-2xl h-16 gap-3 border-muted-foreground/10 bg-white shadow-sm px-8 hover:bg-muted/5 transition-all">
                      {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5 text-primary" />}
                      <span className="font-black text-sm uppercase tracking-widest">{location}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-3xl w-64 p-2 border-muted-foreground/10 shadow-2xl overflow-hidden">
                    <ScrollArea className="h-[350px] w-full">
                      <DropdownMenuItem onClick={requestLocation} className="rounded-2xl font-black py-4 px-5 gap-3 mb-2 bg-primary/5 text-primary">
                        <Navigation className="w-5 h-5" /> Find Me (GPS)
                      </DropdownMenuItem>
                      <div className="h-px bg-muted my-2 mx-3" />
                      {locations.map(loc => (
                        <DropdownMenuItem key={loc} onClick={() => updateLocation(loc)} className={cn("rounded-2xl font-bold py-4 px-5 transition-all", location === loc ? "bg-primary text-white" : "hover:bg-muted/30")}>
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="icon" className="rounded-2xl h-16 w-16 bg-white border border-muted-foreground/10 shadow-sm text-foreground hover:bg-muted/50 relative transition-all">
                  <Bell className="w-7 h-7" />
                  <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-destructive rounded-full border-4 border-white" />
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[3.5rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white overflow-hidden relative group">
              <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="space-y-8 text-left max-w-xl">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white border-none px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-[0.25em]">Pro Status Active</Badge>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Elevate Your <br/>Expertise.</h2>
                  <p className="text-xl text-white/80 font-medium leading-relaxed">Experience Kerala's most advanced work-matching engine. Your next milestone starts here.</p>
                  <div className="flex flex-wrap gap-5">
                    <Link href="/jobs">
                      <Button className="bg-white text-primary hover:bg-white/90 rounded-3xl h-16 px-12 font-black text-lg shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">Explore Hub <ChevronRight className="w-6 h-6 ml-2" /></Button>
                    </Link>
                    <Link href="/jobs?tab=workers">
                      <Button variant="ghost" className="text-white hover:bg-white/10 rounded-3xl h-16 px-12 font-black text-lg">Hire Talent</Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:flex w-64 h-64 bg-white/10 rounded-[4rem] items-center justify-center backdrop-blur-3xl shrink-0 group-hover:scale-110 transition-transform duration-700 border border-white/20 shadow-2xl">
                  <ShieldCheck className="w-32 h-32 opacity-40 rotate-12" />
                </div>
              </CardContent>
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Active Near {location}</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {nearbyLoading ? [1, 2].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse" />) :
                    nearbyJobs?.length ? nearbyJobs.map(job => (
                      <Card key={job.id} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all border-l-8 border-l-transparent hover:border-l-primary overflow-hidden">
                        <CardContent className="p-8 flex items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center font-black text-xl text-primary">
                              {job.employerName?.[0] || 'Q'}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black text-lg line-clamp-1">{job.title}</h4>
                              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{job.budget}</p>
                            </div>
                          </div>
                          <Button size="icon" onClick={() => handleQuickApply(job)} className="rounded-2xl w-12 h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="p-12 text-center bg-white rounded-[2.5rem] border-dashed border-2 border-muted-foreground/10 space-y-4">
                        <p className="font-black text-muted-foreground/40 text-sm uppercase tracking-widest">No local hits</p>
                        <Button variant="ghost" onClick={requestLocation} className="text-primary font-black">Retry Search</Button>
                      </div>
                    )}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">AI Curated</h3>
                  </div>
                  <div className="space-y-4">
                    {isRecommending ? [1, 2].map(i => <div key={i} className="h-44 bg-white rounded-[2.5rem] animate-pulse" />) :
                    recommendations?.recommendedItems.slice(0, 2).map((rec, i) => (
                      <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all border-r-8 border-r-indigo-500/20 overflow-hidden">
                        <CardContent className="p-8 space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-primary/5 text-primary rounded-lg px-4 py-1 text-[9px] font-black uppercase tracking-widest">{rec.type}</Badge>
                            <TrendingUp className="w-4 h-4 text-muted-foreground/20" />
                          </div>
                          <h4 className="text-xl font-black line-clamp-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground font-medium line-clamp-2">{rec.description}</p>
                          <div className="flex gap-2">
                            {rec.reasons.slice(0, 1).map((r, j) => (
                              <Badge key={j} className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3">{r}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Active Jobs", value: "24k+", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
                { label: "Pro Matches", value: "850", icon: Sparkles, color: "text-orange-600 bg-orange-50" },
                { label: "Success Rate", value: "98%", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
                { label: "Elite Rating", value: "4.9", icon: Star, color: "text-blue-600 bg-blue-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white hover:shadow-lg transition-all">
                  <CardContent className="p-8 flex flex-col gap-6">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-black tracking-tighter text-[#111827]">{stat.value}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-black tracking-tight uppercase tracking-widest text-muted-foreground">Market Pulse</CardTitle>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-8 h-[280px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={activityData}>
                    <Bar dataKey="apps" radius={[10, 10, 0, 0]}>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--color-apps)' : '#F1F5F9'} />
                      ))}
                    </Bar>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} />
                    <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black tracking-tight">Global Hub</h3>
                <Link href="/jobs" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Hub</Link>
              </div>
              <div className="space-y-4">
                {trendingJobs?.map(job => (
                  <div key={job.id} className="flex items-center gap-5 p-5 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group bg-white/40 border border-transparent hover:border-muted/20 cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-muted/10 text-indigo-600 font-black text-xl">
                      {job.employerName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black truncate group-hover:text-primary transition-colors">{job.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{job.category}</p>
                        <span className="w-1 h-1 bg-muted rounded-full" />
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{job.budget}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[3rem] bg-gradient-to-br from-[#E6E9FF] to-[#F0F2FF] overflow-hidden relative">
              <CardContent className="p-12 space-y-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/5">
                    <Lightbulb className="w-8 h-8 text-[#6366f1]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-xl text-[#111827] tracking-tight">Live Strategy</h4>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Optimization Engine</p>
                  </div>
                </div>
                <p className="text-lg text-[#4B5563] font-medium leading-relaxed">
                  Verified profiles in **Kochi and Trivandrum** are currently seeing **7x higher engagement** for remote roles. Update your district profile now.
                </p>
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#111827]">
                     <span>Profile Integrity: 92%</span>
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <Progress value={92} className="h-3 bg-white rounded-full shadow-inner" />
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

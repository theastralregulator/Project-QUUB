
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
  ArrowRight
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

    // Load saved location from local storage
    const savedLoc = typeof window !== 'undefined' ? localStorage.getItem('quub_location') : null;
    if (savedLoc) setLocation(savedLoc);
  }, []);

  const updateLocation = (newLoc: string) => {
    setLocation(newLoc);
    localStorage.setItem('quub_location', newLoc);
    toast({ title: "Location Updated", description: `Now showing opportunities in ${newLoc}.` });
  };

  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast({ title: "Unsupported", description: "Geolocation is not supported by your browser." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In a real app, we'd reverse-geocode position.coords
        // For this MVP, we simulate a successful find
        const simulatedCity = "Kathmandu"; 
        updateLocation(simulatedCity);
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

  // Queries
  const nearbyJobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'jobs'), 
      where('location', '==', location), 
      limit(3)
    );
  }, [db, location]);

  const trendingJobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(3));
  }, [db]);

  const { data: nearbyJobs, loading: nearbyLoading } = useCollection(nearbyJobsQuery);
  const { data: trendingJobs } = useCollection(trendingJobsQuery);

  // AI Recommendations
  useEffect(() => {
    if (mounted && user && !recommendations && !isRecommending) {
      setIsRecommending(true);
      recommendRecommendations({
        userType: 'worker',
        userProfile: {
          name: user.displayName || 'User',
          bio: 'Looking for exciting projects',
          skills: ['React', 'Next.js', 'Firebase'],
          location: location,
          preferences: ['Remote', 'Full-time'],
          activity: ['Viewed frontend developer role']
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 bg-[#F8F9FE]">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
          <Zap className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tight">Welcome to Quub</h2>
          <p className="text-muted-foreground font-medium max-w-xs mx-auto text-lg leading-relaxed">Sign in to access your interactive workspace and find opportunities.</p>
        </div>
        <Link href="/auth/signin">
          <Button className="rounded-2xl px-12 h-16 font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">Sign In Now</Button>
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

  const handleSaveJob = (jobId: string) => {
    if (!db || !user) return;
    const saveRef = doc(db, 'users', user.uid, 'savedJobs', jobId);
    setDoc(saveRef, {
      jobId,
      savedAt: serverTimestamp()
    });
    toast({ title: "Job Saved", description: "You can find it in your profile collection." });
  };

  const popularCities = ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Remote"];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12">
      <div className="container mx-auto px-4 pt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight">{greeting}, {user.displayName?.split(' ')[0] || 'Member'} 👋</h1>
                <p className="text-muted-foreground font-medium text-lg">You have updates on your applications.</p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-2xl h-14 gap-3 border-muted-foreground/10 bg-white shadow-sm px-6">
                      {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5 text-primary" />}
                      <span className="font-black text-sm">{location}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl w-48 p-2 border-muted-foreground/10 shadow-2xl">
                    <DropdownMenuItem onClick={requestLocation} className="rounded-xl font-bold py-3 px-4 gap-2">
                      <Navigation className="w-4 h-4 text-primary" /> Use Geolocation
                    </DropdownMenuItem>
                    <div className="h-px bg-muted my-1" />
                    {popularCities.map(city => (
                      <DropdownMenuItem key={city} onClick={() => updateLocation(city)} className={cn("rounded-xl font-bold py-3 px-4", location === city && "bg-primary/5 text-primary")}>
                        {city}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="icon" className="rounded-2xl h-14 w-14 bg-white border border-muted-foreground/10 shadow-sm text-foreground hover:bg-muted/50 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white" />
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[2.5rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white overflow-hidden relative group">
              <CardContent className="p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-6 text-left max-w-lg">
                  <Badge className="bg-white/20 text-white border-none px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">Premium Access</Badge>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">Find Work. Find Workers.<br/><span className="text-indigo-200">Build Faster.</span></h2>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/jobs">
                      <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-16 px-10 font-black text-base shadow-2xl shadow-black/10 transition-all hover:scale-105">Explore Jobs <ChevronRight className="w-5 h-5 ml-2" /></Button>
                    </Link>
                    <Link href="/jobs?tab=workers">
                      <Button variant="ghost" className="text-white hover:bg-white/10 rounded-2xl h-16 px-10 font-black text-base">Find Talent</Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex w-48 h-48 bg-white/10 rounded-[3rem] items-center justify-center backdrop-blur-3xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <LayoutDashboard className="w-24 h-24 opacity-40 rotate-12" />
                </div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Find Work", icon: Briefcase, color: "bg-purple-50 text-purple-600", href: "/jobs" },
                { label: "Find Workers", icon: User, color: "bg-blue-50 text-blue-600", href: "/jobs?tab=workers" },
                { label: "Post a Job", icon: Plus, color: "bg-emerald-50 text-emerald-600", href: "/jobs/create" },
                { label: "My Profile", icon: User, color: "bg-orange-50 text-orange-600", href: "/profile/me" },
              ].map((action, i) => (
                <Link href={action.href} key={i}>
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white hover:scale-[1.02] transition-all group h-full hover:shadow-lg">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                      <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", action.color)}>
                        <action.icon className="w-8 h-8" />
                      </div>
                      <p className="font-black text-sm tracking-tight">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Nearby Opportunities</h3>
                </div>
                <Button variant="ghost" onClick={requestLocation} className="text-xs font-black text-indigo-600 gap-2 hover:bg-indigo-50 rounded-xl px-4 h-10">
                  <RefreshCw className={cn("w-4 h-4", isLocating && "animate-spin")} /> Refresh
                </Button>
              </div>
              
              <div className="grid gap-4">
                {nearbyLoading ? (
                  [1, 2].map(i => <div key={i} className="h-36 bg-white rounded-[2.5rem] animate-pulse" />)
                ) : nearbyJobs?.length ? (
                  nearbyJobs.map((job) => (
                    <Card key={job.id} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all overflow-hidden border-l-8 border-l-transparent hover:border-l-primary">
                      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 w-full">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shrink-0 font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                            {job.employerName?.[0] || 'Q'}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-black text-xl group-hover:text-primary transition-colors">{job.title}</h4>
                            <div className="flex items-center gap-5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                              <span className="text-emerald-600 font-black px-2 py-0.5 bg-emerald-50 rounded-lg">{job.budget}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Button variant="ghost" size="icon" className="rounded-[1.25rem] w-14 h-14 border border-muted/20" onClick={() => handleSaveJob(job.id)}>
                            <Bookmark className="w-6 h-6" />
                          </Button>
                          <Button onClick={() => handleQuickApply(job)} className="flex-1 md:flex-none bg-primary text-white rounded-[1.25rem] h-14 px-8 font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                            Quick Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed border-2 border-muted-foreground/10 bg-white text-center p-16 rounded-[2.5rem]">
                    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black tracking-tight">No jobs near {location}</p>
                        <p className="text-muted-foreground font-medium">Try selecting a different city or expand your search radius.</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="rounded-2xl font-black text-xs h-12 px-8 border-primary/20 text-primary">Change Location</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 shadow-2xl">
                          {popularCities.map(city => (
                            <DropdownMenuItem key={city} onClick={() => updateLocation(city)} className="rounded-xl font-bold py-3 px-4">
                              {city}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-black tracking-tight">AI Recommended for You</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {isRecommending ? (
                  [1, 2].map(i => <div key={i} className="h-56 bg-white rounded-[2.5rem] animate-pulse" />)
                ) : recommendations?.recommendedItems.slice(0, 2).map((rec, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all border-l-8 border-l-primary overflow-hidden">
                    <CardContent className="p-10 space-y-5">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/5 text-primary rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-widest">{rec.type}</Badge>
                        <TrendingUp className="w-5 h-5 text-primary opacity-20" />
                      </div>
                      <h4 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">{rec.description}</p>
                      <div className="pt-3 flex flex-wrap gap-2">
                        {rec.reasons.slice(0, 2).map((reason, j) => (
                          <Badge key={j} className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-xl">{reason}</Badge>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-4 h-12 text-[10px] font-black uppercase tracking-widest text-primary gap-2 group/btn hover:bg-primary/5">
                        Learn More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">Quick Overview</h3>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-lg">Week 12</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Jobs Applied", value: "12", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
                  { label: "Jobs Posted", value: "4", icon: Plus, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Saved Jobs", value: "28", icon: Bookmark, color: "text-orange-600 bg-orange-50" },
                  { label: "Ongoing", value: "2", icon: Zap, color: "text-blue-600 bg-blue-50" },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-8 flex flex-col gap-5">
                      <div className={cn("w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0", stat.color)}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-3xl font-black leading-none tracking-tight">{stat.value}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-xl font-black tracking-tight">Weekly Activity</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">Activity performance overview</p>
              </CardHeader>
              <CardContent className="p-10 pt-8 h-[250px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={activityData}>
                    <Bar dataKey="apps" radius={[8, 8, 0, 0]}>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--color-apps)' : '#EEF2FF'} />
                      ))}
                    </Bar>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} />
                    <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black tracking-tight">Recent Jobs</h3>
                <Link href="/jobs" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {trendingJobs?.map((job) => (
                  <Link href={`/jobs`} key={job.id}>
                    <div className="flex items-center gap-5 p-4 rounded-[2rem] hover:bg-white hover:shadow-md transition-all group bg-white/40 border border-transparent hover:border-muted/20">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-muted/10 text-indigo-600 font-black text-lg">
                        {job.employerName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-black truncate group-hover:text-primary transition-colors">{job.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{job.type}</p>
                          <span className="w-1 h-1 bg-muted rounded-full" />
                          <p className="text-[10px] text-emerald-600 font-black">{job.budget}</p>
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-muted-foreground opacity-20" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[2.5rem] bg-gradient-to-br from-[#E6E9FF] to-[#F0F2FF] overflow-hidden relative">
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/5">
                    <Lightbulb className="w-7 h-7 text-[#6366f1]" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-[#111827] tracking-tight">Pro Tip</h4>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Hireability Boost</p>
                  </div>
                </div>
                <p className="text-base text-[#4B5563] font-medium leading-relaxed">
                  Active profiles with **verified skills** receive **5x more direct offers**. Update your expertise today!
                </p>
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#111827]">
                     <span>Profile 85% Complete</span>
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <Progress value={85} className="h-2.5 bg-white rounded-full shadow-inner" />
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

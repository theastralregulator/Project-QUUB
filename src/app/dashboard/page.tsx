
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
  Loader2
} from 'lucide-react';
import { collection, query, limit, orderBy, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { recommendRecommendations, type RecommendationOutput } from '@/ai/flows/recommendation-flow';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [location, setLocation] = useState<{ city: string; coords?: any } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationOutput | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Geolocation
  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast({ title: "Unsupported", description: "Geolocation is not supported." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation({ city: "Kathmandu", coords: position.coords });
        setIsLocating(false);
        toast({ title: "Location Updated", description: "Showing jobs near Kathmandu." });
      },
      () => {
        setIsLocating(false);
        toast({ variant: "destructive", title: "Location Error", description: "Could not access location." });
      }
    );
  };

  // Queries
  const nearbyJobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'jobs'), 
      where('location', '==', location?.city || 'Remote'), 
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
          location: location?.city || 'Remote',
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black">Welcome to Quub</h2>
          <p className="text-muted-foreground font-medium">Sign in to access your interactive workspace.</p>
        </div>
        <Link href="/auth/signin">
          <Button className="rounded-2xl px-12 h-14 font-black text-lg shadow-xl shadow-primary/20">Sign In Now</Button>
        </Link>
      </div>
    );
  }

  const handleQuickApply = (jobId: string) => {
    if (!db || !user) return;
    const appRef = doc(collection(db, 'applications'));
    setDoc(appRef, {
      jobId,
      userId: user.uid,
      userName: user.displayName,
      status: 'pending',
      appliedAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Application Sent!", description: "The employer has been notified." });
    });
  };

  const handleSaveJob = (jobId: string) => {
    if (!db || !user) return;
    const saveRef = doc(db, 'users', user.uid, 'savedJobs', jobId);
    setDoc(saveRef, {
      jobId,
      savedAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Job Saved", description: "You can find it in your Saved section." });
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12">
      <div className="container mx-auto px-4 pt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight">{greeting}, {user.displayName?.split(' ')[0] || 'Sabin'} 👋</h1>
                <p className="text-muted-foreground font-medium">You have 3 new messages and 2 job updates.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={requestLocation} variant="outline" className="rounded-2xl h-12 gap-2 border-muted-foreground/10 bg-white">
                  {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-primary" />}
                  {location?.city || "Select Location"}
                </Button>
                <Button size="icon" className="rounded-2xl h-12 w-12 bg-white border border-muted-foreground/10 shadow-sm text-foreground hover:bg-muted/50 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[2.5rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white overflow-hidden relative">
              <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-6 text-left">
                  <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">Premium Workspace</Badge>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Find Work. Find Workers.<br/>Build Faster.</h2>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/jobs">
                      <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-sm shadow-xl shadow-black/10">Explore Jobs <ChevronRight className="w-4 h-4 ml-2" /></Button>
                    </Link>
                    <Link href="/jobs?tab=workers">
                      <Button variant="ghost" className="text-white hover:bg-white/10 rounded-2xl h-14 px-8 font-black text-sm">Find Talent</Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex w-40 h-40 bg-white/10 rounded-full items-center justify-center backdrop-blur-3xl shrink-0">
                  <LayoutDashboard className="w-20 h-20 opacity-40 rotate-12" />
                </div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Find Work", icon: Briefcase, color: "bg-purple-50 text-purple-600", href: "/jobs" },
                { label: "Find Workers", icon: User, color: "bg-blue-50 text-blue-600", href: "/jobs?tab=workers" },
                { label: "Post a Job", icon: Plus, color: "bg-emerald-50 text-emerald-600", href: "/jobs/create" },
                { label: "My Profile", icon: User, color: "bg-orange-50 text-orange-600", href: "/profile/me" },
              ].map((action, i) => (
                <Link href={action.href} key={i}>
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white hover:scale-[1.02] transition-all group h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", action.color)}>
                        <action.icon className="w-7 h-7" />
                      </div>
                      <p className="font-black text-sm">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#6366f1]" />
                  <h3 className="text-xl font-black tracking-tight">Nearby Opportunities</h3>
                </div>
                <Button variant="ghost" onClick={requestLocation} className="text-xs font-black text-[#6366f1] gap-2">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </Button>
              </div>
              
              <div className="grid gap-4">
                {nearbyLoading ? (
                  [1, 2].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse" />)
                ) : nearbyJobs?.length ? (
                  nearbyJobs.map((job) => (
                    <Card key={job.id} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all overflow-hidden">
                      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-sm">
                            {job.employerName?.[0] || 'Q'}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-black text-lg group-hover:text-primary transition-colors">{job.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              <span className="text-emerald-600 font-black">{job.budget}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Button variant="ghost" size="icon" className="rounded-xl shrink-0" onClick={() => handleSaveJob(job.id)}>
                            <Bookmark className="w-5 h-5" />
                          </Button>
                          <Button onClick={() => handleQuickApply(job.id)} className="flex-1 md:flex-none bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl h-11 px-8 font-black text-xs shadow-lg shadow-primary/10">
                            Quick Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed border-2 bg-white text-center p-12 rounded-[2rem]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-muted/30 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No jobs near you yet. Expand location radius 📍</p>
                      <Button onClick={requestLocation} variant="outline" className="rounded-xl font-black text-xs">Search Nearby</Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-black tracking-tight">AI Recommended for You</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {isRecommending ? (
                  [1, 2].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse" />)
                ) : recommendations?.recommendedItems.slice(0, 2).map((rec, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-lg transition-all border-l-4 border-l-primary overflow-hidden">
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/5 text-primary rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">{rec.type}</Badge>
                        <TrendingUp className="w-4 h-4 text-primary opacity-20" />
                      </div>
                      <h4 className="text-xl font-black leading-tight">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-2">{rec.description}</p>
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {rec.reasons.slice(0, 2).map((reason, j) => (
                          <Badge key={j} className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase">{reason}</Badge>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-2 text-[10px] font-black uppercase text-primary gap-1 group/btn">
                        Learn More <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
                <h3 className="text-lg font-black tracking-tight">Overview</h3>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">This Week</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Jobs Applied", value: "12", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
                  { label: "Jobs Posted", value: "4", icon: Plus, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Saved Jobs", value: "28", icon: Bookmark, color: "text-orange-600 bg-orange-50" },
                  { label: "Ongoing", value: "2", icon: Zap, color: "text-blue-600 bg-blue-50" },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.color)}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black leading-none">{stat.value}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-1">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black tracking-tight">Weekly Activity</CardTitle>
                <p className="text-xs text-muted-foreground font-medium">Your application progress</p>
              </CardHeader>
              <CardContent className="p-8 pt-6 h-[220px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={activityData}>
                    <Bar dataKey="apps" radius={[6, 6, 0, 0]}>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--color-apps)' : '#E0E7FF'} />
                      ))}
                    </Bar>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-black tracking-tight">Recently Viewed</h3>
              <div className="space-y-3">
                {trendingJobs?.map((job) => (
                  <Link href={`/jobs/${job.id}`} key={job.id}>
                    <div className="flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-white transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-muted/20 text-indigo-600 font-black">
                        {job.employerName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black truncate group-hover:text-primary">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{job.type}</p>
                      </div>
                      <Clock className="w-4 h-4 text-muted-foreground opacity-20" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-none rounded-[2.5rem] bg-gradient-to-br from-[#E6E9FF] to-[#F0F2FF] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#111827]">Tip of the day</h4>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Boost Your Hireability</p>
                  </div>
                </div>
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed">
                  Profiles with 3+ verified skills get **5x more visibility** from potential employers. Add your core technical skills now!
                </p>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                     <span>Profile 85% Complete</span>
                   </div>
                   <Progress value={85} className="h-2 bg-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

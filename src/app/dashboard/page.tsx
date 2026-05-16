"use client"

import { useUser, useFirestore, useCollection } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Star, 
  MapPin, 
  Search, 
  User, 
  Plus, 
  Bookmark, 
  ChevronRight, 
  Clock, 
  Lightbulb,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(3));
  }, [db]);

  const { data: recentJobs, loading } = useCollection(jobsQuery);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center animate-bounce">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Please sign in</h2>
          <p className="text-muted-foreground">Access your workspace and start building.</p>
        </div>
        <Link href="/auth/signin">
          <Button className="rounded-2xl px-12 h-14 font-bold text-lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  const quickActions = [
    { title: "Find Work", desc: "Browse job opportunities", icon: Briefcase, color: "bg-purple-100 text-purple-600" },
    { title: "Find Workers", desc: "Hire skilled workers", icon: User, color: "bg-blue-100 text-blue-600" },
    { title: "Post a Job", desc: "Post job and get applications", icon: Plus, color: "bg-indigo-100 text-indigo-600" },
    { title: "My Profile", desc: "View and edit profile", icon: User, color: "bg-violet-100 text-violet-600" },
  ];

  const overviewStats = [
    { label: "Jobs Applied", value: "12", icon: Briefcase, color: "bg-purple-50 text-purple-600" },
    { label: "Jobs Posted", value: "5", icon: Plus, color: "bg-green-50 text-green-600" },
    { label: "Shortlisted", value: "8", icon: Star, color: "bg-yellow-50 text-yellow-600" },
    { label: "Ongoing Jobs", value: "3", icon: Zap, color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-xl font-headline font-black italic -ml-0.5">Q</span>
            </div>
            <span className="text-2xl font-headline font-black text-[#111827] tracking-tight">Quub</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
            </Button>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-muted-foreground/10 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Kathmandu, Nepal</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Welcome Banner */}
            <Card className="border-none shadow-none overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white relative">
              <CardContent className="p-10 flex items-center justify-between">
                <div className="space-y-6 max-w-md relative z-10">
                  <h2 className="text-4xl font-black tracking-tight leading-tight">Good Morning, {user.displayName?.split(' ')[0] || 'User'} 👋</h2>
                  <p className="text-primary-foreground/90 font-medium">Find work. Find workers. Build faster with Quub.</p>
                  <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-12 px-8 font-black text-sm">
                    Explore Jobs <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="hidden md:block relative w-48 h-48">
                   <div className="absolute top-0 right-0 w-full h-full bg-white/10 rounded-full blur-3xl" />
                   {/* Placeholder for character illustration */}
                   <div className="relative z-10 w-full h-full flex items-center justify-center">
                     <LayoutDashboard className="w-32 h-32 opacity-20" />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl bg-white hover:scale-[1.02] transition-all cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", action.color)}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-sm">{action.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{action.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Nearby Opportunities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Nearby Opportunities</h3>
                <Link href="/work" className="text-xs font-bold text-primary">See all</Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-3xl animate-pulse" />)
                ) : recentJobs?.length ? (
                  recentJobs.map((job) => (
                    <Card key={job.id} className="border-none shadow-sm rounded-3xl bg-white group hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                              {job.employerName?.[0] || 'Q'}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black text-lg group-hover:text-primary transition-colors">{job.title}</h4>
                              <p className="text-xs text-muted-foreground font-medium">{job.type || 'Web Development'}</p>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span className="text-green-600 font-black">{job.budget}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 1.2 km away</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <Bookmark className="w-5 h-5 text-muted-foreground" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed border-2 bg-white text-center p-12 rounded-3xl">
                    <p className="text-muted-foreground font-medium">No nearby opportunities found.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <Card className="border-none shadow-sm rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div>
                    <h3 className="font-black text-xl">{user.displayName || 'Quuber User'}</h3>
                    <p className="text-xs font-bold text-muted-foreground">Frontend Developer</p>
                    <Badge variant="secondary" className="mt-2 bg-purple-50 text-purple-600 border-none font-bold text-[10px]">Premium Member</Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-muted/50">
                   <div className="flex items-center justify-between group cursor-pointer p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                         <Star className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase">Wallet Balance</p>
                         <p className="text-sm font-black">NPR 2,450</p>
                       </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
                   </div>
                   <div className="flex items-center justify-between group cursor-pointer p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                         <Zap className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase">Account Type</p>
                         <p className="text-sm font-black">Freelancer</p>
                       </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Overview Stats Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black">Your Overview</h3>
                <span className="text-xs font-bold text-muted-foreground">This Month</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {overviewStats.map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-3xl bg-white">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.color)}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-black">{stat.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tip of the day */}
            <Card className="border-none shadow-none rounded-[2rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-2">
                     <h4 className="font-black text-lg">Tip of the day</h4>
                     <p className="text-xs text-primary-foreground/90 leading-relaxed">Complete your profile to get more jobs and visibility.</p>
                   </div>
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <Lightbulb className="w-6 h-6" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase">
                     <span>70% Complete</span>
                   </div>
                   <Progress value={70} className="h-2 bg-white/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

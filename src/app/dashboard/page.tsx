"use client"

import { useUser, useFirestore, useCollection } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, MessageSquare, Bell, Star, TrendingUp, Zap, Clock, MoreHorizontal, Settings, HelpCircle, LogOut, Moon } from 'lucide-react';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(5));
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

  const stats = [
    { label: 'Saved Jobs', value: '12', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Proposals', value: '4', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Messages', value: '2', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Notifications', value: '8', icon: Bell, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl ring-4 ring-white shadow-xl">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
              <AvatarFallback className="bg-primary text-white font-bold text-xl">{user.displayName?.[0] || 'Q'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-headline font-black tracking-tight">Hi, {user.displayName?.split(' ')[0] || 'Quuber'}!</h1>
              <p className="text-muted-foreground font-medium">Ready to build something amazing today?</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12 border-muted shadow-sm">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
              <DropdownMenuItem className="rounded-xl h-11 gap-3 font-semibold">
                <Settings className="w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-11 gap-3 font-semibold">
                <Moon className="w-4 h-4" /> Dark Mode
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-11 gap-3 font-semibold">
                <HelpCircle className="w-4 h-4" /> Help Center
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="rounded-xl h-11 gap-3 font-semibold text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-xl rounded-3xl overflow-hidden bg-white hover:scale-[1.02] transition-transform">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Personalized for You</h2>
              <Link href="/work" className="text-primary font-bold hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse shadow-sm" />)
              ) : recentJobs?.length ? (
                recentJobs.map((job) => (
                  <Card key={job.id} className="border-none shadow-xl rounded-3xl hover:shadow-2xl transition-all group bg-white">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-black text-xl group-hover:text-primary transition-colors">{job.title}</h3>
                            {job.isUrgent && <Badge className="bg-destructive hover:bg-destructive rounded-lg font-bold">Urgent</Badge>}
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{job.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="bg-muted/50 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg border-none">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
                          <p className="text-2xl font-black text-primary">{job.budget}</p>
                          <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 uppercase">
                            <Clock className="w-3.5 h-3.5" />
                            Posted 1h ago
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed border-2 bg-transparent text-center p-16 rounded-[2.5rem]">
                  <p className="text-muted-foreground font-medium">No projects matching your profile yet.<br />Try updating your skills!</p>
                  <Button variant="outline" className="mt-6 rounded-2xl font-bold border-muted">Update Profile</Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-primary text-white p-8 overflow-hidden relative group">
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-black tracking-tight leading-none">AI Smart Match</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">Let our proprietary AI agent find the perfect high-paying projects based on your unique history.</p>
                </div>
                <Button variant="secondary" className="w-full h-14 rounded-2xl font-black text-lg group-hover:scale-105 transition-transform">
                  Scan Marketplace
                </Button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0 group-hover:bg-white/20 transition-colors" />
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 space-y-6">
              <h3 className="font-black text-xl">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-3xl border-muted hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">Post Job</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-3xl border-muted hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <Star className="w-6 h-6 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">Saved</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

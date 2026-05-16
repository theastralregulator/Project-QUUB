
"use client"

import { useUser, useFirestore, useCollection } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, MessageSquare, Bell, Star, TrendingUp, Zap, Clock } from 'lucide-react';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), limit(3));
  }, [db]);

  const { data: recentJobs, loading } = useCollection(jobsQuery);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold">Welcome back, {user.displayName || 'Quuber'}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your workspace today.</p>
          </div>
          <Link href="/profile/me">
            <Button variant="outline" className="rounded-xl font-bold">View Profile</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Saved Jobs', value: '12', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Active Proposals', value: '4', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Unread Messages', value: '2', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Notifications', value: '8', icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Activity */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommended for You</h2>
              <Link href="/work" className="text-primary text-sm font-bold hover:underline">View all</Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)
              ) : recentJobs?.length ? (
                recentJobs.map((job) => (
                  <Card key={job.id} className="border-none shadow-sm rounded-2xl hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            {job.isUrgent && <Badge className="bg-destructive">Urgent</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="bg-muted/50 font-normal text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-primary">{job.budget}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            Posted recently
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed bg-transparent text-center p-12">
                  <p className="text-muted-foreground">No jobs posted yet. Check back later!</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-primary text-white p-6 overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <Zap className="w-10 h-10 fill-white/20 text-white" />
                <h3 className="text-2xl font-headline font-bold">AI Smart Match</h3>
                <p className="text-primary-foreground/80 text-sm">Let our AI find the perfect projects based on your unique skill set and history.</p>
                <Button variant="secondary" className="w-full rounded-xl font-bold">Try Now</Button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white p-6 space-y-4">
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl border-muted">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold">Post Job</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl border-muted">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold">Saved</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';


"use client"

import { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter, 
  Plus, 
  Bookmark, 
  ChevronDown, 
  Star, 
  Briefcase,
  Users,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function JobsPage() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('works');

  // Queries
  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(15));
  }, [db]);

  const workersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('userType', 'in', ['worker', 'both']), limit(15));
  }, [db]);

  const { data: jobs, loading: jobsLoading } = useCollection(jobsQuery);
  const { data: workers, loading: workersLoading } = useCollection(workersQuery);

  const categories = ["All", "Design", "Development", "Writing", "Marketing", "Data & Analytics", "Video & Animation"];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12">
      <div className="container mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight">Job</h1>
            <p className="text-muted-foreground font-medium">Find work or find skilled workers.</p>
          </div>
          <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-[1.25rem] h-12 px-8 font-black text-sm shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Post a Job
          </Button>
        </div>

        <Tabs defaultValue="works" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList className="h-20 bg-white border p-1 rounded-[1.5rem] w-full max-w-2xl shadow-sm">
              <TabsTrigger 
                value="works" 
                className="flex-1 rounded-[1.25rem] h-full data-[state=active]:bg-[#F8F9FE] data-[state=active]:text-[#6366f1] flex flex-col gap-1 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-black">Works</span>
                </div>
                <span className="text-[10px] font-medium opacity-70">Find jobs and projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workers" 
                className="flex-1 rounded-[1.25rem] h-full data-[state=active]:bg-[#F8F9FE] data-[state=active]:text-[#6366f1] flex flex-col gap-1 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-black">Workers</span>
                </div>
                <span className="text-[10px] font-medium opacity-70">Find skilled workers</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search & Filter Header (Shared style) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 font-medium" 
                  placeholder={activeTab === 'works' ? "Search jobs by title, skill or keyword..." : "Search workers by name, skill or role..."} 
                />
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="h-14 rounded-2xl px-6 font-bold border-muted/50 gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  All Nepal <ChevronDown className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl px-6 font-bold border-muted/50 gap-2 text-[#6366f1]">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat, i) => (
                <Badge 
                  key={cat} 
                  variant={i === 0 ? "default" : "secondary"}
                  className={cn(
                    "px-6 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all",
                    i === 0 ? "bg-[#6366f1] shadow-lg shadow-primary/20" : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  {cat}
                </Badge>
              ))}
              <Button variant="ghost" className="text-xs font-black gap-1 px-4 ml-auto">
                More <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="works" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">All Jobs <span className="text-muted-foreground font-medium ml-1">({jobs?.length || 0})</span></h3>
              <Button variant="ghost" className="text-xs font-black gap-1">
                Latest <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {jobsLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[2rem] animate-pulse" />)
              ) : jobs?.map((job) => (
                <Card key={job.id} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-indigo-50 text-[#6366f1] rounded-[1.5rem] flex items-center justify-center shrink-0">
                        {job.title?.toLowerCase().includes('design') ? <LayoutGrid className="w-10 h-10" /> : <Briefcase className="w-10 h-10" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-2xl font-black group-hover:text-primary transition-colors">{job.title}</h4>
                            <p className="text-sm font-bold text-muted-foreground">{job.type || 'Web Development'}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-xl font-black text-green-600">{job.budget}</div>
                            <div className="flex items-center gap-1 justify-end text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                              <MapPin className="w-3 h-3" /> {job.location || 'Remote'}
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                          {job.description || "We are looking for a skilled professional to help us with this project. Requirements include attention to detail and ability to meet deadlines."}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-green-50 text-green-600 rounded-lg px-3 py-1 text-[10px] font-black border-none uppercase">Full-time</Badge>
                            <Badge variant="secondary" className="bg-purple-50 text-purple-600 rounded-lg px-3 py-1 text-[10px] font-black border-none uppercase">Intermediate</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">2h ago</span>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <Bookmark className="w-5 h-5 text-muted-foreground" />
                            </Button>
                            <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl px-8 font-black text-xs shadow-lg shadow-primary/10">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center pt-8">
                <Button variant="ghost" className="font-black text-[#6366f1] gap-2 hover:bg-transparent">
                  Load More Jobs <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">All Workers <span className="text-muted-foreground font-medium ml-1">({workers?.length || 0})</span></h3>
              <Button variant="ghost" className="text-xs font-black gap-1">
                Top Rated <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workersLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse" />)
              ) : workers?.map((worker) => (
                <Card key={worker.id} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <Avatar className="w-20 h-20 rounded-[1.5rem] border-4 border-muted/20">
                        <AvatarImage src={worker.avatarUrl} />
                        <AvatarFallback className="font-black text-xl">{worker.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-right">
                        <div className="text-lg font-black text-[#6366f1]">$60 - $120/hr</div>
                        <div className="flex items-center gap-1 justify-end text-sm font-bold">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {worker.rating?.toFixed(1) || '5.0'}
                          <span className="text-muted-foreground font-medium">({worker.reviewsCount || 0})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black group-hover:text-primary transition-colors">{worker.name}</h4>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{worker.role || 'Elite Professional'}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(worker.skills || ['React', 'Design', 'UI/UX']).slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-muted/30 text-[10px] font-bold rounded-lg px-2.5 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" className="flex-1 rounded-xl font-black text-xs border-muted/50 h-11">
                        View Profile
                      </Button>
                      <Button className="flex-1 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl font-black text-xs h-11 shadow-lg shadow-primary/10">
                        Hire Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

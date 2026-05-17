
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, orderBy, limit, where, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
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
  CheckCircle2,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function JobsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('works');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentLocation, setCurrentLocation] = useState('Kerala');

  useEffect(() => {
    setMounted(true);
    const savedLoc = localStorage.getItem('quub_location');
    if (savedLoc) setCurrentLocation(savedLoc);
  }, []);

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const workersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('userType', 'in', ['worker', 'both']), limit(30));
  }, [db]);

  const { data: rawJobs, loading: jobsLoading } = useCollection(jobsQuery);
  const { data: rawWorkers, loading: workersLoading } = useCollection(workersQuery);

  const keralaLocations = [
    "Kochi", "Trivandrum", "Kozhikode", "Thrissur", "Kollam", 
    "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kottayam", 
    "Idukki", "Wayanad", "Pathanamthitta", "Kasaragod", "Remote"
  ];

  const filteredJobs = useMemo(() => {
    if (!rawJobs) return [];
    return rawJobs.filter(job => {
      const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
                             job.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                             (selectedCategory === 'Remote' && job.type === 'remote');

      const matchesLocation = currentLocation === 'Kerala' || job.location === currentLocation;
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [rawJobs, searchQuery, selectedCategory, currentLocation]);

  const filteredWorkers = useMemo(() => {
    if (!rawWorkers) return [];
    return rawWorkers.filter(worker => {
      const matchesSearch = worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           worker.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLocation = currentLocation === 'Kerala' || worker.location === currentLocation;
      return matchesSearch && matchesLocation;
    });
  }, [rawWorkers, searchQuery, currentLocation]);

  const categories = ["All", "Design", "Development", "Writing", "Marketing", "Remote"];

  const handleSaveJob = (jobId: string) => {
    if (!user || !db) {
      toast({ title: "Auth Required", description: "Please sign in to save jobs." });
      return;
    }
    const saveRef = doc(db, 'users', user.uid, 'savedJobs', jobId);
    setDoc(saveRef, { jobId, savedAt: serverTimestamp() });
    toast({ title: "Saved!", description: "Job added to your collection." });
  };

  const handleApply = async (job: any) => {
    if (!user || !db) {
      toast({ title: "Auth Required", description: "Please sign in to apply." });
      return;
    }
    try {
      await addDoc(collection(db, 'applications'), {
        jobId: job.id,
        jobTitle: job.title,
        userId: user.uid,
        userName: user.displayName,
        appliedAt: serverTimestamp(),
        status: 'pending'
      });
      toast({ title: "Application Sent!", description: `You've applied for ${job.title}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to submit application." });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-[#111827]">Job Hub</h1>
            <p className="text-lg text-muted-foreground font-medium">Discover elite opportunities or hire world-class talent in {currentLocation}.</p>
          </div>
          <Link href="/jobs/create">
            <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-2xl h-14 px-8 font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              <Plus className="w-5 h-5 mr-2" /> Post a Job
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="h-20 bg-white border p-1.5 rounded-[2rem] w-full max-w-2xl shadow-sm">
              <TabsTrigger value="works" className="flex-1 rounded-[1.75rem] h-full data-[state=active]:bg-[#F8F9FE] data-[state=active]:text-[#6366f1] flex flex-col gap-1 transition-all">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-black text-base">Works</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Find Gigs</span>
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex-1 rounded-[1.75rem] h-full data-[state=active]:bg-[#F8F9FE] data-[state=active]:text-[#6366f1] flex flex-col gap-1 transition-all">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-black text-base">Workers</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Find Talent</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-14 h-16 rounded-2xl bg-muted/20 border-none focus-visible:ring-primary/20 font-bold text-lg placeholder:text-muted-foreground/50" placeholder={activeTab === 'works' ? "Search jobs, skills, companies..." : "Search names, expertise, tags..."} />
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-16 rounded-2xl px-8 font-black border-muted-foreground/10 bg-white gap-3 text-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                      {currentLocation} <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl w-56 p-0 shadow-2xl overflow-hidden">
                    <ScrollArea className="h-[300px] w-full p-2">
                      <DropdownMenuItem onClick={() => setCurrentLocation('Kerala')} className="rounded-xl font-bold py-3 px-4">
                        All Kerala
                      </DropdownMenuItem>
                      <div className="h-px bg-muted my-1" />
                      {keralaLocations.map(city => (
                        <DropdownMenuItem key={city} onClick={() => setCurrentLocation(city)} className={cn("rounded-xl font-bold py-3 px-4", currentLocation === city && "bg-primary/5 text-primary")}>
                          {city}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="h-16 rounded-2xl px-6 font-black border-muted-foreground/10 bg-white text-[#6366f1] shadow-sm">
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat) => (
                <Badge key={cat} onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? "default" : "secondary"} className={cn("px-8 py-3 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border-none", selectedCategory === cat ? "bg-[#6366f1] shadow-lg shadow-primary/20 scale-105" : "bg-muted/30 hover:bg-muted/50 text-muted-foreground")}>
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <TabsContent value="works" className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black tracking-tight">Active Jobs <span className="text-muted-foreground font-medium ml-2 text-lg">({filteredJobs.length})</span></h3>
            </div>
            <div className="grid gap-6">
              {jobsLoading ? [1, 2, 3].map(i => <div key={i} className="h-44 bg-white rounded-[2.5rem] animate-pulse" />) : filteredJobs.length ? filteredJobs.map((job) => (
                <Card key={job.id} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all overflow-hidden border-l-8 border-l-transparent hover:border-l-primary">
                  <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-10">
                      <div className="w-24 h-24 bg-indigo-50 text-[#6366f1] rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        {job.category === 'Design' ? <LayoutGrid className="w-12 h-12" /> : <Briefcase className="w-12 h-12" />}
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="space-y-2">
                            <h4 className="text-3xl font-black leading-tight group-hover:text-primary transition-colors">{job.title}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                              <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">{job.category || 'Development'}</Badge>
                              <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">{job.type || 'Full-time'}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-3xl font-black text-[#111827]">{job.budget}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-base font-medium line-clamp-2 leading-relaxed max-w-3xl">{job.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-muted/20">
                          <div className="flex flex-wrap gap-2">
                            {(job.skills || []).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="bg-muted/20 text-[#111827] rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none">{skill}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" size="icon" className="rounded-xl w-14 h-14 border-muted-foreground/10" onClick={() => handleSaveJob(job.id)}><Bookmark className="w-6 h-6" /></Button>
                            <Button onClick={() => handleApply(job)} className="flex-1 md:flex-none bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-2xl h-14 px-10 font-black text-sm shadow-xl shadow-primary/20">Quick Apply</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center p-20 bg-white rounded-[2.5rem] border-dashed border-2">
                  <p className="text-muted-foreground font-bold">No jobs found in {currentLocation}. Try adjusting your filters!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workers" className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black tracking-tight">Elite Workers <span className="text-muted-foreground font-medium ml-2 text-lg">({filteredWorkers.length})</span></h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workersLoading ? [1, 2, 3].map(i => <div key={i} className="h-72 bg-white rounded-[2.5rem] animate-pulse" />) : filteredWorkers.map((worker) => (
                <Card key={worker.id} className="border-none shadow-sm rounded-[3rem] bg-white group hover:shadow-2xl transition-all overflow-hidden relative border border-transparent hover:border-primary/10">
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <Avatar className="w-24 h-24 rounded-[2rem] ring-8 ring-[#F8F9FE] shadow-lg group-hover:scale-105 transition-transform">
                          <AvatarImage src={worker.avatarUrl} />
                          <AvatarFallback className="font-black text-2xl bg-primary/10 text-primary">{worker.name?.[0]}</AvatarFallback>
                        </Avatar>
                        {worker.rating >= 4.8 && (
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-1.5 shadow-xl">
                            <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-black text-primary">$60-120<span className="text-xs text-muted-foreground">/hr</span></div>
                        <div className="flex items-center gap-1.5 justify-end text-sm font-black"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{worker.rating?.toFixed(1) || '5.0'}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black group-hover:text-primary transition-colors">{worker.name}</h4>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{worker.role || 'Elite Professional'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(worker.skills || ['React', 'UI Design']).slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-muted/30 text-[9px] font-black rounded-lg px-3 py-1.5 uppercase tracking-wider border-none">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {worker.location || 'Kerala'}</span>
                      {worker.availabilityStatus === 'available' && <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Ready</span>}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black text-sm border-muted-foreground/10 hover:bg-muted/5 transition-colors">Profile</Button>
                      <Button onClick={() => router.push(`/messages?hire=${worker.id}`)} className="flex-1 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-2xl h-14 font-black text-sm shadow-xl shadow-primary/20">Hire Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="mt-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative">
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">Smart Matching</Badge>
              <h2 className="text-5xl font-black leading-tight">Need a custom<br/>talent match in {currentLocation}?</h2>
              <p className="text-xl text-white/80 font-medium leading-relaxed max-w-lg">Our AI-powered engine analyzes your profile and project requirements to find the perfect professional match in seconds.</p>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-16 px-12 font-black text-lg shadow-2xl shadow-black/20 gap-3">
                Try AI Matcher <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
            <div className="hidden lg:flex justify-end relative">
               <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-3xl">
                  <TrendingUp className="w-32 h-32 opacity-40 rotate-12" />
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

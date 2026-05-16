
"use client"

import { useState, useEffect } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Briefcase, 
  Wallet, 
  Star,
  PieChart,
  Atom,
  ChevronRight,
  Github,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  const GITHUB_REPO = "https://github.com/theastralregulator/Project-QUUB.git";

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const stats = [
    { label: "Member Since", value: profileData?.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "June 2023", icon: Calendar, color: "text-purple-600 bg-purple-50" },
    { label: "Job Success Rate", value: "98%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Total Earned", value: "NPR 1,250,000+", icon: Wallet, color: "text-indigo-600 bg-indigo-50" },
    { label: "Jobs Completed", value: "115", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Projects", value: "2", icon: Briefcase, color: "text-violet-600 bg-violet-50" },
  ];

  const projects = [
    {
      title: "Website Redesign",
      desc: "We need a platform and website redesign for your business.",
      image: "https://picsum.photos/seed/project1/600/400",
      color: "bg-indigo-600"
    },
    {
      title: "Mobile App Development",
      desc: "Develop Development mobile app for Android and iOS.",
      image: "https://picsum.photos/seed/project2/600/400",
      color: "bg-emerald-500"
    }
  ];

  const reviews = [
    { name: "Aakash R.", time: "5 date ago", rating: 5, text: "Great realize your experience with marti and developer in making a bushing project is wellout." },
    { name: "Aakash R.", time: "5 date ago", rating: 5, text: "Great to have 4+ years of experience in UI/UX design. I have worked a similar projects before." },
    { name: "Aakash R.", time: "2 date ago", rating: 5, text: "Great to hear that. Can your time so xrm and great I visibility from your reviews!" }
  ];

  const skills = profileData?.skills?.length ? profileData.skills : ["React", "Node.js", "JavaScript", "MongoDB", "UI/UX Design", "Mobile Design", "Frotnet & Analytics"];

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
            <p className="text-muted-foreground font-medium">Connect, chat and get things done.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl h-12 px-6 font-black text-sm border-muted-foreground/20 bg-white">
              Edit Profile
            </Button>
            <Link href="/jobs/create">
              <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl h-12 px-6 font-black text-sm shadow-xl shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Post a Job
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-none shadow-none rounded-[3rem] bg-gradient-to-br from-[#E6E9FF] to-[#F0F2FF] mb-12 overflow-hidden relative">
          <CardContent className="p-10 md:p-16 flex flex-col items-center text-center relative z-10">
            <div className="absolute top-10 left-1/4 -translate-x-1/2 opacity-20 hidden lg:block">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12"><Briefcase className="w-8 h-8 text-indigo-600" /></div>
            </div>
            <div className="absolute top-20 right-1/4 translate-x-1/2 opacity-20 hidden lg:block">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12"><Star className="w-8 h-8 text-yellow-500 fill-yellow-500" /></div>
            </div>
            <div className="absolute bottom-20 left-1/3 -translate-x-full opacity-20 hidden lg:block">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-6"><Atom className="w-8 h-8 text-emerald-500" /></div>
            </div>

            <div className="relative mb-6">
              <Avatar className="w-32 h-32 rounded-full border-8 border-white shadow-2xl">
                <AvatarImage src={profileData?.avatarUrl || user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'aman'}/400`} />
                <AvatarFallback className="text-3xl font-black">{profileData?.name?.[0] || user?.displayName?.[0] || 'A'}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-3 mb-8">
              <h2 className="text-4xl font-black tracking-tight text-[#111827]">{profileData?.name || user?.displayName || "Member"}</h2>
              <p className="text-lg font-bold text-[#6B7280]">{profileData?.bio || "Professional Member"}</p>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className="bg-[#EBEFFF] text-[#6366f1] font-black px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest border-none">Premium Member</Badge>
                <Link href={GITHUB_REPO} target="_blank">
                  <Button variant="outline" size="sm" className="rounded-full h-8 px-4 gap-2 border-muted-foreground/10 bg-white text-xs font-black uppercase tracking-widest hover:bg-muted/5">
                    <Github className="w-3.5 h-3.5" /> Project Repo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-center gap-2">
                <span className="font-black text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">Verified Skills</span>
                <CheckCircle2 className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-white border-none text-[#111827] font-black px-5 py-2.5 rounded-xl text-[11px] gap-2 shadow-sm">
                    {skill}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6366f1] fill-[#6366f1]/10" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-10 text-left">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-[#111827]">Overview & Stats</h3>
            <div className="space-y-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white hover:scale-[1.02] transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", stat.color)}><stat.icon className="w-6 h-6" /></div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-[#111827]">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-[#111827]">Portfolio Highlights</h3>
            <div className="space-y-4">
              {projects.map((project, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
                  <div className={cn("aspect-video relative overflow-hidden", project.color)}>
                    <Image src={project.image} alt={project.title} fill className="object-cover opacity-95 group-hover:scale-110 transition-transform duration-700" data-ai-hint="project showcase" />
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <h4 className="text-2xl font-black text-[#111827]">{project.title}</h4>
                    <p className="text-sm text-[#6B7280] font-medium leading-relaxed">{project.desc}</p>
                    <Link href="#" className="inline-flex items-center gap-2 text-[#6366f1] text-sm font-black group/link">View Link <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" /></Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-[#111827]">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white">
                  <CardContent className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 rounded-2xl shadow-sm border border-muted/20">
                          <AvatarImage src={`https://picsum.photos/seed/rev-${i}/100`} />
                          <AvatarFallback className="font-black text-xs">{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-left space-y-0.5">
                          <p className="font-black text-base text-[#111827]">{review.name}</p>
                          <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{review.time}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] font-medium leading-relaxed">"{review.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Loader2,
  Crown,
  Sparkles
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
    { label: "Total Earned", value: "₹1,25,000+", icon: Wallet, color: "text-indigo-600 bg-indigo-50" },
    { label: "Jobs Completed", value: "115", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Projects", value: "2", icon: Briefcase, color: "text-violet-600 bg-violet-50" },
  ];

  const projects = [
    {
      title: "Website Redesign",
      desc: "Comprehensive platform and brand redesign for a high-growth tech startup.",
      image: "https://picsum.photos/seed/project1/600/400",
      color: "bg-indigo-600"
    },
    {
      title: "Mobile App Development",
      desc: "Cross-platform mobile application for real-time logistics tracking.",
      image: "https://picsum.photos/seed/project2/600/400",
      color: "bg-emerald-500"
    }
  ];

  const reviews = [
    { name: "Aakash R.", time: "5 days ago", rating: 5, text: "Incredible attention to detail and deep understanding of modern UI patterns." },
    { name: "Meera K.", time: "2 weeks ago", rating: 5, text: "Delivered the project ahead of schedule with exceptional quality." },
    { name: "Rahul S.", time: "1 month ago", rating: 5, text: "A true professional who knows how to scale tech stacks effectively." }
  ];

  const skills = profileData?.skills?.length ? profileData.skills : ["React", "Node.js", "Firebase", "Next.js", "UI/UX Design", "System Architecture"];

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'silver': return <Star className="w-5 h-5 text-slate-400" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
            <p className="text-muted-foreground font-medium">Manage your professional identity and workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl h-12 px-6 font-black text-sm border-muted-foreground/20 bg-white">
              Edit Profile
            </Button>
            <Link href="/upgrades">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-6 font-black text-sm shadow-xl shadow-orange-500/20">
                <Sparkles className="w-4 h-4 mr-2" /> Upgrade Tier
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

            <div className="relative mb-6">
              <Avatar className="w-32 h-32 rounded-full border-8 border-white shadow-2xl">
                <AvatarImage src={profileData?.avatarUrl || user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'aman'}/400`} />
                <AvatarFallback className="text-3xl font-black">{profileData?.name?.[0] || user?.displayName?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-0 bg-white p-2 rounded-2xl shadow-xl">
                {getTierIcon(profileData?.accountType)}
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <h2 className="text-4xl font-black tracking-tight text-[#111827]">{profileData?.name || user?.displayName || "Member"}</h2>
              <p className="text-lg font-bold text-[#6B7280]">{profileData?.bio || "Elite Professional in Kerala"}</p>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className={cn(
                  "font-black px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest border-none",
                  profileData?.accountType === 'gold' ? "bg-yellow-50 text-yellow-600" :
                  profileData?.accountType === 'silver' ? "bg-slate-100 text-slate-600" :
                  "bg-[#EBEFFF] text-[#6366f1]"
                )}>
                  {profileData?.accountType || 'Standard'} Member
                </Badge>
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
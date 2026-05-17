
"use client"

import { useState, useEffect } from 'react';
import { useUser, useDoc, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Briefcase, 
  Wallet, 
  Star,
  ChevronRight,
  Loader2,
  Crown,
  Sparkles,
  MapPin,
  Phone,
  User as UserIcon,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    userType: 'both',
    skills: ''
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (profileData) {
      setEditForm({
        name: profileData.name || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        userType: profileData.userType || 'both',
        skills: (profileData.skills || []).join(', ')
      });
    }
  }, [profileData]);

  const handleSaveProfile = async () => {
    if (!user || !db || !userRef) return;
    setSaveLoading(true);

    const updatedData = {
      name: editForm.name,
      bio: editForm.bio,
      location: editForm.location,
      phone: editForm.phone,
      userType: editForm.userType,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    updateDoc(userRef, updatedData)
      .then(() => {
        toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        setIsEditing(false);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setSaveLoading(false));
  };
  
  const stats = [
    { label: "Member Since", value: profileData?.createdAt?.seconds ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently", icon: Calendar, color: "text-purple-600 bg-purple-50" },
    { label: "Job Success Rate", value: profileData?.rating ? "98%" : "N/A", icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Total Earned", value: "₹0", icon: Wallet, color: "text-indigo-600 bg-indigo-50" },
    { label: "Jobs Completed", value: profileData?.reviewsCount || "0", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Projects", value: "0", icon: Briefcase, color: "text-violet-600 bg-violet-50" },
  ];

  const projects = []; // Assuming empty for now as it's not in schema yet
  const reviews = []; // Assuming empty for now

  if (!mounted || authLoading || profileLoading) {
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

  const skills = profileData?.skills || [];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 lg:pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
            <p className="text-muted-foreground font-medium">Manage your professional identity and workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl h-12 px-6 font-black text-sm border-muted-foreground/20 bg-white"
              onClick={() => setIsEditing(true)}
            >
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
            <div className="relative mb-6">
              <Avatar className="w-32 h-32 rounded-full border-8 border-white shadow-2xl">
                <AvatarImage src={profileData?.avatarUrl || user?.photoURL || `https://picsum.photos/seed/${user?.uid}/400`} />
                <AvatarFallback className="text-3xl font-black">{profileData?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-0 bg-white p-2 rounded-2xl shadow-xl">
                {getTierIcon(profileData?.accountType || 'standard')}
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <h2 className="text-4xl font-black tracking-tight text-[#111827]">{profileData?.name || "New Member"}</h2>
              <p className="text-lg font-bold text-[#6B7280]">{profileData?.bio || "No bio added yet"}</p>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className={cn(
                  "font-black px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest border-none",
                  profileData?.accountType === 'gold' ? "bg-yellow-50 text-yellow-600" :
                  profileData?.accountType === 'silver' ? "bg-slate-100 text-slate-600" :
                  "bg-[#EBEFFF] text-[#6366f1]"
                )}>
                  {profileData?.accountType || 'Standard'} Member
                </Badge>
                {profileData?.location && (
                  <Badge variant="outline" className="rounded-full border-muted-foreground/20 px-4 py-1.5 flex items-center gap-1.5 font-bold text-[10px] uppercase">
                    <MapPin className="w-3 h-3" /> {profileData.location}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-center gap-2">
                <span className="font-black text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">Verified Skills</span>
                <CheckCircle2 className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.length > 0 ? skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-white border-none text-[#111827] font-black px-5 py-2.5 rounded-xl text-[11px] gap-2 shadow-sm">
                    {skill}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6366f1] fill-[#6366f1]/10" />
                  </Badge>
                )) : (
                  <p className="text-xs text-muted-foreground font-medium">Add skills to show up in search results</p>
                )}
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
              {projects.length > 0 ? projects.map((project: any, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
                  <div className={cn("aspect-video relative overflow-hidden", project.color)}>
                    <Image src={project.image} alt={project.title} fill className="object-cover opacity-95 group-hover:scale-110 transition-transform duration-700" data-ai-hint="project showcase" />
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <h4 className="text-2xl font-black text-[#111827]">{project.title}</h4>
                    <p className="text-sm text-[#6B7280] font-medium leading-relaxed">{project.desc}</p>
                  </CardContent>
                </Card>
              )) : (
                <div className="p-12 text-center bg-white rounded-[2.5rem] border-dashed border-2 flex flex-col gap-4">
                   <Briefcase className="w-8 h-8 mx-auto text-muted-foreground/30" />
                   <p className="text-xs font-bold text-muted-foreground uppercase">No projects added yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-[#111827]">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review: any, i) => (
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
              )) : (
                <div className="p-12 text-center bg-white rounded-[2.5rem] border-dashed border-2 flex flex-col gap-4">
                   <Star className="w-8 h-8 mx-auto text-muted-foreground/30" />
                   <p className="text-xs font-bold text-muted-foreground uppercase">No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-10 pb-0 space-y-4">
            <DialogTitle className="text-4xl font-black tracking-tight">Edit Profile</DialogTitle>
            <DialogDescription className="text-base font-medium">Update your professional information and settings.</DialogDescription>
          </DialogHeader>
          <div className="p-10 pt-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 font-bold"
                    placeholder="+91 0000 000000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Professional Bio</Label>
              <Textarea 
                value={editForm.bio}
                onChange={e => setEditForm({...editForm, bio: e.target.value})}
                className="min-h-[120px] rounded-2xl bg-muted/30 border-none p-5 font-bold"
                placeholder="Tell the world about your expertise..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={editForm.location}
                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 font-bold"
                    placeholder="e.g. Kochi, Kerala"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Profile Type</Label>
                <Select value={editForm.userType} onValueChange={v => setEditForm({...editForm, userType: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none font-bold">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="worker">Worker Only</SelectItem>
                    <SelectItem value="employer">Employer Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Skills (Comma separated)</Label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={editForm.skills}
                  onChange={e => setEditForm({...editForm, skills: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-12 font-bold"
                  placeholder="React, Design, Node.js"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-10 pt-0">
            <Button 
              className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              onClick={handleSaveProfile}
              disabled={saveLoading}
            >
              {saveLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

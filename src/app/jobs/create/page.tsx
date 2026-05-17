
"use client"

import { useState } from 'react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase, DollarSign, MapPin, Sparkles, Plus, Tag } from 'lucide-react';
import { generateJobDescription } from '@/ai/flows/generate-job-description-flow';

export default function CreateJobPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: 'Remote',
    type: 'remote',
    category: 'Development',
    skills: ''
  });

  const categories = ["Design", "Development", "Writing", "Marketing", "Admin", "Data"];

  const handleAICompose = async () => {
    if (!formData.title) {
      toast({ variant: "destructive", title: "Missing Title", description: "Please enter a job title first." });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateJobDescription({ keywordsOrPrompt: formData.title });
      setFormData({ ...formData, description: res.jobDescription });
      toast({ title: "AI Draft Ready", description: "Job description generated based on your title." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Could not generate description." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (!formData.title || !formData.budget) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Title and Budget are required." });
      return;
    }

    setLoading(true);

    const jobData = {
      title: formData.title,
      description: formData.description,
      budget: formData.budget,
      location: formData.location,
      type: formData.type,
      category: formData.category,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      postedBy: user.uid,
      employerName: user.displayName || 'Anonymous',
      status: 'pending',
      createdAt: serverTimestamp(),
      isUrgent: false
    };

    addDoc(collection(db, 'jobs'), jobData)
      .then(() => {
        toast({ title: "Job Posted Success!", description: "Your opportunity is now live and pending review." });
        setLoading(false);
        router.push('/jobs');
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: 'jobs',
          operation: 'create',
          requestResourceData: jobData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FE] pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="p-10 pb-0 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Plus className="w-8 h-8" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tight">Post a New Job</CardTitle>
            <CardDescription className="text-lg font-medium">Find the best talent for your project today.</CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
                  <button 
                    type="button" 
                    onClick={handleAICompose}
                    disabled={isGenerating}
                    className="h-8 text-[10px] font-black uppercase tracking-widest text-primary gap-1 flex items-center hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Compose
                  </button>
                </div>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[150px] rounded-2xl bg-muted/30 border-none p-5 focus-visible:ring-primary/20" 
                  placeholder="Describe the role, responsibilities and requirements..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest ml-1">Category</Label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select onValueChange={v => setFormData({...formData, category: v})} defaultValue={formData.category}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none pl-12 focus:ring-primary/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest ml-1">Work Type</Label>
                  <Select onValueChange={v => setFormData({...formData, type: v})} defaultValue={formData.type}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest ml-1">Budget / Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                      placeholder="e.g. $50/hr or $2,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest ml-1">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                      placeholder="e.g. Remote or City, Country"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1">Skills (comma separated)</Label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                    placeholder="React, Design, Node.js"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform mt-6"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publish Job Posting"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, User, Users, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [role, setRole] = useState<null | 'worker' | 'employer' | 'both'>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!auth || !db) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      setDoc(doc(db, 'users', user.uid), {
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        userType: role,
        skills: [],
        bio: '',
        location: 'Remote',
        avatarUrl: `https://picsum.photos/seed/${user.uid}/200`,
        rating: 5.0,
        reviewsCount: 0,
        availabilityStatus: 'available',
        createdAt: serverTimestamp()
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-xl rounded-3xl border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="h-2 bg-muted overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${(step / 2) * 100}%` }} 
          />
        </div>
        
        <CardHeader className="space-y-4 pb-0 text-center pt-10 px-8">
          <CardTitle className="text-3xl font-headline">
            {step === 1 ? "Join as an elite..." : "Complete your profile"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 1 
              ? "Select how you want to use the Quub platform." 
              : "Enter your personal details to get started."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {step === 1 ? (
            <div className="grid gap-4">
              {[
                { id: 'worker', label: 'I am a Worker', desc: 'Find high-paying projects and clients.', icon: Briefcase },
                { id: 'employer', label: 'I am an Employer', desc: 'Hire world-class talent and build fast.', icon: Users },
                { id: 'both', label: 'I am Both', desc: 'Flexibility to hire and work on one platform.', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as any)}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left flex items-center gap-6 transition-all group",
                      isSelected ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/20 hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                      isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                )
              })}
              <Button 
                disabled={!role} 
                onClick={() => setStep(2)}
                className="w-full h-14 rounded-xl font-bold text-lg mt-4 gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input 
                    id="fname" 
                    value={formData.fname}
                    onChange={(e) => setFormData({...formData, fname: e.target.value})}
                    className="h-12 rounded-xl bg-muted/30 border-none px-4" 
                    placeholder="Jane" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input 
                    id="lname" 
                    value={formData.lname}
                    onChange={(e) => setFormData({...formData, lname: e.target.value})}
                    className="h-12 rounded-xl bg-muted/30 border-none px-4" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-xl bg-muted/30 border-none px-4" 
                  placeholder="jane@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">Create Password</Label>
                <Input 
                  id="pass" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-12 rounded-xl bg-muted/30 border-none px-4" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="pt-4 flex flex-col gap-4">
                <Button 
                  onClick={handleSignUp}
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full h-14 rounded-xl font-bold text-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </Button>
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold">Back to role selection</Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/auth/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

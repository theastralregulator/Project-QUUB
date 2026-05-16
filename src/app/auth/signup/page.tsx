
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
  });

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!auth || !db) return;
    
    if (!formData.email || !formData.password || !formData.fname) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, and Password).",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create Email/Password account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const fullName = `${formData.fname} ${formData.lname}`.trim();

      // 2. Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName
      });

      // 3. Save User Profile to Firestore (Non-blocking as per guidelines)
      const userProfileData = {
        name: fullName,
        email: formData.email,
        phone: formData.phone || '',
        userType: 'both',
        skills: [],
        bio: '',
        location: 'Remote',
        avatarUrl: `https://picsum.photos/seed/${user.uid}/200`,
        rating: 5.0,
        reviewsCount: 0,
        availabilityStatus: 'available',
        createdAt: serverTimestamp()
      };

      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, userProfileData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userProfileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Account Created",
        description: `Welcome to Quub, ${formData.fname}!`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred during sign up."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-xl rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-4 pb-0 text-center pt-12 px-8">
          <CardTitle className="text-4xl font-headline font-black tracking-tight">
            Join Quub
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Create your account to start building with the best.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-10 pt-8 space-y-8">
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-xs font-black uppercase tracking-widest ml-1">First Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="fname" 
                    value={formData.fname}
                    onChange={(e) => setFormData({...formData, fname: e.target.value})}
                    className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                    placeholder="Jane" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lname" className="text-xs font-black uppercase tracking-widest ml-1">Last Name</Label>
                <Input 
                  id="lname" 
                  value={formData.lname}
                  onChange={(e) => setFormData({...formData, lname: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-5 focus-visible:ring-primary/20" 
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                  placeholder="jane@example.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest ml-1">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass" className="text-xs font-black uppercase tracking-widest ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="pass" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleSignUp}
                disabled={loading}
                className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-muted-foreground font-black tracking-widest">Secure Signup</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/auth/signin" className="text-primary font-black hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

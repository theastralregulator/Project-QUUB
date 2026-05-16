
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
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
      const fullName = `${formData.fname} ${formData.lname}`;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName
      });

      // Save User Profile to Firestore
      setDoc(doc(db, 'users', user.uid), {
        name: fullName,
        email: formData.email,
        userType: 'both', // Defaulting to both since role selection was removed
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
        <CardHeader className="space-y-4 pb-0 text-center pt-10 px-8">
          <CardTitle className="text-3xl font-headline">Create your account</CardTitle>
          <CardDescription className="text-base">
            Enter your details to join the Quub community and start building.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
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
                disabled={loading || !formData.email || !formData.password || !formData.fname}
                className="w-full h-14 rounded-xl font-bold text-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/auth/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

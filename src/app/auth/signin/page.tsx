
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Mail, Lock, LogIn, Phone } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign in failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-xl rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-4 pb-0 text-center pt-12 px-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-black tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Enter your credentials to access your Quub account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-10 pt-8 space-y-8">
          <div className="space-y-5">
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
                  placeholder="name@example.com" 
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
              <div className="flex justify-between items-center pr-1">
                <Label htmlFor="pass" className="text-xs font-black uppercase tracking-widest ml-1">Password</Label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline">Forgot?</Link>
              </div>
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
                onClick={handleEmailSignIn}
                disabled={loading}
                className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign In"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-muted-foreground font-black tracking-widest">Secure Access</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/auth/signup" className="text-primary font-black hover:underline">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

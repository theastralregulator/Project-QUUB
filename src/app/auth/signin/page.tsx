
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Phone, ShieldCheck, Mail, Lock, LogIn, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any existing verifier on mount to prevent container ID conflicts
    if (typeof window !== 'undefined' && window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      } catch (e) {}
    }
    return () => {
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

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

  const handleSendOtp = async () => {
    if (!auth || !formData.phone) return;
    
    if (!formData.phone.startsWith('+')) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Format",
        description: "Please include the country code (e.g., +1...)"
      });
      return;
    }

    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-signin-container', {
          size: 'invisible',
        });
      }
      
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
      toast({ title: "OTP Sent", description: "Verification code sent to your phone." });
    } catch (error: any) {
      console.error("Sign-in OTP Error:", error);
      toast({ variant: "destructive", title: "Failed to send OTP", description: error.message });
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Success!", description: "Identity verified." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Verification failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/20">
      <div id="recaptcha-signin-container"></div>
      
      <Card className="w-full max-w-xl rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-4 pb-0 text-center pt-12 px-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-black tracking-tight">
            {step === 'otp' ? "Verify Code" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-base font-medium">
            {step === 'otp' 
              ? `Code sent to ${formData.phone}` 
              : "Enter your credentials to access your Quub account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-10 pt-8 space-y-8">
          {step === 'details' ? (
            <div className="space-y-5">
              {method === 'email' ? (
                <>
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
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-14 rounded-2xl bg-muted/30 border-none px-12 focus-visible:ring-primary/20" 
                      placeholder="+1234567890" 
                    />
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button 
                  onClick={method === 'email' ? handleEmailSignIn : handleSendOtp}
                  disabled={loading}
                  className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (method === 'email' ? "Sign In" : "Send OTP")}
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
                className="w-full h-12 rounded-xl font-bold text-primary"
              >
                Sign in with {method === 'email' ? 'Phone Number' : 'Email Address'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-xs font-black uppercase tracking-widest ml-1">Verification Code</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input 
                    id="otp" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-16 rounded-2xl bg-muted/30 border-none px-12 text-center text-2xl font-black tracking-[0.5em] focus-visible:ring-primary/20" 
                    placeholder="000000" 
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className="w-full h-16 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Sign In"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setStep('details')}
                  className="w-full h-12 rounded-xl font-bold text-muted-foreground flex gap-2 items-center"
                >
                  <ChevronLeft className="w-4 h-4" /> Go Back
                </Button>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-muted-foreground font-black tracking-widest">Or continue with</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/auth/signup" className="text-primary font-black hover:underline">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

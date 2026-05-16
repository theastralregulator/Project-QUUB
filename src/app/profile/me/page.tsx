import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Star, Edit3, Link as LinkIcon, Github, Twitter, Award, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function MyProfilePage() {
  const skills = ["React", "TypeScript", "Tailwind CSS", "Firebase", "UI/UX Design", "Figma", "Node.js"];
  
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Cover Header */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary to-accent relative">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative inline-block mx-auto">
                  <Avatar className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl">
                    <AvatarImage src="https://picsum.photos/seed/me/400" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Jordan Carter</h1>
                  <p className="text-primary font-semibold">Senior Product Designer</p>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold">4.9</div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Rating</div>
                  </div>
                  <div className="w-px h-8 bg-muted" />
                  <div className="text-center">
                    <div className="font-bold">142</div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Jobs</div>
                  </div>
                  <div className="w-px h-8 bg-muted" />
                  <div className="text-center">
                    <div className="font-bold">$12k</div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Earned</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full rounded-2xl h-12 font-bold gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="flex-1 h-12 rounded-2xl"><Github className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" className="flex-1 h-12 rounded-2xl"><Twitter className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" className="flex-1 h-12 rounded-2xl"><LinkIcon className="w-5 h-5" /></Button>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    Joined Jan 2022
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    Top Rated Plus
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
              <h3 className="font-bold mb-4">Verification</h3>
              <div className="space-y-3">
                {[
                  { label: "ID Verified", status: true },
                  { label: "Phone Verified", status: true },
                  { label: "Email Verified", status: true },
                  { label: "Payment Verified", status: false },
                ].map((v, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{v.label}</span>
                    {v.status ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <span className="text-[10px] font-bold text-primary uppercase">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Tabs & Content */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white p-1 rounded-2xl shadow-sm w-full md:w-auto h-14 flex items-center justify-start overflow-x-auto no-scrollbar">
                <TabsTrigger value="overview" className="rounded-xl h-12 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-xl h-12 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl h-12 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <Card className="rounded-3xl border-none shadow-sm p-8 bg-white space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-headline">About Me</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Passionate Senior Product Designer with over 8 years of experience building high-conversion interfaces for Fortune 500 companies and Silicon Valley startups. My approach blends data-driven strategy with world-class aesthetics. I specialize in React-based design systems and mobile-first experiences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-headline">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-2 rounded-xl font-medium">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="rounded-3xl border-none shadow-sm p-8 bg-white space-y-4">
                    <h3 className="font-bold text-xl">Employment History</h3>
                    <div className="space-y-6">
                      {[1, 2].map(i => (
                        <div key={i} className="space-y-1 relative pl-4 border-l-2 border-primary/20">
                          <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-primary" />
                          <div className="text-xs font-bold text-primary uppercase">2020 — Present</div>
                          <h4 className="font-bold">Senior Designer at Uber</h4>
                          <p className="text-sm text-muted-foreground">Led the redesign of the driver onboarding flow, resulting in a 22% increase in activation.</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="rounded-3xl border-none shadow-sm p-8 bg-white space-y-4">
                    <h3 className="font-bold text-xl">Education</h3>
                    <div className="space-y-6">
                      <div className="space-y-1 relative pl-4 border-l-2 border-accent/20">
                        <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-accent" />
                        <div className="text-xs font-bold text-accent uppercase">2014 — 2018</div>
                        <h4 className="font-bold">BFA in Graphic Design</h4>
                        <p className="text-sm text-muted-foreground">Rhode Island School of Design (RISD)</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all bg-white">
                    <div className="relative aspect-video">
                      <Image 
                        src={`https://picsum.photos/seed/port${i}/600/400`} 
                        alt="Project" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg">Fintech Mobile App Redesign</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive UI kit and case study for a banking application.</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="rounded-3xl border-none shadow-sm p-6 bg-white flex gap-4">
                    <Avatar className="w-12 h-12 rounded-xl">
                      <AvatarImage src={`https://picsum.photos/seed/rev${i}/100`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">Sarah Williams</h4>
                          <p className="text-xs text-muted-foreground">Founder, TechStack</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <p className="text-sm">"Incredible eye for detail and very responsive. Jordan took our vague ideas and turned them into a world-class product. Highly recommend!"</p>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Apr 12, 2024</div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
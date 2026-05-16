import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export default function WorkersPage() {
  const workers = [
    { name: "Alex Rivera", role: "Senior UI/UX Designer", rating: "4.9", reviews: "128", skills: ["Figma", "Webflow", "React"], price: "$85/hr", location: "Madrid, ES", verified: true },
    { name: "Elena Chen", role: "Full Stack Developer", rating: "5.0", reviews: "42", skills: ["Node.js", "Next.js", "Python"], price: "$120/hr", location: "Toronto, CA", verified: true },
    { name: "Marcus Thorne", role: "Content Specialist", rating: "4.7", reviews: "215", skills: ["Copywriting", "SEO", "Ads"], price: "$65/hr", location: "Austin, US", verified: false },
    { name: "Sophie Muller", role: "3D Artist", rating: "4.8", reviews: "89", skills: ["Blender", "Unreal Engine", "Maya"], price: "$95/hr", location: "Berlin, DE", verified: true },
    { name: "David Kim", role: "App Developer", rating: "4.9", reviews: "67", skills: ["Flutter", "Kotlin", "Swift"], price: "$110/hr", location: "Seoul, KR", verified: true },
    { name: "Jordan Smith", role: "Video Editor", rating: "4.6", reviews: "154", skills: ["Premiere Pro", "Color Grading"], price: "$50/hr", location: "London, UK", verified: false },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-white border-b sticky top-16 z-40 md:top-16">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl bg-muted/50 border-none" placeholder="Find elite talent..." />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["Designers", "Developers", "Writers", "Editors", "Marketers", "Consultants"].map(cat => (
              <Badge key={cat} variant="secondary" className="px-4 py-1.5 rounded-full whitespace-nowrap">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker, i) => (
            <Card key={i} className="group hover:shadow-xl transition-all border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <Avatar className="w-20 h-20 rounded-2xl ring-4 ring-primary/5">
                      <AvatarImage src={`https://picsum.photos/seed/worker${i}/200`} />
                      <AvatarFallback>{worker.name[0]}</AvatarFallback>
                    </Avatar>
                    {worker.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary fill-primary text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{worker.price}</div>
                    <div className="flex items-center gap-1 justify-end text-sm font-medium">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {worker.rating}
                      <span className="text-muted-foreground font-normal">({worker.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{worker.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{worker.role}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {worker.location}
                  <span className="ml-auto flex items-center gap-1 text-primary font-semibold">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Available Now
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {worker.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-muted/50 font-normal text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="pt-2 flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl font-bold">View Profile</Button>
                  <Button className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/10">Hire Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-12 text-center">
          <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">Show more talent</Button>
        </div>
      </div>
    </div>
  );
}
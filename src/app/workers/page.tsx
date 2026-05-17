
"use client"

import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, CheckCircle2, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function WorkersPage() {
  const db = useFirestore();

  const workersQuery = useMemoFirebase(() => {
    if (!db) return null;
    // Fetch all users and filter quality profiles client-side
    return query(collection(db, 'users'), limit(40));
  }, [db]);

  const { data: rawWorkers, loading } = useCollection(workersQuery);

  const filteredWorkers = useMemo(() => {
    if (!rawWorkers) return [];
    return rawWorkers.filter(worker => {
      // Quality check: Only show workers who have actually added skills
      return worker.skills && Array.isArray(worker.skills) && worker.skills.length > 0;
    });
  }, [rawWorkers]);

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
        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className="group hover:shadow-xl transition-all border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="w-20 h-20 rounded-2xl ring-4 ring-primary/5">
                        <AvatarImage src={worker.avatarUrl} />
                        <AvatarFallback>{worker.name?.[0]}</AvatarFallback>
                      </Avatar>
                      {worker.rating > 4.5 && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-primary fill-primary text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">$60 - $120/hr</div>
                      <div className="flex items-center gap-1 justify-end text-sm font-medium">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {worker.rating?.toFixed(1) || '5.0'}
                        <span className="text-muted-foreground font-normal">({worker.reviewsCount || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{worker.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{worker.role || 'Elite Professional'}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {worker.location}
                    {worker.availabilityStatus === 'available' && (
                      <span className="ml-auto flex items-center gap-1 text-primary font-semibold">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available Now
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(worker.skills || []).map((skill: string) => (
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
        )}
        
        {!loading && filteredWorkers.length === 0 && (
          <Card className="text-center p-12 border-dashed">
            <div className="max-w-xs mx-auto space-y-4">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-bold text-lg">No professional profiles found.</p>
              <p className="text-sm text-muted-foreground">Profiles without listed skills are automatically hidden to maintain platform quality.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

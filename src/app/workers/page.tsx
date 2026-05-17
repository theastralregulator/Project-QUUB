
"use client"

import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, CheckCircle2, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WorkersPage() {
  const db = useFirestore();
  const router = useRouter();

  const workersQuery = useMemoFirebase(() => {
    if (!db) return null;
    // Query users ordered by creation date to show new users automatically at top
    return query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const { data: rawWorkers, loading } = useCollection(workersQuery);

  const filteredWorkers = useMemo(() => {
    if (!rawWorkers) return [];
    // Include all user profiles automatically as requested
    return rawWorkers;
  }, [rawWorkers]);

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-white border-b sticky top-16 z-40 md:top-16">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl bg-muted/50 border-none" placeholder="Find talent..." />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["Designers", "Developers", "Writers", "Editors", "Marketers", "Consultants"].map(cat => (
              <Badge key={cat} variant="secondary" className="px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer">
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
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{worker.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{worker.role || 'Member'}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {worker.location || 'Kerala'}
                    {worker.availabilityStatus === 'available' && (
                      <span className="ml-auto flex items-center gap-1 text-primary font-semibold">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {worker.skills && worker.skills.length > 0 ? (
                      (worker.skills || []).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-muted/50 font-normal text-xs">{skill}</Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs border-dashed">No skills listed</Badge>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => router.push(`/profile/${worker.id}`)}>View Profile</Button>
                    <Button className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/10" onClick={() => router.push(`/messages?hire=${worker.id}`)}>Message</Button>
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
              <p className="text-muted-foreground font-bold text-lg">No member profiles found.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

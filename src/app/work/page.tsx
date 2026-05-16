import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal, MapPin, Clock, DollarSign, Filter, Sparkles } from 'lucide-react';

export default function WorkPage() {
  const jobs = [
    { title: "Senior React Developer", budget: "$4k - $6k", type: "Full-time", tags: ["React", "Next.js", "Firebase"], company: "TechFlow", posted: "2h ago", location: "Remote" },
    { title: "Illustrator for NFT Project", budget: "$1k", type: "Contract", tags: ["Digital Art", "NFT", "2D"], company: "CryptoArt", posted: "5h ago", location: "Global" },
    { title: "Content Strategist", budget: "$50/hr", type: "Part-time", tags: ["SEO", "Marketing", "Copywriting"], company: "GrowthX", posted: "1d ago", location: "London, UK" },
    { title: "Mobile App Designer", budget: "$3,500", type: "Project", tags: ["UI/UX", "Figma", "iOS"], company: "AppSilo", posted: "3h ago", location: "Remote" },
    { title: "Video Editor for YouTube", budget: "$200/vid", type: "Ongoing", tags: ["Premiere Pro", "After Effects"], company: "VlogStars", posted: "12h ago", location: "Remote" },
    { title: "Data Scientist (AI)", budget: "$8k - $12k", type: "Full-time", tags: ["Python", "TensorFlow", "NLP"], company: "MindLogic", posted: "1h ago", location: "San Francisco, CA" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-white border-b sticky top-16 z-40 md:top-16">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl bg-muted/50 border-none" placeholder="Search for jobs..." />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl md:hidden">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <Button className="hidden md:flex gap-2 rounded-xl h-12 px-6">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-xl h-12 px-6">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Match
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["Design", "Development", "Marketing", "Writing", "Data", "Admin"].map(cat => (
              <Badge key={cat} variant="secondary" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block w-64 space-y-8 shrink-0">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Job Type</h3>
              <div className="space-y-2">
                {["Full-time", "Contract", "Part-time", "Project-based"].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded-md border-muted text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Experience Level</h3>
              <div className="space-y-2">
                {["Entry", "Intermediate", "Expert"].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded-md border-muted text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm group-hover:text-primary transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Listings */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{jobs.length} jobs found</h2>
              <select className="bg-transparent text-sm font-medium outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Highest Pay</option>
                <option>Most Applied</option>
              </select>
            </div>

            <div className="grid gap-4">
              {jobs.map((job, i) => (
                <Card key={i} className="group hover:shadow-xl transition-all border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {job.company[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-muted/50 font-normal text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{job.budget}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {job.posted}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="rounded-xl font-bold flex-1 md:flex-none">Save</Button>
                          <Button className="rounded-xl font-bold px-8 flex-1 md:flex-none">Apply Now</Button>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-muted/30 border-t flex items-center gap-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="pt-8 text-center">
              <Button variant="outline" className="rounded-full px-10">Load More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
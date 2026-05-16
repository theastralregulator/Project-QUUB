"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Plus, MoreVertical, Image as ImageIcon, Mic, Paperclip, CheckCheck, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(0);

  const contacts = [
    { name: "Sarah Jenkins", lastMsg: "The designs look amazing! Can we...", time: "2m ago", status: "online", unread: 2 },
    { name: "Alex Rivera", lastMsg: "Sent the contract for your review.", time: "1h ago", status: "offline", unread: 0 },
    { name: "GrowthX Support", lastMsg: "Your payment was processed.", time: "4h ago", status: "online", unread: 0 },
    { name: "Marcus Thorne", lastMsg: "Let's hop on a call tomorrow.", time: "1d ago", status: "offline", unread: 0 },
  ];

  const messages = [
    { text: "Hi! I just finished the initial concepts for the logo redesign.", sender: "me", time: "10:30 AM", status: "read" },
    { text: "The designs look amazing! Can we try a darker purple for the primary brand?", sender: "them", time: "10:35 AM", status: "read" },
    { text: "Sure thing! I'll update the style guide and send it over in an hour.", sender: "me", time: "10:36 AM", status: "read" },
    { text: "Perfect, thanks so much for the quick turnaround.", sender: "them", time: "10:40 AM", status: "read" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white md:container md:mx-auto md:my-4 md:rounded-[2.5rem] md:shadow-2xl md:border">
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-96 border-r flex flex-col transition-all bg-muted/5",
        activeChat !== null ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-black tracking-tight">Messages</h1>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white shadow-sm border">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input className="pl-11 h-12 rounded-2xl bg-white border-none shadow-sm focus-visible:ring-primary/20" placeholder="Search chats..." />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-muted/10">
            {contacts.map((contact, i) => (
              <button
                key={i}
                onClick={() => setActiveChat(i)}
                className={cn(
                  "w-full p-5 flex gap-4 hover:bg-white transition-all text-left relative group",
                  activeChat === i && "bg-white shadow-inner"
                )}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14 rounded-2xl ring-2 ring-white shadow-md">
                    <AvatarImage src={`https://picsum.photos/seed/msg${i}/200`} />
                    <AvatarFallback className="font-bold">{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-black text-base truncate">{contact.name}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate font-medium">{contact.lastMsg}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary text-white text-[10px] font-black rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    {contact.unread}
                  </div>
                )}
                {activeChat === i && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all bg-white relative",
        activeChat === null ? "hidden md:flex bg-muted/5 items-center justify-center" : "flex"
      )}>
        {activeChat === null ? (
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto text-primary animate-pulse">
              <MessageSquare className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black">Your Elite Workspace</h2>
              <p className="text-muted-foreground font-medium">Select a conversation to start collaborating with your team or clients.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-1"
                  onClick={() => setActiveChat(null)}
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </Button>
                <div className="relative">
                  <Avatar className="w-12 h-12 rounded-2xl shadow-md border-2 border-white">
                    <AvatarImage src={`https://picsum.photos/seed/msg${activeChat}/200`} />
                    <AvatarFallback className="font-bold">{contacts[activeChat].name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">{contacts[activeChat].name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-2xl shadow-sm"><MoreVertical className="w-5 h-5" /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 bg-muted/5">
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground bg-white border px-4 py-1.5 rounded-full shadow-sm">Today, April 12</span>
                </div>
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col max-w-[85%] md:max-w-[70%] animate-in fade-in slide-in-from-bottom-2",
                      msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-5 rounded-3xl text-sm font-medium shadow-md leading-relaxed",
                      msg.sender === 'me' 
                        ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                        : "bg-white text-foreground rounded-tl-none border border-muted/50"
                    )}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t">
              <div className="flex items-center gap-3 bg-muted/20 rounded-[1.5rem] p-2 pr-4 border border-muted focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/20 transition-all">
                <Button variant="ghost" size="icon" className="rounded-xl shrink-0 hover:bg-white transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </Button>
                <Input 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground font-medium h-12 text-base" 
                  placeholder="Type a message..." 
                />
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-muted-foreground hover:text-primary transition-colors"><Smile className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-muted-foreground hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></Button>
                  <Button size="icon" className="w-14 h-14 rounded-2xl shadow-xl shadow-primary/30 ml-2 hover:scale-105 transition-all">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

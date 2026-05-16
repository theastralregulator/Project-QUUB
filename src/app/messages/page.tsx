"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Plus, MoreVertical, Image as ImageIcon, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(0);

  const contacts = [
    { name: "Sarah Jenkins", lastMsg: "The designs look amazing! Can we...", time: "2m ago", status: "online", unread: 2 },
    { name: "Alex Rivera", lastMsg: "Sent the contract for your review.", time: "1h ago", status: "offline", unread: 0 },
    { name: "GrowthX Support", lastMsg: "Your payment was processed.", time: "4h ago", status: "online", unread: 0 },
    { name: "Marcus Thorne", lastMsg: "Let's hop on a call tomorrow.", time: "1d ago", status: "offline", unread: 0 },
  ];

  const messages = [
    { text: "Hi! I just finished the initial concepts for the logo.", sender: "me", time: "10:30 AM" },
    { text: "The designs look amazing! Can we try a darker purple for the primary brand?", sender: "them", time: "10:35 AM" },
    { text: "Sure thing! I'll update the style guide and send it over in an hour.", sender: "me", time: "10:36 AM" },
    { text: "Perfect, thanks so much for the quick turnaround.", sender: "them", time: "10:40 AM" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Hidden on mobile if chat is active */}
      <aside className={cn(
        "w-full md:w-80 border-r flex flex-col transition-all",
        activeChat !== null ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 h-10 rounded-full bg-muted/50 border-none" placeholder="Search chats..." />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {contacts.map((contact, i) => (
              <button
                key={i}
                onClick={() => setActiveChat(i)}
                className={cn(
                  "w-full p-4 flex gap-3 hover:bg-primary/5 transition-colors text-left relative",
                  activeChat === i && "bg-primary/5"
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarImage src={`https://picsum.photos/seed/msg${i}/200`} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.status === 'online' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold truncate">{contact.name}</h3>
                    <span className="text-[10px] text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMsg}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="absolute right-4 bottom-4 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all",
        activeChat === null ? "hidden md:flex bg-muted/10 items-center justify-center" : "flex"
      )}>
        {activeChat === null ? (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold">Select a conversation</h2>
            <p className="text-muted-foreground">Pick a chat to start messaging.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-2"
                  onClick={() => setActiveChat(null)}
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </Button>
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarImage src={`https://picsum.photos/seed/msg${activeChat}/200`} />
                  <AvatarFallback>{contacts[activeChat].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold leading-none">{contacts[activeChat].name}</h3>
                  <span className="text-[10px] text-green-500 font-medium">Online now</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4 bg-muted/10">
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
                </div>
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col max-w-[85%] md:max-w-[70%]",
                      msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm shadow-sm",
                      msg.sender === 'me' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white text-foreground rounded-tl-none border border-muted"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2 bg-muted/30 rounded-2xl p-2 pr-4 border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Button variant="ghost" size="icon" className="rounded-xl shrink-0"><Plus className="w-5 h-5" /></Button>
                <Input 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground h-10" 
                  placeholder="Type your message..." 
                />
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground"><ImageIcon className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground"><Mic className="w-4 h-4" /></Button>
                  <Button size="icon" className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 ml-2"><Send className="w-4 h-4" /></Button>
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
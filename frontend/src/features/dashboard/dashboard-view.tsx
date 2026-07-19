import * as React from "react"
import { Search, Bell, CalendarDays, Bot, Map as MapIcon, Users, Building, BookOpen, Bus, AlertTriangle, Megaphone, ArrowUpRight, Sparkles, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ErrorBoundary } from "@/components/error-boundary"
import { commandDispatcher } from "@/core/commands/dispatcher"

// The user can implement context/routing wrapper logic around these if needed.
// For now, we simulate navigation by throwing commands or using a context if available.
// Since we don't have access to the exact router in this component deeply, we'll emit events or mock it.
// We know `active` state is lifted up to App.tsx, but we don't have a hook for it here directly.
// Wait, we can dispatch commands for the AI Assistant. For others, we might need a way to navigate.
// Actually, `window.location.hash` or just using the Command Palette to navigate is fine,
// OR since it's a presentation UI, clicking them can just open the AI drawer or we can leave them visually perfect.
// Let's assume there's a global event for navigation, or we can just make them beautiful UI tiles.

const tiles = [
  { label: "AI Assistant", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-500/10", action: () => commandDispatcher.dispatch('openAiDrawer', '') },
  { label: "Campus Navigator", icon: MapIcon, color: "text-orange-500", bg: "bg-orange-500/10", route: "map" },
  { label: "Notice Board", icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10", route: "notices" },
  { label: "Timetable", icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-500/10", route: "timetable" },
  { label: "Events", icon: CalendarDays, color: "text-pink-500", bg: "bg-pink-500/10", route: "events" },
  { label: "Student Clubs", icon: Trophy, color: "text-cyan-500", bg: "bg-cyan-500/10", route: "clubs" },
  { label: "Departments", icon: Building, color: "text-indigo-500", bg: "bg-indigo-500/10", route: "departments" },
  { label: "Library", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10", route: "library" },
  { label: "Transport", icon: Bus, color: "text-teal-500", bg: "bg-teal-500/10", route: "transport" },

  { label: "Featured Poster", icon: Megaphone, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", action: () => document.getElementById("featured-poster")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
]

function DashboardViewContent() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-24 pt-4 md:p-6 lg:p-8 animate-in fade-in-0 duration-500">
      
      {/* 1. Hero Banner */}
      <section className="flex flex-col items-center text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-5xl font-display">
          Welcome to SCE Portal
        </h1>
        <p className="text-muted text-base max-w-2xl mb-8">
          The central command center for Saranathan College of Engineering.
        </p>
        
        {/* Global Search */}
        <div className="relative w-full max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <Input 
            placeholder="Search Campus..." 
            className="h-14 w-full rounded-xl border border-border bg-surface pl-12 pr-4 text-base focus-visible:ring-2 focus-visible:ring-primary/50 cursor-text hover:border-primary/50 transition-colors shadow-sm"
            onClick={() => commandDispatcher.dispatch('openSearch')}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
             <kbd className="px-2 py-1 bg-surface-2 border border-border rounded text-xs text-muted font-mono font-medium">Ctrl</kbd>
             <kbd className="px-2 py-1 bg-surface-2 border border-border rounded text-xs text-muted font-mono font-medium">K</kbd>
          </div>
        </div>
      </section>

      {/* 2.5 Featured poster tab */}
      <section id="featured-poster" className="relative overflow-hidden rounded-[26px] border border-fuchsia-200/80 bg-[#17102d] shadow-[0_22px_55px_rgba(124,58,237,0.18)] scroll-mt-6">
         <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl" />
         <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
         <div className="relative grid min-h-[285px] grid-cols-1 items-stretch md:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col justify-center p-7 text-left md:p-10">
               <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-200"><Sparkles className="h-4 w-4" /> Featured on campus</div>
               <h2 className="max-w-md text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">Freshers Welcome Party <span className="bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-lime-200 bg-clip-text text-transparent">2026</span></h2>
               <p className="mt-3 max-w-md text-sm leading-6 text-white/65">Dive into your new journey with music, laughter, and unforgettable connections.</p>
               <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href="/poster.jpg" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#291649] shadow-lg transition-transform hover:-translate-y-0.5">View poster <ArrowUpRight className="h-4 w-4" /></a>
                  <button onClick={() => commandDispatcher.dispatch('navigate', 'events')} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10">Explore events</button>
               </div>
               <p className="mt-5 text-[11px] font-medium text-white/45">Monday, 20 July 2026 <span className="px-2">•</span> 5:00 PM – 8:30 PM</p>
            </div>
            <a href="/poster.jpg" target="_blank" rel="noreferrer" className="group relative min-h-[255px] overflow-hidden md:min-h-0" aria-label="Open Freshers Welcome Party poster">
               <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#17102d] via-transparent to-transparent md:block" />
               <img src="/poster.jpg" alt="Freshers Welcome Party 2026 poster" className="h-full w-full object-cover object-top opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
               <span className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">Open full poster <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </a>
         </div>
      </section>

      {/* 2. Command Tiles Grid */}
      <section>
         <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-xl font-bold font-display text-text tracking-tight">Quick Access</h2>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {tiles.map((tile, i) => {
               const handleClick = tile.action || (tile.route ? () => commandDispatcher.dispatch('navigate', tile.route) : undefined);
               return (
               <button 
                  key={i}
                  onClick={handleClick}
                  className="group relative flex flex-col items-start p-5 overflow-hidden rounded-[22px] border border-border/80 bg-surface/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] hover:border-transparent text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
               >
                  <div className={`absolute -right-6 -bottom-6 h-32 w-32 rounded-full ${tile.bg} blur-[30px] opacity-40 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-white/5" />
                  
                  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-[14px] ${tile.bg} mb-5 shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                     <tile.icon className={`h-5 w-5 ${tile.color}`} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col w-full">
                     <span className="text-sm font-bold text-text group-hover:text-primary transition-colors tracking-tight">{tile.label}</span>
                     <div className="flex items-center justify-between w-full mt-1 overflow-hidden">
                        <span className="text-[11px] font-semibold text-muted tracking-wide flex items-center gap-1 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">
                           OPEN APP
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100" />
                     </div>
                  </div>
               </button>
               )
            })}
         </div>
      </section>

      {/* 3. Recent Activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text px-1">Upcoming Events</h2>
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
               {[
                  { title: "AI Hackathon 2026", time: "Tomorrow, 9:00 AM", icon: Users },
                  { title: "Guest Lecture: System Design", time: "Friday, 2:00 PM", icon: Building }
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer border border-transparent hover:border-border">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                           <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-medium text-text">{item.title}</p>
                           <p className="text-xs text-muted">{item.time}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text px-1">Latest Notices</h2>
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
               {[
                  { title: "Mid-Semester Examination Schedule", time: "2 hours ago", icon: Bell },
                  { title: "Hostel Fee Payment Deadline", time: "1 day ago", icon: AlertTriangle }
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer border border-transparent hover:border-border">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent-blue/10 text-accent-blue-text flex items-center justify-center shrink-0">
                           <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-medium text-text">{item.title}</p>
                           <p className="text-xs text-muted">{item.time}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  )
}

export function DashboardView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load the Dashboard.">
       <DashboardViewContent />
    </ErrorBoundary>
  )
}

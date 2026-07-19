import * as React from "react"
import { Search, Calendar, MapPin, Bot } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeEvent } from "@/repositories/normalizers"
import { EventItem } from "@/types"
import { RegisterDialog } from "@/components/register-dialog"
import { useAi } from "@/context/ai-context"
import { ErrorBoundary } from "@/components/error-boundary"

const EventCard = React.memo(function EventCard({ event, featured = false }: { event: EventItem, featured?: boolean }) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const isRegistered = event.registered
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-xl border bg-surface flex flex-col ${featured ? 'border-primary/30 shadow-[0_4px_20px_rgba(var(--color-primary),0.1)]' : 'border-border'}`}
    >
      {/* Thumbnail / Hero Banner */}
      <div className="h-40 bg-surface-2 relative flex items-center justify-center overflow-hidden group border-b border-border">
        {event.imageUrl && !imageError ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : event.imageGenerationStatus === "Processing" || event.imageGenerationStatus === "Pending" ? (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center text-primary/80">
            <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mb-3">
              <svg className="w-4 h-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none"><path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-sm font-semibold tracking-wide">Generating Event Cover...</span>
          </div>
        ) : event.imageGenerationStatus === "Failed" ? (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700">
            <div className="text-center">
              <div className="text-2xl mb-2">🎫</div>
              <div className="text-sm font-semibold">Event cover unavailable</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center text-4xl">
            <span className="group-hover:scale-110 transition-transform duration-300">{event.thumbnail || "📅"}</span>
          </div>
        )}
        
        {featured && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-none shadow-md backdrop-blur-md">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text line-clamp-1">{event.title}</h3>
          {event.flag && <Badge variant="outline" className="shrink-0 text-[10px]">{event.flag}</Badge>}
        </div>
        
        <p className="text-xs text-muted line-clamp-2 mb-4 flex-1">
          {event.meta}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> <span>{event.status === 'past' ? 'Completed' : 'Upcoming'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> <span>Campus</span>
          </div>
        </div>

        {isRegistered ? (
          <button className="w-full py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 flex items-center justify-center gap-2" disabled>
             Registered <CheckCircleIcon className="h-3.5 w-3.5" />
          </button>
        ) : event.status === "full" ? (
          <button className="w-full py-2 rounded-lg text-xs font-semibold bg-surface-2 text-muted" disabled>
             Seats Full
          </button>
        ) : (
          <button 
             onClick={() => setDialogOpen(true)}
             className="w-full py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
             Register Now
          </button>
        )}
      </div>
      
      {dialogOpen && (
        <RegisterDialog
          event={event}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onRegistered={() => {}}
        />
      )}
    </motion.div>
  )
})

function CheckCircleIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
}

function EventsViewContent() {
  const { prefillPrompt } = useAi()
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("all")

  // Performance tracking
  const mountTime = React.useRef(performance.now());
  React.useEffect(() => {
    console.log(`[Perf] EventsView mounted at ${performance.now().toFixed(2)}ms`);
    return () => console.log(`[Perf] EventsView unmounted at ${performance.now().toFixed(2)}ms`);
  }, []);

  const queryFn = async () => {
    const start = performance.now();
    console.log(`[Perf] API request start at ${start.toFixed(2)}ms`);
    try {
      const res = await dataProvider.fetch("events", api.getEvents, normalizeEvent);
      console.log(`[Perf] API response received after ${(performance.now() - start).toFixed(2)}ms`);
      return res;
    } catch (e) {
      console.error(`[Perf] API request failed after ${(performance.now() - start).toFixed(2)}ms`, e);
      throw e;
    }
  };

  const { data: eventsList = [], isLoading, isFetching, status, fetchStatus } = useQuery<EventItem[]>({ 
    queryKey: ["events", dataProvider.getScenario()], 
    queryFn: queryFn
  })

  React.useEffect(() => {
    console.log(`[Perf] Component Render | isLoading: ${isLoading} | isFetching: ${isFetching} | status: ${status} | fetchStatus: ${fetchStatus} | Time: ${performance.now().toFixed(2)}ms`);
    if (!isLoading) {
      console.log(`[Perf] Skeleton removed at ${performance.now().toFixed(2)}ms (Took ${(performance.now() - mountTime.current).toFixed(2)}ms from mount)`);
    }
  }, [isLoading, isFetching, status, fetchStatus]);

  const filteredEvents = React.useMemo(() => (eventsList ?? []).filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.meta.toLowerCase().includes(search.toLowerCase())
    if (filter === "open") return matchesSearch && e.status === "open"
    if (filter === "past") return matchesSearch && e.status === "past"
    if (filter === "registered") return matchesSearch && e.registered
    return matchesSearch
  }), [eventsList, search, filter])

  const recommendedEvents = React.useMemo(() => (eventsList ?? []).filter((e) => e.isRecommended), [eventsList])

  return (
    <div className="flex h-full flex-col p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full gap-8 pb-24 lg:pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">Events Hub</h1>
          <p className="text-sm text-muted mt-1">Discover and register for campus events, workshops, and hackathons.</p>
        </div>
        
        <button 
           aria-label="Ask AI for event recommendations"
           onClick={() => prefillPrompt("Recommend some technical events for me.")}
           className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-sm font-medium transition-colors w-fit"
        >
           <Bot className="h-4 w-4" aria-hidden="true" /> Ask AI for Recommendations
        </button>
      </div>

      {/* Recommended Section (AI Curated) */}
      {recommendedEvents.length > 0 && !search && filter === "all" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
             <h2 className="text-lg font-semibold text-text">AI Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedEvents.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-2/50 p-2 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden="true" />
          <Input 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface border-border"
            aria-label="Search events"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Badge 
             variant={filter === "all" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("all")}
          >
            All Events
          </Badge>
          <Badge 
             variant={filter === "open" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("open")}
          >
            Registration Open
          </Badge>
          <Badge 
             variant={filter === "registered" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("registered")}
          >
            Registered
          </Badge>
          <Badge 
             variant={filter === "past" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("past")}
          >
            Past Events
          </Badge>
        </div>
      </div>

      {/* Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-xl border border-border bg-surface-2/30 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
             <Calendar className="h-10 w-10 text-muted mb-4 opacity-50" aria-hidden="true" />
             <h3 className="text-lg font-medium text-text mb-1">No events found</h3>
             <p className="text-sm text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, 50).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export function EventsView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Events.">
       <EventsViewContent />
    </ErrorBoundary>
  )
}

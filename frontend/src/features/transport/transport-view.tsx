import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Bus, Search, MapPin, ChevronDown, ChevronUp, Navigation } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const RouteCard = React.memo(function RouteCard({ route }: { route: any }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text flex items-center gap-2">
                {route.bus_id}
                <Badge variant="outline" className="text-[10px] uppercase bg-surface-2">{route.vehicle_type}</Badge>
              </h3>
              <p className="text-sm text-muted font-medium mt-0.5">{route.route_name}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-surface-2/50 p-3 rounded-xl mb-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-text">
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0" /> From: {route.from_stop}
          </div>
          <div className="flex items-center gap-2 text-text">
            <Navigation className="h-4 w-4 text-indigo-500 shrink-0" /> To: {route.to_stop}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-semibold text-muted">{route.stops?.length || 0} Stops</span>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-lg"
          >
            {expanded ? "Hide Details" : "View Route"} {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-surface-2/30"
          >
            <div className="p-5">
              <h4 className="text-sm font-bold text-text mb-4 uppercase tracking-wider text-muted">Route Timeline</h4>
              <div className="relative pl-4 border-l-2 border-border ml-2 flex flex-col gap-4">
                {route.stops?.map((stop: string, idx: number) => (
                  <div key={idx} className="relative flex items-center text-sm font-medium text-text">
                    <span className={`absolute -left-[23px] h-2.5 w-2.5 rounded-full border-2 border-surface ${idx === 0 ? 'bg-emerald-500' : idx === route.stops.length - 1 ? 'bg-indigo-500' : 'bg-primary'}`} />
                    {stop}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export function TransportView() {
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")

  const { data, isLoading } = useQuery({
    queryKey: ["transport"],
    queryFn: () => api.getTransport()
  })

  const routes = data || []
  
  const filtered = React.useMemo(() => (data || []).filter((r: any) => {
    const matchesSearch = 
      r.bus_id?.toLowerCase().includes(search.toLowerCase()) ||
      r.route_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.stops?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))

    if (filter === "All") return matchesSearch
    return matchesSearch && r.vehicle_type?.toLowerCase() === filter.toLowerCase()
  }), [data, search, filter])

  return (
    <div className="flex h-full flex-col p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full gap-8 animate-in fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">Campus Transport</h1>
        <p className="text-sm text-muted mt-1">Bus and van routes, stops, and schedules.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface-2/50 p-2 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Search by route, bus number, or stop..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface border-none"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Bus", "Van"].map(f => (
            <Badge 
              key={f}
              variant={filter === f ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-surface-2 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
          <Bus className="h-10 w-10 text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text mb-1">No routes found</h3>
          <p className="text-sm text-muted">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r: any) => <RouteCard key={r.id} route={r} />)}
        </div>
      )}
    </div>
  )
}

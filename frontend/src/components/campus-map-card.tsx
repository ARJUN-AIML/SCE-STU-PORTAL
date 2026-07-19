import * as React from "react"
import { Map, Search, MapPin, Navigation, Bot } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAi } from "@/context/ai-context"

export function CampusMapCard() {
  const { prefillPrompt } = useAi()
  const [search, setSearch] = React.useState("")
  const [queryVal, setQueryVal] = React.useState("")
  
  const { data: locationData, isLoading, isError, refetch } = useQuery({ 
    queryKey: ["location", queryVal], 
    queryFn: () => api.getLocation(queryVal),
    enabled: !!queryVal,
    retry: false 
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQueryVal(search)
  }

  const isDemo = isError || (!locationData && queryVal)
  const displayLocation = isDemo && queryVal ? {
    building: "RV Block",
    floor: "3rd Floor",
    room: queryVal,
    landmark: "Next to CS Dept Office"
  } : locationData

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-surface to-surface-2 overflow-hidden relative border-border/60">
      {/* Decorative background mapping lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-primary" />
            <CardTitle>Campus Map</CardTitle>
            {isDemo && queryVal && <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-600/30 bg-yellow-500/10">Demo</Badge>}
          </div>
          <button 
            onClick={() => prefillPrompt(`Where is the ${queryVal || 'AI Lab'}?`)}
            className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
          >
            Ask AI <Bot className="h-3 w-3" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 pt-2 relative z-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search building, room, lab..." 
              className="pl-9 h-8 text-xs bg-bg border-border focus-visible:ring-1" 
            />
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs">Find</Button>
        </form>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-border/50 rounded-xl bg-bg/50 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-bounce rounded-full bg-primary/20 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted">Locating...</p>
            </div>
          ) : !queryVal ? (
            <div className="flex flex-col items-center gap-2 text-muted">
              <MapPin className="h-8 w-8 opacity-20" />
              <p className="text-xs">Search for a room or building to get directions.</p>
            </div>
          ) : displayLocation ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-text">{displayLocation.room || queryVal}</h4>
                <p className="text-xs font-medium text-primary">{displayLocation.building}</p>
                <p className="text-xs text-muted">{displayLocation.floor}</p>
              </div>
              {displayLocation.landmark && (
                <div className="mt-2 text-[10px] bg-surface-2 px-3 py-1.5 rounded-full text-muted w-full truncate">
                  📍 {displayLocation.landmark}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <p className="text-xs">Location not found.</p>
              <button onClick={() => refetch()} className="text-[10px] text-primary hover:underline">Retry Search</button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

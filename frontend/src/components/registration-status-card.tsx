import * as React from "react"
import { CheckCircle2, Ticket } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeEvent, normalizeClub } from "@/repositories/normalizers"
import { EventItem, ClubItem } from "@/types"
import { ErrorBoundary } from "@/components/error-boundary"

function RegistrationStatusCardContent() {
  const { data: events = [] } = useQuery<EventItem[]>({ 
    queryKey: ["events", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("events", api.getEvents, normalizeEvent) 
  })
  
  const { data: clubs = [] } = useQuery<ClubItem[]>({ 
    queryKey: ["clubs", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("clubs", api.getClubs, normalizeClub) 
  })

  // Since there is no explicit real endpoint returning user registrations, we safely check if any event/club in the data 
  // is marked as registered for the demo.
  const activeRegistrations = [...(events ?? []), ...(clubs ?? [])]
    .filter((item) => item.registered === true)
    .slice(0, 3)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Active Registrations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {activeRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6 h-full border border-dashed border-border rounded-xl bg-surface-2/30">
             <div className="h-10 w-10 bg-surface-2 rounded-full flex items-center justify-center mb-3">
                <Ticket className="h-5 w-5 text-muted" />
             </div>
             <p className="text-sm font-medium text-text mb-1">No Active Passes</p>
             <p className="text-xs text-muted mb-4">You haven't signed up for any upcoming events or clubs yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRegistrations.map((reg, i) => {
              const type = "seatsLeft" in reg ? "Event" : "Club"
              return (
                <div key={reg.id || i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors cursor-pointer group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                     <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{reg.title}</h4>
                     <p className="text-xs text-muted truncate">{type} Pass Active</p>
                  </div>
                  <div className="shrink-0 text-[10px] font-medium px-2 py-1 bg-surface-2 rounded text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     View
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RegistrationStatusCard() {
  return (
    <ErrorBoundary fallbackMessage="Could not load your registrations.">
       <RegistrationStatusCardContent />
    </ErrorBoundary>
  )
}

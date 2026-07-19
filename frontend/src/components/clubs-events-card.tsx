import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSettings } from "@/context/app-settings"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { RegisterDialog } from "@/components/register-dialog"
import { useAi } from "@/context/ai-context"
import { Bot } from "lucide-react"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeEvent, normalizeClub } from "@/repositories/normalizers"
import { EventItem, ClubItem } from "@/types"
import { ErrorBoundary } from "@/components/error-boundary"

function EventRow({
  item,
  isRegistered,
  onRegister,
  type
}: {
  item: EventItem | ClubItem
  isRegistered: boolean
  onRegister: (item: EventItem | ClubItem, type: string) => void
  type: string
}) {
  const title = item?.title ?? "Untitled"
  const meta = item?.meta ?? "Info"
  const status = item?.status ?? "open"
  
  // Safe extraction for Event specific fields
  const seatsLeft = type === "event" ? (item as EventItem)?.seatsLeft : undefined
  
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-xl">
        {item?.thumbnail || (type === "club" ? "👥" : "📅")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">
          {title} {(item as EventItem)?.flag ?? ""}
        </p>
        <p className="truncate text-xs text-muted mb-1">{meta}</p>
        {type === "event" && status === "open" && !isRegistered && seatsLeft !== undefined && (
          <p className="text-[10px] font-medium text-orange-500">{seatsLeft} Seats Left</p>
        )}
      </div>
      {isRegistered ? (
        <Badge variant="green" className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Registered
        </Badge>
      ) : status === "full" ? (
        <Badge variant="outline">Full</Badge>
      ) : (
        <Button size="sm" onClick={() => onRegister(item, type)}>
          {type === "event" ? "Register" : "Apply"}
        </Button>
      )}
    </div>
  )
}

function ClubsEventsCardContent() {
  const { t } = useAppSettings()
  const { prefillPrompt } = useAi()
  
  const { data: clubs = [], isLoading: loadingClubs, isError: errorClubs, refetch: refetchClubs } = useQuery<ClubItem[]>({ 
    queryKey: ["clubs", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("clubs", api.getClubs, normalizeClub), 
    retry: false 
  })
  
  const { data: events = [], isLoading: loadingEvents, isError: errorEvents, refetch: refetchEvents } = useQuery<EventItem[]>({ 
    queryKey: ["events", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("events", api.getEvents, normalizeEvent), 
    retry: false 
  })
  
  const [activeEvent, setActiveEvent] = React.useState<EventItem | ClubItem | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [registeredIds, setRegisteredIds] = React.useState<Set<string>>(new Set(["Hackathon"]))

  function openRegister(item: EventItem | ClubItem, _type: string) {
    setActiveEvent(item)
    setDialogOpen(true)
  }

  function handleRegistered(id: string) {
    setRegisteredIds((prev) => new Set(prev).add(id))
  }

  const isErrorCombined = errorClubs || errorEvents

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t("clubsEvents")}</CardTitle>
          {isErrorCombined && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-danger border-danger/30 bg-danger/10">
                Failed to load
              </Badge>
              <button onClick={() => { refetchClubs(); refetchEvents() }} className="text-[10px] text-primary hover:underline">Retry</button>
            </div>
          )}
        </div>
        <button 
          onClick={() => prefillPrompt("Explain Hackathon eligibility.")}
          className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline mt-1"
        >
          Ask AI <Bot className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="clubs">{t("clubs")}</TabsTrigger>
            <TabsTrigger value="events">{t("events")}</TabsTrigger>
          </TabsList>
          <TabsContent value="clubs">
            <div className="divide-y divide-border">
              {loadingClubs ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-surface-2" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                    </div>
                  </div>
                ))
              ) : (clubs ?? []).length === 0 && !errorClubs ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted">
                  <p>No clubs found.</p>
                  <button onClick={() => refetchClubs()} className="text-xs text-primary hover:underline">Retry</button>
                </div>
              ) : (
                (clubs ?? []).map((c) => (
                  <EventRow key={c.id} item={c} type="club" isRegistered={registeredIds.has(c.id)} onRegister={openRegister} />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="events">
            <div className="divide-y divide-border">
              {loadingEvents ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-surface-2" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                    </div>
                  </div>
                ))
              ) : (events ?? []).length === 0 && !errorEvents ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted">
                  <p>No events found.</p>
                  <button onClick={() => refetchEvents()} className="text-xs text-primary hover:underline">Retry</button>
                </div>
              ) : (
                (events ?? []).map((e) => (
                  <EventRow key={e.id} item={e} type="event" isRegistered={registeredIds.has(e.id)} onRegister={openRegister} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {dialogOpen && activeEvent && (
        <RegisterDialog
          event={activeEvent as EventItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onRegistered={handleRegistered}
        />
      )}
    </Card>
  )
}

export function ClubsEventsCard() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Clubs & Events.">
       <ClubsEventsCardContent />
    </ErrorBoundary>
  )
}

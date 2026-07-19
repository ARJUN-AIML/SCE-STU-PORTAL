import * as React from "react"
import { Bot, Paperclip } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSettings } from "@/context/app-settings"
import { useAi } from "@/context/ai-context"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeNotice } from "@/repositories/normalizers"
import { Notice } from "@/types"
import { ErrorBoundary } from "@/components/error-boundary"

function NoticesCardContent() {
  const { t } = useAppSettings()
  const { prefillPrompt } = useAi()
  
  const { data: notices = [], isLoading, isError, refetch } = useQuery<Notice[]>({ 
    queryKey: ["notices", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("notices", api.getNotices, normalizeNotice), 
    retry: false 
  })

  const isErrorCombined = isError

  const displayNotices = (notices ?? []).slice(0, 5)

  function getBadgeVariant(cat: string) {
    const category = (cat ?? "").toLowerCase()
    if (category === "urgent") return "destructive"
    if (category === "event") return "green"
    return "secondary"
  }

  function formatDate(d: string) {
    if (!d) return ""
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return ""
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{t("notices")}</CardTitle>
            {isErrorCombined && (
              <Badge variant="outline" className="text-[10px] text-danger border-danger/30 bg-danger/10">
                Failed to load
              </Badge>
            )}
          </div>
          <button 
            onClick={() => prefillPrompt("Are there any urgent notices today?")}
            className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
          >
            Ask AI <Bot className="h-3 w-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin pr-2">
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-surface-2 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-surface-2" />
                  <div className="h-2 w-1/4 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            ))
          ) : displayNotices.length === 0 ? (
             <div className="py-8 text-center text-sm text-muted">
                <p>No new notices.</p>
                {isError && <button onClick={() => refetch()} className="text-xs text-primary hover:underline mt-2">Retry</button>}
             </div>
          ) : (
            displayNotices.map((notice) => (
              <div key={notice.id} className="group flex gap-3 items-start relative cursor-pointer p-2 -mx-2 hover:bg-surface-2 rounded-lg transition-colors">
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notice.isUrgent ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-primary'}`} />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium leading-tight text-text group-hover:text-primary transition-colors">
                      {notice.title}
                    </p>
                    <Badge variant={getBadgeVariant(notice.category) as any} className="shrink-0 text-[10px] px-1.5 py-0 capitalize">
                      {notice.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{formatDate(notice.date)}</span>
                    {notice.fileUrl && (
                      <span className="flex items-center gap-1 text-primary">
                        <Paperclip className="h-3 w-3" /> Attachment
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function NoticesCard() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Notices.">
       <NoticesCardContent />
    </ErrorBoundary>
  )
}

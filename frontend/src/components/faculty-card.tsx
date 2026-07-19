import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppSettings } from "@/context/app-settings"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeFaculty } from "@/repositories/normalizers"
import { Faculty } from "@/types"
import { ErrorBoundary } from "@/components/error-boundary"
import { useAi } from "@/context/ai-context"
import { Bot, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

function FacultyCardContent() {
  const { t } = useAppSettings()
  const { prefillPrompt } = useAi()
  const [search, setSearch] = React.useState("")
  
  const { data: facultyList = [], isLoading, isError, refetch } = useQuery<Faculty[]>({ 
    queryKey: ["faculty", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("faculty", api.getFaculty, normalizeFaculty), 
    retry: false 
  })

  const isErrorCombined = isError

  const filtered = (facultyList ?? []).filter((f) => 
    (f.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) ||
    (f.department ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{t("faculty")}</CardTitle>
            {isErrorCombined && (
              <Badge variant="outline" className="text-[10px] text-danger border-danger/30 bg-danger/10">
                Failed to load
              </Badge>
            )}
          </div>
          <button 
            onClick={() => prefillPrompt("When is Dr. Smith available?")}
            className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
          >
            Ask AI <Bot className="h-3 w-3" />
          </button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <Input 
            placeholder="Search faculty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-surface-2 border-none"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin pr-2">
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
             <div className="py-8 text-center text-sm text-muted">
                <p>No faculty found.</p>
                {isError && <button onClick={() => refetch()} className="text-xs text-primary hover:underline mt-2">Retry</button>}
             </div>
          ) : (
            filtered.map((faculty) => (
              <div key={faculty.id} className="flex items-center justify-between group cursor-pointer hover:bg-surface-2 p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={faculty.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {(faculty.name ?? "F").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                      {faculty.name}
                    </p>
                    <p className="text-xs text-muted">{faculty.role} • {faculty.department}</p>
                  </div>
                </div>
                <Badge variant={faculty.status === "available" ? "green" : "outline"} className="mt-1">
                  {faculty.status === "available" ? "Available Now" : "Busy"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function FacultyCard() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Faculty Directory.">
       <FacultyCardContent />
    </ErrorBoundary>
  )
}

import React, { useState, useEffect } from "react"
import { Search, Calendar, Users, GraduationCap, Map, Bot, FileText, ArrowRight, Building2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { commandDispatcher } from "@/core/commands/dispatcher"
import { normalizeEvent, normalizeClub, normalizeFaculty, normalizeNotice, normalizeSchedule, normalizeResource, normalizeTransport } from "@/repositories/normalizers"

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Use Ctrl+K or Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onOpenChange, open])

  // Debounced search across datasets
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true)
        try {
          const [events, faculty, clubs, notices, schedule, resources, transport] = await Promise.all([
             dataProvider.fetch("events", api.getEvents, normalizeEvent),
             dataProvider.fetch("faculty", api.getFaculty, normalizeFaculty),
             dataProvider.fetch("clubs", api.getClubs, normalizeClub),
             dataProvider.fetch("notices", api.getNotices, normalizeNotice),
             dataProvider.fetch("schedule", api.getSchedule, normalizeSchedule),
             dataProvider.fetch("resources", api.getResources, normalizeResource),
             dataProvider.fetch("transport", api.getTransport, normalizeTransport)
          ])

          const q = query.toLowerCase()
          
          const searchResults = {
             Events: (events as any[]).filter(e => (e.title || "").toLowerCase().includes(q) || (e.meta || "").toLowerCase().includes(q)),
             Faculty: (faculty as any[]).filter(f => (f.name || "").toLowerCase().includes(q) || (f.department || "").toLowerCase().includes(q)),
             Departments: (faculty as any[]).filter(f => (f.department || "").toLowerCase().includes(q)).reduce((acc: any[], curr: any) => {
                 if(!acc.find((a: any) => a.title === curr.department)) { acc.push({ title: curr.department, type: "department" }) }
                 return acc;
             }, []),
             Clubs: (clubs as any[]).filter(c => (c.title || "").toLowerCase().includes(q)),
             Notices: (notices as any[]).filter(n => (n.title || "").toLowerCase().includes(q)),
             Timetable: (schedule as any[]).filter(s => (s.subject || "").toLowerCase().includes(q) || (s.faculty || "").toLowerCase().includes(q) || (s.room || "").toLowerCase().includes(q)),
             Resources: (resources as any[]).filter(r => (r.title || "").toLowerCase().includes(q) || (r.type || "").toLowerCase().includes(q)),
             Transport: (transport as any[]).filter(t => (t.routeName || "").toLowerCase().includes(q) || (t.busNumber || "").toLowerCase().includes(q)),
          }
          setResults(searchResults)
        } catch (error) {
          console.error("Search failed:", error)
          setResults({ Events: [], Faculty: [], Clubs: [], Notices: [] })
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults(null)
      }
    }, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "events": return <Calendar className="h-4 w-4 text-pink-500" />
      case "faculty": return <Users className="h-4 w-4 text-cyan-500" />
      case "departments": return <Building2 className="h-4 w-4 text-indigo-500" />
      case "clubs": return <GraduationCap className="h-4 w-4 text-emerald-500" />
      case "notices": return <FileText className="h-4 w-4 text-blue-500" />
      case "timetable": return <Calendar className="h-4 w-4 text-purple-500" />
      case "resources": return <FileText className="h-4 w-4 text-amber-500" />
      case "transport": return <Building2 className="h-4 w-4 text-teal-500" />
      default: return <FileText className="h-4 w-4 text-muted" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0 border-border bg-surface shadow-lg rounded-xl">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments, faculty, events, resources..."
            className="flex-1 bg-transparent text-text font-medium outline-none placeholder:text-muted/60"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface-2 px-1.5 font-mono text-[10px] font-medium text-muted">
            ESC
          </kbd>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="px-2 py-4">
              <p className="text-xs font-semibold text-muted mb-2 px-2 uppercase tracking-wider">Quick Links</p>
              <div className="space-y-1">
                <button onClick={() => { onOpenChange(false); commandDispatcher.dispatch('openAiDrawer', ''); }} className="w-full flex items-center px-3 py-2 text-sm text-text hover:bg-surface-2 rounded-lg transition-colors">
                  <Bot className="h-4 w-4 mr-3 text-primary" /> Ask Campus AI
                </button>
                <button onClick={() => { onOpenChange(false); window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}); }} className="w-full flex items-center px-3 py-2 text-sm text-text hover:bg-surface-2 rounded-lg transition-colors">
                  <Map className="h-4 w-4 mr-3 text-primary" /> Navigate Campus Map
                </button>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="p-6 text-center text-sm text-muted animate-pulse">Searching the campus...</div>
          )}

          {!isSearching && results && (
            <div className="py-2">
              {Object.entries(results).map(([category, items]: [string, any]) => {
                if (!items || items.length === 0) return null
                return (
                  <div key={category} className="mb-4 last:mb-0">
                    <p className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider mb-1">{category}</p>
                    <div className="space-y-1 px-2">
                      {items.slice(0, 5).map((item: any, i: number) => (
                        <button key={i} className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text hover:bg-surface-2 rounded-lg transition-colors group">
                          <div className="flex items-center">
                            {getIcon(category.toLowerCase())}
                            <span className="ml-3 font-medium text-left">
                              {item.title || item.name || item.subject}
                              <span className="ml-2 text-xs text-muted font-normal">
                                {item.department || item.role || item.meta || item.faculty || item.type || ""}
                              </span>
                            </span>
                          </div>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              {Object.values(results).every((arr: any) => !arr || arr.length === 0) && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <Search className="h-8 w-8 text-muted/30 mb-3" />
                  <p className="text-sm font-medium text-text">No results found</p>
                  <p className="text-xs text-muted mt-1 mb-4">We couldn't find an exact match for "{query}".</p>
                  <button 
                    onClick={() => {
                      onOpenChange(false)
                      setTimeout(() => commandDispatcher.dispatch('openAiDrawer', query), 100)
                    }}
                    className="flex items-center gap-2 bg-surface border border-border hover:bg-surface-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Bot className="h-4 w-4 text-primary" /> Ask Campus AI Copilot
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

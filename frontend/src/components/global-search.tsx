import * as React from "react"
import { Search, Map as MapIcon, Calendar, FileText, Building, Users } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"


export function GlobalSearch({ open, onOpenChange, onNavigate }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onNavigate: (route: string) => void;
}) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`)
        const json = await res.json()
        if (json.success) {
          setResults(json.data)
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (route: string) => {
    onNavigate(route)
    onOpenChange(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <div className="flex items-center px-4 py-3 border-b border-border/50 bg-white/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
            placeholder="Search faculty, events, buildings, notices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {!query && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type to search the entire campus directory...
            </div>
          )}

          {loading && (
            <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
              Searching...
            </div>
          )}

          {results && !loading && (
            <div className="space-y-4 p-2">
              {results.departments?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2 flex items-center gap-2">
                    <Building className="h-3 w-3" /> Departments
                  </div>
                  {results.departments.map((d: any) => (
                    <button key={d.id} onClick={() => handleSelect("departments")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3">
                      <span>{d.title}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {results.faculty?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2 flex items-center gap-2">
                    <Users className="h-3 w-3" /> Faculty
                  </div>
                  {results.faculty.map((f: any) => (
                    <button key={f.id} onClick={() => handleSelect("departments")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3">
                      <span>{f.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.events?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Events
                  </div>
                  {results.events.map((e: any) => (
                    <button key={e.id} onClick={() => handleSelect("events")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3">
                      <span>{e.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.buildings?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2 flex items-center gap-2">
                    <MapIcon className="h-3 w-3" /> Buildings
                  </div>
                  {results.buildings.map((b: any) => (
                    <button key={b.id} onClick={() => handleSelect("map")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3">
                      <span>{b.title}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {results.notices?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2 flex items-center gap-2">
                    <FileText className="h-3 w-3" /> Notices
                  </div>
                  {results.notices.map((n: any) => (
                    <button key={n.id} onClick={() => handleSelect("notices")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3">
                      <span>{n.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {Object.values(results).every((arr: any) => arr.length === 0) && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

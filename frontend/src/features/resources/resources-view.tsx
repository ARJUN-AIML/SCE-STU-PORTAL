import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeResource } from "@/repositories/normalizers"
import { ResourceItem } from "@/types"
import { FileText, Download, Calendar, BookOpen, FileSignature, CreditCard, Compass, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ErrorBoundary } from "@/components/error-boundary"
import { useAuth } from "@/context/auth-context"

function ResourcesViewContent() {
  const { data: resources = [], isLoading, isError, refetch } = useQuery<ResourceItem[]>({
    queryKey: ["resources"],
    queryFn: () => dataProvider.fetch("resources", api.getResources, normalizeResource)
  })

  const { requireAuth } = useAuth()
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState("all")

  const filteredResources = resources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === "all" || item.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const categories = ["all", "Academic", "Handbook", "Forms", "Scholarships", "Placements", "General"]

  const getIcon = (title: string) => {
    const t = (title || "").toLowerCase()
    if (t.includes("calendar")) return Calendar
    if (t.includes("handbook") || t.includes("syllabus")) return BookOpen
    if (t.includes("form") || t.includes("guide")) return FileSignature
    if (t.includes("fee")) return CreditCard
    if (t.includes("placement")) return Compass
    return FileText
  }

  const handleDownload = (link: string, isRestricted: boolean) => {
    if (isRestricted) {
       requireAuth(() => {
          window.open(link, "_blank")
       })
       return
    }
    window.open(link, "_blank")
  }

  if (isLoading) return <div className="p-8"><div className="h-32 animate-pulse rounded-lg bg-surface-2" /></div>
  if (isError) return <div role="alert" className="mx-auto max-w-6xl p-8 text-center"><p className="text-text">Resources are temporarily unavailable.</p><button onClick={() => refetch()} className="mt-4 px-4 py-2 rounded-lg border border-border">Retry</button></div>

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:p-6 animate-in fade-in-0 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text font-display">
            Student Resources
          </h1>
          <p className="text-sm text-muted mt-1">
            Download academic calendars, forms, handbooks, and more.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Search resources..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-surface border-border text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors capitalize ${filter === c ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-surface-2 text-text hover:bg-border'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl">
            <Compass className="h-10 w-10 text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-text mb-1">No resources found</h3>
            <p className="text-sm text-muted">Try adjusting your search filters.</p>`n             <button onClick={() => window.location.reload()} className="px-4 py-2 mt-4 bg-surface-2 text-text text-sm rounded-lg border border-border hover:bg-border transition-colors">Refresh Data</button>
         </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResources.map((resource) => {
               const Icon = getIcon(resource.title)
               const isRestricted = resource.category.toLowerCase() === "forms" || resource.category.toLowerCase() === "scholarships"
               return (
                  <div
                     key={resource.id}
                     className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:border-primary/50 hover:shadow-md"
                  >
                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-primary transition-colors group-hover:bg-primary/10">
                        <Icon className="h-6 w-6" />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors mb-1 line-clamp-2">
                           {resource.title}
                        </h3>
                        <p className="text-[10px] text-muted uppercase tracking-wider">{resource.category}</p>
                     </div>
                     <button
                        onClick={() => handleDownload(resource.link, isRestricted)}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-surface-2 hover:bg-border px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                     >
                        <Download className="h-3 w-3" /> {isRestricted ? "Secure Download" : "Download"}
                     </button>
                  </div>
               )
            })}
         </div>
      )}

    </div>
  )
}

export function ResourcesView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Resources module.">
      <ResourcesViewContent />
    </ErrorBoundary>
  )
}


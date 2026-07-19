import * as React from "react"
import { Search, Mail, MapPin, BookOpen, Bot } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeFaculty } from "@/repositories/normalizers"
import { Faculty } from "@/types"
import { useAi } from "@/context/ai-context"
import { ErrorBoundary } from "@/components/error-boundary"

const FacultyCard = React.memo(function FacultyCard({ faculty }: { faculty: Faculty }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-surface flex flex-col p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarImage src={faculty.avatar} alt={faculty.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
            {faculty.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Badge variant={faculty.status === "available" ? "green" : "outline"} className="text-[10px] capitalize">
          {faculty.status}
        </Badge>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-text text-lg group-hover:text-primary transition-colors">{faculty.name}</h3>
        <p className="text-sm text-primary font-medium mb-1">{faculty.role}</p>
        <p className="text-xs text-muted mb-4">{faculty.department}</p>

        <div className="space-y-2 text-xs text-muted mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{faculty.email || "Contact unavailable"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{faculty.office || "Location unavailable"}</span>
          </div>
        </div>

        {faculty.expertise.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-text mb-2">
              <BookOpen className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> Expertise
            </div>
            <div className="flex flex-wrap gap-1.5">
              {faculty.expertise.slice(0, 3).map((exp, i) => (
                <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 bg-surface-2 border-none text-muted">
                  {exp}
                </Badge>
              ))}
              {faculty.expertise.length > 3 && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-surface-2 border-none text-muted">
                  +{faculty.expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <button className="text-xs font-medium text-primary hover:underline px-2 py-1 -ml-2 rounded hover:bg-primary/10 transition-colors">
          View Profile
        </button>
        <button className="text-xs font-medium text-text bg-surface-2 hover:bg-border px-3 py-1.5 rounded-md transition-colors shadow-sm">
          Book Appt
        </button>
      </div>
    </motion.div>
  )
})

function FacultyViewContent() {
  const { prefillPrompt } = useAi()
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("all")

  const { data: facultyList = [], isLoading } = useQuery<Faculty[]>({ 
    queryKey: ["faculty", dataProvider.getScenario()], 
    queryFn: () => dataProvider.fetch("faculty", api.getFaculty, normalizeFaculty) 
  })

  const filteredFaculty = React.useMemo(() => (facultyList ?? []).filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.department.toLowerCase().includes(search.toLowerCase()) ||
                          f.expertise.some(exp => exp.toLowerCase().includes(search.toLowerCase()))
    
    if (filter === "available") return matchesSearch && f.status === "available"
    if (filter !== "all" && filter !== "available") return matchesSearch && f.department.toLowerCase() === filter.toLowerCase()
    
    return matchesSearch
  }), [facultyList, search, filter])

  // Extract unique departments for the filter
  const departments = React.useMemo(() => Array.from(new Set((facultyList ?? []).map(f => f.department))).filter(Boolean), [facultyList])

  return (
    <div className="flex h-full flex-col p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full gap-8 pb-24 lg:pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">Faculty Directory</h1>
          <p className="text-sm text-muted mt-1">Connect with professors, researchers, and academic advisors.</p>
        </div>
        
        <button 
           aria-label="Ask AI for faculty recommendations"
           onClick={() => prefillPrompt("Who teaches Machine Learning?")}
           className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-sm font-medium transition-colors w-fit"
        >
           <Bot className="h-4 w-4" aria-hidden="true" /> Ask AI for Faculty
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-2/50 p-2 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden="true" />
          <Input 
            placeholder="Search by name, department, expertise..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface border-border text-xs"
            aria-label="Search faculty"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Badge 
             variant={filter === "all" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge 
             variant={filter === "available" ? "default" : "outline"} 
             className="cursor-pointer shrink-0"
             onClick={() => setFilter("available")}
          >
            Available Now
          </Badge>
          <div className="w-px h-4 bg-border mx-1 shrink-0" />
          {departments.map(dept => (
            <Badge 
               key={dept}
               variant={filter === dept ? "default" : "outline"} 
               className="cursor-pointer shrink-0"
               onClick={() => setFilter(dept)}
            >
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-64 rounded-xl border border-border bg-surface-2/30 animate-pulse" />
            ))}
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
             <Search className="h-10 w-10 text-muted mb-4 opacity-50" aria-hidden="true" />
             <h3 className="text-lg font-medium text-text mb-1">No faculty found</h3>
             <p className="text-sm text-muted">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.slice(0, 50).map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export function FacultyView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Faculty Directory.">
       <FacultyViewContent />
    </ErrorBoundary>
  )
}

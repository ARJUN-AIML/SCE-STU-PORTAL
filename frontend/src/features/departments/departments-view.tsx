import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { normalizeFaculty, normalizeDepartment } from "@/repositories/normalizers"
import { Faculty, Department } from "@/types"
import { Building, GraduationCap, MapPin, Mail, ChevronRight, Search, ArrowLeft, BookOpen, Users, Award } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const FacultyCard = React.memo(function FacultyCard({ faculty }: { faculty: Faculty }) {
  const isHOD = faculty.role?.toLowerCase().includes("hod") || faculty.administrativeRole?.toLowerCase().includes("hod")
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border bg-surface flex flex-col p-5 group hover:shadow-md transition-all ${isHOD ? 'border-primary/50 shadow-sm bg-primary/5' : 'border-border'}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className={`h-16 w-16 border-2 ${isHOD ? 'border-primary' : 'border-border'}`}>
          <AvatarImage src={faculty.avatar} alt={faculty.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
            {faculty.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-text text-lg group-hover:text-primary transition-colors leading-tight mb-1">{faculty.name}</h3>
          
          <div className="flex flex-col gap-1 mt-1">
            {faculty.administrativeRole && (
              <Badge variant="default" className="w-fit text-[10px] px-1.5 py-0 bg-primary text-primary-foreground font-semibold">
                {faculty.administrativeRole}
              </Badge>
            )}
            <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 bg-surface-2 text-muted border-border">
              {faculty.role}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 text-xs text-muted mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          <span className="truncate text-text font-medium">{faculty.email || "Not Available"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          <span className="text-text">{faculty.office || "Not Available"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          <span className="text-text">{faculty.qualification || "Not specified"}</span>
        </div>
      </div>

      {faculty.expertise && faculty.expertise.length > 0 && (
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text mb-2">
            <BookOpen className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> Specialization
          </div>
          <div className="flex flex-wrap gap-1.5">
            {faculty.expertise.map((exp, i) => (
              <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">
                {exp}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
})

function DepartmentsViewContent() {
  const [selectedDept, setSelectedDept] = React.useState<Department | null>(null)
  const [search, setSearch] = React.useState("")

  // Fetch Departments
  const { data: departments = [], isLoading: isLoadingDepts, isError: isErrorDepts, refetch: refetchDepts } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await api.getDepartments()
      return Array.isArray(data) ? data.map(normalizeDepartment) : []
    }
  })

  // Fetch Faculty (only when a department is selected)
  const { data: facultyList = [], isLoading: isLoadingFaculty } = useQuery<Faculty[]>({
    queryKey: ["department-faculty", selectedDept?.id],
    queryFn: async () => {
      if (!selectedDept?.id) return []
      const data = await api.getDepartmentFaculty(selectedDept.id)
      return Array.isArray(data) ? data.map(normalizeFaculty) : []
    },
    enabled: !!selectedDept?.id
  })

  const filteredFaculty = React.useMemo(() => facultyList.filter(f => {
    return f.name.toLowerCase().includes(search.toLowerCase()) ||
           f.role.toLowerCase().includes(search.toLowerCase()) ||
           (f.administrativeRole || "").toLowerCase().includes(search.toLowerCase()) ||
           (f.specialization || "").toLowerCase().includes(search.toLowerCase())
  }), [facultyList, search])

  if (isLoadingDepts) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
        <div className="h-8 w-64 bg-surface-2 animate-pulse rounded mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 rounded-2xl bg-surface-2 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (isErrorDepts) {
    return (
      <div role="alert" className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center p-20 text-center border border-dashed border-border rounded-xl mt-10">
        <p className="text-text font-medium text-lg mb-2">Academic records are temporarily unavailable.</p>
        <button onClick={() => refetchDepts()} className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm">Retry Connection</button>
      </div>
    )
  }

  // --- DEDICATED FACULTY PAGE MODE ---
  if (selectedDept) {

    const hods = filteredFaculty.filter(f => f.role.toLowerCase().includes("hod") || (f.administrativeRole || "").toLowerCase().includes("hod") || (f.administrativeRole || "").toLowerCase().includes("head"));
    const professors = filteredFaculty.filter(f => !hods.includes(f) && f.role.toLowerCase().includes("professor") && !f.role.toLowerCase().includes("associate") && !f.role.toLowerCase().includes("assistant"));
    const associateProfessors = filteredFaculty.filter(f => !hods.includes(f) && f.role.toLowerCase().includes("associate professor"));
    const assistantProfessors = filteredFaculty.filter(f => !hods.includes(f) && f.role.toLowerCase().includes("assistant professor"));
    const others = filteredFaculty.filter(f => !hods.includes(f) && !professors.includes(f) && !associateProfessors.includes(f) && !assistantProfessors.includes(f));

    const Section = ({ title, faculty }: { title: string, faculty: Faculty[] }) => {
      if (faculty.length === 0) return null;
      return (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {faculty.map(f => (
              <FacultyCard key={f.id} faculty={f} />
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6 animate-in fade-in-0 duration-300">
        <button 
          onClick={() => {
             setSelectedDept(null)
             setSearch("")
          }}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </button>

        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text font-display flex items-center gap-3">
            {selectedDept.name}
            {selectedDept.code && (
              <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted">
                {selectedDept.code}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted mt-1">
            Directory of {selectedDept.facultyCount} faculty members.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-2/50 p-2 rounded-xl border border-border">
          <div className="relative w-full sm:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden="true" />
            <Input 
              placeholder="Search by name, designation, specialization..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface border-border text-sm w-full"
              aria-label="Search faculty"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        {isLoadingFaculty ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 rounded-xl bg-surface-2 animate-pulse" />)}
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
             <Users className="h-10 w-10 text-muted mb-4 opacity-50" aria-hidden="true" />
             <h3 className="text-lg font-medium text-text mb-1">No faculty records found</h3>
             <p className="text-sm text-muted">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <Section title="Head of Department" faculty={hods} />
            <Section title="Professors" faculty={professors} />
            <Section title="Associate Professors" faculty={associateProfessors} />
            <Section title="Assistant Professors" faculty={assistantProfessors} />
            <Section title="Other Faculty" faculty={others} />
          </div>
        )}
      </div>
    )
  }

  // --- DEPARTMENTS DIRECTORY MODE ---
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6 animate-in fade-in-0 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text font-display">
          Academic Departments
        </h1>
        <p className="text-sm text-muted mt-1">
          Explore programs, faculty counts, and organizational structure.
        </p>
      </div>

      {departments.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
            <Building className="h-10 w-10 text-muted mb-4 opacity-50" aria-hidden="true" />
            <h3 className="text-lg font-medium text-text mb-1">No departments found</h3>
            <p className="text-sm text-muted">The academic directory is currently empty.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
             <div key={dept.id} className="flex flex-col bg-surface border border-border rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-5">
                   <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                      <Building className="h-6 w-6" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-text leading-tight group-hover:text-primary transition-colors line-clamp-2">{dept.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted mb-1">
                         {dept.code || "DEPT"}
                      </Badge>
                      <p className="text-sm text-muted font-medium mt-1">{dept.facultyCount} Faculty Members</p>
                   </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-2 flex-1">
                   <div className="flex items-start gap-3 bg-surface-2/50 p-3 rounded-xl border border-border">
                      <GraduationCap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                         <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Head of Department</p>
                         <p className="text-sm font-semibold text-text truncate max-w-[200px]">{dept.hod ? dept.hod.name : "Not Assigned"}</p>
                         {dept.hod && <p className="text-xs text-muted truncate max-w-[200px]">{dept.hod.email}</p>}
                      </div>
                   </div>
                   
                   {dept.description && (
                     <div className="mt-2 text-sm text-muted line-clamp-3">
                       {dept.description}
                     </div>
                   )}
                </div>

                <button 
                  onClick={() => setSelectedDept(dept)}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors"
                >
                   View Directory <ChevronRight className="h-4 w-4" />
                </button>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DepartmentsView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Departments module.">
      <DepartmentsViewContent />
    </ErrorBoundary>
  )
}

import { ScheduleEntry } from "@/types"
import { Clock, MapPin, User, Building, BookOpen, FlaskConical } from "lucide-react"

export function TimetableList({ 
  schedule, 
  viewType,
  engineState,
  onProfileClick
}: { 
  schedule: ScheduleEntry[]
  viewType: string
  engineState: any
  onProfileClick: (type: "faculty" | "room" | "subject", data: string) => void
}) {
  if (schedule.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center bg-surface border border-border rounded-2xl">
        <Clock className="h-12 w-12 text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-text">No data available</h3>
        <p className="text-sm text-muted mt-1">Check back later or adjust filters.</p>
      </div>
    )
  }

  const { todayStr, currentClass, nextClass, completedClasses } = engineState

  if (viewType === "Faculty") {
    // Group by Faculty
    const facultyMap = new Map<string, ScheduleEntry[]>()
    schedule.forEach(s => {
      const list = facultyMap.get(s.faculty) || []
      list.push(s)
      facultyMap.set(s.faculty, list)
    })

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from(facultyMap.entries()).map(([facultyName, entries]) => {
          const subjects = Array.from(new Set(entries.map(s => s.subjectName)))
          const depts = Array.from(new Set(entries.map(s => s.department)))
          const todayCount = entries.filter(s => s.day === todayStr).length

          return (
            <div key={facultyName} className="bg-bg border border-border p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center border border-blue-500/20">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 
                    className="text-lg font-bold text-text cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onProfileClick("faculty", facultyName)}
                  >
                    {facultyName}
                  </h4>
                  <p className="text-sm text-muted font-medium">{depts.join(", ")} Dept</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-y border-border/50 py-3">
                 <div className="text-center">
                    <p className="text-xs font-bold text-muted uppercase">Weekly</p>
                    <p className="text-base font-bold text-text">{entries.length} Hrs</p>
                 </div>
                 <div className="text-center border-l border-border/50">
                    <p className="text-xs font-bold text-muted uppercase">Today</p>
                    <p className="text-base font-bold text-text">{todayCount} Hrs</p>
                 </div>
                 <div className="text-center border-l border-border/50">
                    <p className="text-xs font-bold text-muted uppercase">Subjects</p>
                    <p className="text-base font-bold text-text">{subjects.length}</p>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                {subjects.slice(0,2).map(sub => (
                  <span key={sub} className="text-xs font-medium text-muted bg-surface-2 px-2 py-1 rounded border border-border truncate"><BookOpen className="inline h-3 w-3 mr-1" />{sub}</span>
                ))}
                {subjects.length > 2 && <span className="text-xs font-medium text-primary">+{subjects.length - 2} more...</span>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (viewType === "Laboratory") {
    const labMap = new Map<string, ScheduleEntry[]>()
    schedule.filter(s => s.classType === "Lab").forEach(s => {
      // Group by room to show unique labs
      const list = labMap.get(s.room) || []
      list.push(s)
      labMap.set(s.room, list)
    })

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from(labMap.entries()).map(([room, entries]) => {
          const subjects = Array.from(new Set(entries.map(s => s.subjectName)))
          const faculty = Array.from(new Set(entries.map(s => s.faculty)))
          const building = entries[0]?.building || "Campus"
          
          return (
            <div key={room} className="bg-bg border border-border p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 
                    className="text-lg font-bold text-text cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                    onClick={() => onProfileClick("room", room)}
                  >
                    <FlaskConical className="h-5 w-5 text-purple-500" /> {room}
                  </h4>
                  <p className="text-sm text-muted font-medium mt-1"><Building className="inline h-3 w-3 mr-1" /> {building}</p>
                </div>
                <span className="bg-purple-500/10 text-purple-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Lab Facility</span>
              </div>
              
              <div className="bg-surface-2 p-3 rounded-xl border border-border/50 text-sm">
                 <p className="font-semibold text-text mb-1">Subjects Handled:</p>
                 <div className="flex flex-col gap-1 text-muted text-xs">
                   {subjects.map(sub => <span key={sub}>• {sub}</span>)}
                 </div>
              </div>
              
              <div className="text-xs text-muted flex gap-2 overflow-x-auto scrollbar-none">
                 {faculty.map(f => <span key={f} className="shrink-0 bg-surface px-2 py-1 rounded border border-border shadow-sm"><User className="inline h-3 w-3 mr-1" />{f}</span>)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (viewType === "Room") {
    const roomMap = new Map<string, ScheduleEntry[]>()
    schedule.forEach(s => {
      if (!s.room) return
      const list = roomMap.get(s.room) || []
      list.push(s)
      roomMap.set(s.room, list)
    })

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(roomMap.entries()).map(([room, entries]) => {
          const building = entries[0]?.building || "Campus"
          const totalSlots = entries.length
          const todaySlots = entries.filter(s => s.day === todayStr).length

          return (
            <div key={room} className="bg-bg border border-border p-4 rounded-xl flex flex-col gap-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center border border-orange-500/20">
                    <MapPin className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 
                      className="text-base font-bold text-text cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onProfileClick("room", room)}
                    >
                      {room}
                    </h4>
                    <p className="text-xs text-muted font-medium"><Building className="inline h-3 w-3 mr-0.5" /> {building}</p>
                 </div>
              </div>
              
              <div className="flex justify-between items-center bg-surface-2 px-3 py-2 rounded-lg border border-border/50 mt-2">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted uppercase">Weekly Usage</span>
                   <span className="text-sm font-bold text-text">{totalSlots} Slots</span>
                 </div>
                 <div className="w-px h-6 bg-border"></div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted uppercase">Today</span>
                   <span className="text-sm font-bold text-text">{todaySlots} Slots</span>
                 </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Today View (Default list)
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const sorted = [...schedule].sort((a, b) => {
    const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return parseInt(a.period || "0") - parseInt(b.period || "0")
  })

  const getStatusStyle = (s: ScheduleEntry) => {
    if (s.day !== todayStr) return "border-border hover:border-primary/50"
    if (currentClass?.id === s.id) return "border-green-500 bg-green-500/5 shadow-sm"
    if (nextClass?.id === s.id) return "border-blue-500 bg-blue-500/5 shadow-sm"
    if (completedClasses.some((c: ScheduleEntry) => c.id === s.id)) return "border-border opacity-60"
    return "border-border hover:border-primary/50"
  }

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((s) => (
        <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-bg border p-4 rounded-xl transition-all duration-200 group ${getStatusStyle(s)}`}>
          <div className="w-40 shrink-0 flex flex-col gap-1 text-sm font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/20">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {s.day}</span>
            <span className="text-xs font-medium text-muted">P{s.period} ({s.startTime} - {s.endTime})</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">{s.subjectCode}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                 s.classType === "Lab" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : 
                 s.classType === "Tutorial" ? "bg-gray-500/10 text-gray-600 border-gray-500/20" :
                 s.classType?.includes("Elective") ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                 "bg-surface-2 text-muted border-border"
              }`}>{s.classType}</span>
              {s.classType === "Lab" && <span className="text-[10px] font-bold text-muted bg-surface-2 px-2 py-0.5 rounded uppercase border border-border">Batch: {s.batch}</span>}
              
              {currentClass?.id === s.id && <span className="text-xs font-bold text-green-600 ml-auto flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> CURRENT</span>}
              {nextClass?.id === s.id && <span className="text-xs font-bold text-blue-600 ml-auto flex items-center gap-1">NEXT</span>}
              {completedClasses.some((c: ScheduleEntry) => c.id === s.id) && <span className="text-xs font-bold text-muted ml-auto flex items-center gap-1">COMPLETED</span>}
            </div>
            <h4 
              className="text-lg font-semibold text-text cursor-pointer hover:text-primary transition-colors w-fit"
              onClick={() => onProfileClick("subject", s.subjectName)}
            >
              {s.subjectName}
            </h4>
            <div className="flex items-center gap-4 mt-2">
              <span 
                className="text-sm text-muted flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => onProfileClick("faculty", s.faculty)}
              >
                <User className="h-4 w-4" /> {s.faculty}
              </span>
              <span 
                className="text-sm text-muted flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => onProfileClick("room", s.room)}
              >
                <MapPin className="h-4 w-4" /> {s.room}
              </span>
            </div>
          </div>
          <div className="shrink-0 hidden lg:flex flex-col items-end gap-2">
            <span className="text-[10px] font-bold text-muted bg-surface-2 px-3 py-1 rounded-full uppercase tracking-wider border border-border">{s.department} • Year {s.year} • Sec {s.section}</span>
            <span className="text-xs font-medium text-muted">{s.credits} Credits</span>
          </div>
        </div>
      ))}
    </div>
  )
}

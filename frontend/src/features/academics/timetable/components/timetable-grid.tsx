import { ScheduleEntry } from "@/types"
import { MapPin, User } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TimetableGrid({ 
  schedule, 
  engineState,
  onProfileClick
}: { 
  schedule: ScheduleEntry[]
  engineState: any
  onProfileClick: (type: "faculty" | "room" | "subject", data: string) => void
}) {
  const groupedByDay = DAYS.reduce((acc, d) => {
    acc[d] = schedule.filter(s => s.day === d).sort((a, b) => parseInt(a.period || "0") - parseInt(b.period || "0"))
    return acc
  }, {} as Record<string, ScheduleEntry[]>)

  const { todayStr, currentClass, nextClass, completedClasses } = engineState

  const getStatusColor = (s: ScheduleEntry) => {
    if (s.day !== todayStr) return "border-border hover:border-primary/50"
    if (currentClass?.id === s.id) return "border-green-500 bg-green-500/5 shadow-sm"
    if (nextClass?.id === s.id) return "border-blue-500 bg-blue-500/5 shadow-sm"
    if (completedClasses.some((c: ScheduleEntry) => c.id === s.id)) return "border-border opacity-60"
    return "border-border hover:border-primary/50"
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-6 divide-y xl:divide-y-0 xl:divide-x divide-border bg-surface border border-border rounded-2xl shadow-sm overflow-hidden text-sm">
      {DAYS.map(d => (
         <div key={d} className={`flex flex-col ${d === todayStr ? "bg-surface/50" : ""}`}>
            <div className={`p-3 text-center border-b border-border font-semibold text-xs uppercase tracking-wider ${d === todayStr ? "bg-primary/5 text-primary" : "bg-surface-2 text-text"}`}>{d}</div>
            <div className="p-2 flex flex-col gap-2 min-h-[500px]">
               {groupedByDay[d].length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-muted">No classes</div>
               ) : (
                  groupedByDay[d].map(s => (
                     <div 
                       key={s.id} 
                       className={`bg-bg border p-3 rounded-xl flex flex-col gap-2 transition-all duration-200 group ${getStatusColor(s)}`}
                       title={`Subject: ${s.subjectCode} - ${s.subjectName}\nFaculty: ${s.faculty}\nRoom: ${s.room} (${s.building})\nCredits: ${s.credits}\nType: ${s.classType}\nRemarks: ${s.remarks || 'None'}`}
                     >
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
                            P{s.period} ({s.startTime})
                          </p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                            s.classType === "Lab" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : 
                            s.classType === "Tutorial" ? "bg-gray-500/10 text-gray-600 border-gray-500/20" :
                            s.classType?.includes("Elective") ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                            "bg-surface-2 text-muted border-border"
                          }`}>{s.classType}</span>
                        </div>
                        <p 
                          className="text-sm font-semibold text-text leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onProfileClick("subject", s.subjectName)}
                        >
                          {s.subjectName}
                        </p>
                        <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-border/50">
                           <p 
                             className="text-xs text-muted flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                             onClick={() => onProfileClick("faculty", s.faculty)}
                           >
                             <User className="h-3 w-3" /> <span className="line-clamp-1">{s.faculty}</span>
                           </p>
                           <p 
                             className="text-xs text-muted flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                             onClick={() => onProfileClick("room", s.room)}
                           >
                             <MapPin className="h-3 w-3 shrink-0" /> <span className="line-clamp-1">{s.room} ({s.building})</span>
                           </p>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      ))}
    </div>
  )
}

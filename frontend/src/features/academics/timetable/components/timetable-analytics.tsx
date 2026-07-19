import { ScheduleEntry } from "@/types"
import { BookOpen, FlaskConical, Users, Clock } from "lucide-react"

export function TimetableAnalytics({ schedule }: { schedule: ScheduleEntry[] }) {
  // Compute Weekly Analytics from the full filtered schedule
  const lectureHours = schedule.filter(c => c.classType === "Lecture").length
  const labHours = schedule.filter(c => c.classType === "Lab").length
  const uniqueFaculty = new Set(schedule.map(c => c.faculty)).size
  const uniqueSubjects = new Set(schedule.map(c => c.subjectName)).size
  
  // Labs are usually grouped in 3 periods, so we divide by 3 to get the session count
  const labSessions = Math.round(labHours / 3)
  
  // Compute Total Credits by taking unique subjects and summing their credits
  const subjectMap = new Map()
  schedule.forEach(c => {
    if (!subjectMap.has(c.subjectName)) {
      subjectMap.set(c.subjectName, parseInt(c.credits || "0"))
    }
  })
  let totalCredits = 0
  subjectMap.forEach(credits => totalCredits += credits)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Weekly Lectures</p>
          <BookOpen className="h-4 w-4 text-blue-500 opacity-80" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{lectureHours} <span className="text-sm font-medium text-muted">hrs/week</span></p>
          <p className="text-[10px] text-muted mt-1 font-medium">{uniqueSubjects} Core Subjects</p>
        </div>
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Weekly Labs</p>
          <FlaskConical className="h-4 w-4 text-purple-500 opacity-80" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{labSessions} <span className="text-sm font-medium text-muted">sessions</span></p>
          <p className="text-[10px] text-muted mt-1 font-medium">{labHours} Total Lab Hours</p>
        </div>
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Teaching Faculty</p>
          <Users className="h-4 w-4 text-amber-500 opacity-80" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{uniqueFaculty} <span className="text-sm font-medium text-muted">Staff</span></p>
          <p className="text-[10px] text-muted mt-1 font-medium">Assigned to this class</p>
        </div>
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Credits</p>
          <Clock className="h-4 w-4 text-green-500 opacity-80" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{totalCredits} <span className="text-sm font-medium text-muted">Credits</span></p>
          <p className="text-[10px] text-muted mt-1 font-medium">Total Contact: {lectureHours + labHours} hrs/wk</p>
        </div>
      </div>
    </div>
  )
}

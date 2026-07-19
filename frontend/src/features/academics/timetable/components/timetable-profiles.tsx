import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScheduleEntry } from "@/types"
import { User, MapPin, BookOpen, Building } from "lucide-react"

type ProfileType = "faculty" | "room" | "subject" | null

export function ProfileDialog({
  isOpen,
  onClose,
  type,
  data,
  schedule
}: {
  isOpen: boolean
  onClose: () => void
  type: ProfileType
  data: string | null // the name or code
  schedule: ScheduleEntry[]
}) {
  if (!isOpen || !data || !type) return null

  let content = null

  if (type === "faculty") {
    const entries = schedule.filter(s => s.faculty === data)
    const subjects = Array.from(new Set(entries.map(s => s.subjectName)))
    const rooms = Array.from(new Set(entries.map(s => s.room)))
    const totalHours = entries.length
    
    content = (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center border border-blue-500/20">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{data}</h2>
            <p className="text-sm text-muted font-medium mt-1">Teaching Faculty • {entries[0]?.department || "General"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Weekly Load</p>
            <p className="text-lg font-bold text-text mt-1">{totalHours} Hrs</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Subjects</p>
            <p className="text-lg font-bold text-text mt-1">{subjects.length}</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Rooms</p>
            <p className="text-lg font-bold text-text mt-1">{rooms.length}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-text mb-2 border-b border-border pb-2">Teaching Subjects</p>
          <div className="flex flex-col gap-2">
            {subjects.map(sub => (
              <div key={sub} className="flex items-center gap-2 text-sm text-muted bg-surface p-2 rounded-lg border border-border/50">
                <BookOpen className="h-4 w-4 shrink-0 text-primary" /> {sub}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === "room") {
    const entries = schedule.filter(s => s.room === data)
    const building = entries[0]?.building || "Main Block"
    const depts = Array.from(new Set(entries.map(s => s.department)))
    
    content = (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center border border-green-500/20">
            <MapPin className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{data}</h2>
            <p className="text-sm text-muted font-medium mt-1 flex items-center gap-1"><Building className="h-4 w-4" /> {building}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Weekly Occupancy</p>
            <p className="text-lg font-bold text-text mt-1">{entries.length} Classes</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Used By</p>
            <p className="text-sm font-bold text-text mt-1 truncate">{depts.join(", ")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (type === "subject") {
    const entries = schedule.filter(s => s.subjectName === data || s.subjectCode === data)
    const subjectName = entries[0]?.subjectName || data
    const subjectCode = entries[0]?.subjectCode || "N/A"
    const credits = entries[0]?.credits || "0"
    const classType = entries[0]?.classType || "Lecture"
    const facultyList = Array.from(new Set(entries.map(s => s.faculty)))
    
    content = (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center border border-purple-500/20">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text line-clamp-2">{subjectName}</h2>
            <p className="text-sm text-muted font-medium mt-1">{subjectCode} • {classType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Credits</p>
            <p className="text-lg font-bold text-text mt-1">{credits}</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted uppercase">Weekly Hours</p>
            <p className="text-lg font-bold text-text mt-1">{entries.length} Hrs</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-text mb-2 border-b border-border pb-2">Instructors</p>
          <div className="flex flex-col gap-2">
            {facultyList.map(fac => (
              <div key={fac} className="flex items-center gap-2 text-sm text-muted bg-surface p-2 rounded-lg border border-border/50">
                <User className="h-4 w-4 shrink-0 text-primary" /> {fac}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 border-border rounded-2xl shadow-xl transition-all duration-200">
        <DialogHeader className="mb-2">
          <DialogTitle className="sr-only">Profile Dialog</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

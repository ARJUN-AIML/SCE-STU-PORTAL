import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { dataProvider } from "@/repositories/data-provider"
import { normalizeSchedule } from "@/repositories/normalizers"
import { ScheduleEntry } from "@/types"
import { Download, Calendar } from "lucide-react"

import { useTimetableEngine } from "./hooks/useTimetableEngine"
import { TimetableFilters } from "./components/timetable-filters"
import { TimetableDashboard } from "./components/timetable-dashboard"
import { TimetableAnalytics } from "./components/timetable-analytics"
import { TimetableUpdates } from "./components/timetable-updates"
import { TimetableEmptyState } from "./components/timetable-empty-state"
import { TimetableGrid } from "./components/timetable-grid"
import { TimetableList } from "./components/timetable-list"
import { ProfileDialog } from "./components/timetable-profiles"
import { exportTimetableToPDF } from "./utils/pdf-export"
import bundledTimetable from "@/repositories/timetable-dataset.json"

export function TimetableContainer() {
  const { data: rawSchedule = [], isLoading, isError, refetch } = useQuery<ScheduleEntry[]>({
    queryKey: ["schedule"],
    queryFn: async () => {
      try {
        const live = await dataProvider.fetch("schedule", api.getSchedule, normalizeSchedule)
        // The bundled dataset remains the safe source for the full ERP shape when
        // the API only returns legacy rows without department/year/section data.
        const hasAcademicShape = live.some((entry) => ["CSE", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "BME"].includes(entry.department) && entry.year && entry.semester && entry.subjectName)
        return hasAcademicShape ? live : bundledTimetable as ScheduleEntry[]
      } catch {
        return bundledTimetable as ScheduleEntry[]
      }
    }
  })

  const [filters, setFilters] = React.useState({
    department: "CSE",
    year: "1",
    semester: "1",
    section: "A",
    search: "",
  })

  const [viewType, setViewType] = React.useState("Today")
  const [profileState, setProfileState] = React.useState<{ isOpen: boolean, type: "faculty"|"room"|"subject"|null, data: string | null }>({ isOpen: false, type: null, data: null })

  // Filter dataset
  const filteredSchedule = React.useMemo(() => {
    return rawSchedule.filter(s => {
      if (s.department !== filters.department) return false
      if (s.year !== filters.year) return false
      if (s.semester !== filters.semester) return false
      if (s.section !== filters.section) return false
      
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const match = (s.subjectName || "").toLowerCase().includes(q) || 
                      (s.subjectCode || "").toLowerCase().includes(q) ||
                      (s.faculty || "").toLowerCase().includes(q) ||
                      (s.room || "").toLowerCase().includes(q) ||
                      (s.building || "").toLowerCase().includes(q) ||
                      (s.laboratory || "").toLowerCase().includes(q) ||
                      (s.department || "").toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [rawSchedule, filters])

  // Is Even Semester?
  const isEvenSemester = ["2", "4", "6", "8"].includes(filters.semester)

  const engineState = useTimetableEngine(filteredSchedule)
  
  let displayList = filteredSchedule
  if (viewType === "Today") displayList = engineState.todayClasses
  if (viewType === "Laboratory") displayList = filteredSchedule.filter(s => s.classType === "Lab")
  if (viewType === "Faculty") {
     // Just pass filteredSchedule, the list handles grouping or displaying
     // Just pass filteredSchedule, the list handles grouping or displaying
  }

  const handleExport = () => {
    exportTimetableToPDF(filteredSchedule, filters)
  }

  const handleProfileClick = (type: "faculty" | "room" | "subject", data: string) => {
    setProfileState({ isOpen: true, type, data })
  }

  if (isLoading) return <div className="p-8"><div className="h-32 animate-pulse rounded-lg bg-surface-2" /></div>
  if (isError) return <div role="alert" className="mx-auto max-w-6xl p-8 text-center"><p className="text-text">The timetable is temporarily unavailable.</p><button onClick={() => refetch()} className="mt-4 px-4 py-2 rounded-lg border border-border">Retry</button></div>

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text font-display">
            Academic Timetable
          </h1>
          <p className="text-sm text-muted mt-1">
            Anna University R2021 aligned • First-year curriculum and department timetable
          </p>
          <a href="https://cac.annauniv.edu/aidetails/afug_2021_fu/Revised/IandC/B.Tech.AIDS--.pdf" target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline">
            View official Anna University curriculum reference ↗
          </a>
        </div>
        <div className="flex flex-row items-center gap-2">
          <a
            href="/Planner%20even%2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm w-fit"
          >
            <Calendar className="h-4 w-4" /> View Calendar
          </a>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-surface text-text hover:bg-surface-2 border border-border px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm w-fit"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <TimetableFilters filters={filters} setFilters={setFilters} />

      {isEvenSemester ? (
        <TimetableEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
            <div className="lg:col-span-2 flex flex-col">
              <TimetableDashboard engineState={engineState} />
              <TimetableAnalytics schedule={filteredSchedule} />
            </div>
            <div className="lg:col-span-1">
              <TimetableUpdates updates={[]} />
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
            {["Today", "Week", "Faculty", "Laboratory", "Room"].map(v => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  viewType === v 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted hover:text-text hover:border-border'
                }`}
              >
                {v === "Today" ? "Today's View" : `${v} View`}
              </button>
            ))}
          </div>

          <div className="mt-2">
            {viewType === "Week" ? (
              <TimetableGrid 
                schedule={filteredSchedule} 
                engineState={engineState} 
                onProfileClick={handleProfileClick} 
              />
            ) : (
              <TimetableList 
                schedule={displayList} 
                viewType={viewType} 
                engineState={engineState} 
                onProfileClick={handleProfileClick} 
              />
            )}
          </div>
        </>
      )}

      <ProfileDialog
        isOpen={profileState.isOpen}
        onClose={() => setProfileState({ ...profileState, isOpen: false })}
        type={profileState.type}
        data={profileState.data}
        schedule={rawSchedule}
      />
    </div>
  )
}

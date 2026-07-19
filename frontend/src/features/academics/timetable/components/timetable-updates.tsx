import { Bell } from "lucide-react"

export function TimetableUpdates({ updates = [] }: { updates?: any[] }) {
  return (
    <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm mb-6 h-full flex flex-col">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted" /> Recent Updates
      </h3>
      
      {updates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <div className="h-12 w-12 bg-surface-2 rounded-full flex items-center justify-center mb-3">
            <Bell className="h-5 w-5 text-muted opacity-50" />
          </div>
          <p className="text-sm font-medium text-text">No recent timetable updates.</p>
          <p className="text-xs text-muted mt-1 max-w-[200px]">Any official changes to rooms, faculty, or timings will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Future implementation for rendering actual updates */}
        </div>
      )}
    </div>
  )
}

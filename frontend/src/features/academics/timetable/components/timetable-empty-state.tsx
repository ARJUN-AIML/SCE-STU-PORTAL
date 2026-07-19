import { Calendar } from "lucide-react"

export function TimetableEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 lg:p-24 bg-surface border border-border rounded-2xl shadow-sm text-center">
      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Calendar className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-text mb-2">
        Even Semester Timetable
      </h2>
      <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
        The Even Semester timetable has not yet been published. According to the Academic Planning schedule, it will be uploaded before the commencement of the semester.
      </p>
      <p className="text-sm font-medium text-text mt-6 bg-surface-2 px-4 py-2 rounded-lg">
        Please check back later.
      </p>
    </div>
  )
}

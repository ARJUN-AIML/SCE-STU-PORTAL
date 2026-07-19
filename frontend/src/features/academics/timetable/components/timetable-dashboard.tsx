import { Clock, CheckCircle, PlayCircle, Calendar } from "lucide-react"

export function TimetableDashboard({ engineState }: { engineState: any }) {
  const { currentClass, nextClass, completedClasses, remainingClasses, minutesRemaining, minutesUntilNext, isCollegeClosed } = engineState

  if (isCollegeClosed) {
    return (
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
        <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">You've completed today's schedule.</h3>
          <p className="text-sm text-muted mt-1">Enjoy your free time!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-2 mb-3 text-green-600">
          <PlayCircle className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Current Class</span>
        </div>
        {currentClass ? (
          <div>
            <h4 className="text-xl font-bold text-text mb-1 truncate">{currentClass.subjectName}</h4>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-medium text-muted">{currentClass.room}</span>
              <span className="text-sm font-bold text-green-600 bg-green-500/10 px-3 py-1 rounded-full">Ends in {minutesRemaining}m</span>
            </div>
          </div>
        ) : (
          <div>
             <h4 className="text-xl font-bold text-text mb-1 text-muted">Free Hour / Break</h4>
             <p className="text-sm text-muted mt-4">Relax or catch up on studies.</p>
          </div>
        )}
      </div>

      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-2 mb-3 text-blue-600">
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Next Class</span>
        </div>
        {nextClass ? (
          <div>
            <h4 className="text-xl font-bold text-text mb-1 truncate">{nextClass.subjectName}</h4>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-medium text-muted">{nextClass.room}</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">Starts in {minutesUntilNext}m</span>
            </div>
          </div>
        ) : (
          <div>
             <h4 className="text-xl font-bold text-text mb-1 text-muted">No more classes</h4>
             <p className="text-sm text-muted mt-4">You're done for the day!</p>
          </div>
        )}
      </div>
    </div>
  )
}

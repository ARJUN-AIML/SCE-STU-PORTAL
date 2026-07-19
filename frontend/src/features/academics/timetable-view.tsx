import { ErrorBoundary } from "@/components/error-boundary"
import { TimetableContainer } from "./timetable/timetable-container"

export function TimetableView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Academic Timetable ERP module.">
      <TimetableContainer />
    </ErrorBoundary>
  )
}

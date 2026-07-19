import { useState, useEffect, useMemo } from "react"
import { ScheduleEntry } from "@/types"

export function useTimetableEngine(schedule: ScheduleEntry[]) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const engineState = useMemo(() => {
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const todayStr = DAYS[now.getDay()]
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentMins = currentHour * 60 + currentMinute

    const todayClasses = schedule.filter(s => s.day === todayStr)
    
    // Sort by start time
    todayClasses.sort((a, b) => {
      const aMins = parseInt(a.startTime?.split(":")[0] || "0") * 60 + parseInt(a.startTime?.split(":")[1] || "0")
      const bMins = parseInt(b.startTime?.split(":")[0] || "0") * 60 + parseInt(b.startTime?.split(":")[1] || "0")
      return aMins - bMins
    })

    let currentClass: ScheduleEntry | null = null
    let nextClass: ScheduleEntry | null = null
    let completedClasses: ScheduleEntry[] = []
    let remainingClasses: ScheduleEntry[] = []
    let minutesRemaining = 0
    let minutesUntilNext = 0
    let currentPeriod = ""
    let isLunchBreak = false
    let isCollegeClosed = false
    let isHoliday = todayStr === "Sunday"

    if (todayClasses.length === 0) {
      isCollegeClosed = true
    } else {
      const firstClassStart = parseInt(todayClasses[0].startTime?.split(":")[0] || "0") * 60 + parseInt(todayClasses[0].startTime?.split(":")[1] || "0")
      const lastClassEnd = parseInt(todayClasses[todayClasses.length - 1].endTime?.split(":")[0] || "0") * 60 + parseInt(todayClasses[todayClasses.length - 1].endTime?.split(":")[1] || "0")
      
      if (currentMins < firstClassStart || currentMins > lastClassEnd) {
        isCollegeClosed = true
      }
    }

    todayClasses.forEach((s) => {
      if (!s.startTime || !s.endTime) return
      
      const startMins = parseInt(s.startTime.split(":")[0]) * 60 + parseInt(s.startTime.split(":")[1])
      const endMins = parseInt(s.endTime.split(":")[0]) * 60 + parseInt(s.endTime.split(":")[1])
      
      if (currentMins >= startMins && currentMins <= endMins) {
        currentClass = s
        currentPeriod = s.period || ""
        minutesRemaining = endMins - currentMins
      } else if (currentMins < startMins) {
        remainingClasses.push(s)
        if (!nextClass) {
          nextClass = s
          minutesUntilNext = startMins - currentMins
        }
      } else if (currentMins > endMins) {
        completedClasses.push(s)
      }
    })

    // Lunch break heuristic (usually between 12:25 and 13:15)
    if (!currentClass && currentMins >= (12 * 60 + 25) && currentMins < (13 * 60 + 15) && todayClasses.length > 0) {
      isLunchBreak = true
      currentPeriod = "Lunch"
    }

    return {
      todayStr,
      currentClass,
      nextClass,
      completedClasses,
      remainingClasses,
      minutesRemaining,
      minutesUntilNext,
      currentPeriod,
      isLunchBreak,
      isCollegeClosed,
      isHoliday,
      todayClasses
    }
  }, [schedule, now])

  return engineState
}

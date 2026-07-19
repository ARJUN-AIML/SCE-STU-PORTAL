import { useState, useCallback, useRef } from "react"

type SaveState = "idle" | "saving" | "saved" | "error"

export function useInlineSave<T>(
  initialData: T,
  saveFn: (data: T) => Promise<void>,
  debounceMs: number = 800
) {
  const [data, setData] = useState<T>(initialData)
  const [status, setStatus] = useState<SaveState>("idle")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const timeoutRef = useRef<number | null>(null)

  const handleChange = useCallback(
    (key: keyof T, value: any) => {
      setData((prev) => {
        const newData = { ...prev, [key]: value }
        
        setStatus("saving")
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = window.setTimeout(async () => {
          try {
            await saveFn(newData)
            setStatus("saved")
            setLastSaved(new Date())
            
            // Revert back to idle after a few seconds
            setTimeout(() => setStatus("idle"), 3000)
          } catch (e) {
             setStatus("error")
             setTimeout(() => setStatus("idle"), 3000)
          }
        }, debounceMs)

        return newData
      })
    },
    [saveFn, debounceMs]
  )

  return { data, setData, handleChange, status, lastSaved }
}

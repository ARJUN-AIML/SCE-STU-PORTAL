import { useState } from "react"
import { Globe } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 ${className}`}>
        <Globe className="h-1/2 w-1/2" />
      </div>
    )
  }

  return (
    <img 
      src="/logo.jpg" 
      alt="SCE Portal logo" 
      className={`rounded-lg bg-white object-contain shrink-0 ${className}`} 
      onError={() => setError(true)} 
    />
  )
}

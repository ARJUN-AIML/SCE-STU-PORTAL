import { useEffect } from "react"
import { useInlineSave } from "../hooks/use-inline-save"
import { Switch } from "./ui/switch"
import { Check, Loader2 } from "lucide-react"

const DOMAIN_OPTIONS = [
  "Artificial Intelligence", "Machine Learning", "Data Science", 
  "Web Development", "Cloud Computing", "Cyber Security", "UI/UX"
]

const CAREER_OPTIONS = [
  "Software Engineer", "Data Scientist", "Research", "Higher Studies", 
  "Product Manager", "DevOps Engineer"
]

export function AcademicPreferences() {
  const { data, handleChange, status, lastSaved } = useInlineSave(
    {
      domains: [] as string[],
      careers: [] as string[],
      recEvents: true,
      recWorkshops: true,
      recClubs: true,
      recStudy: true,
      recHackathons: true,
      aiStyle: "concise",
    },
    async (newData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("sih_acad_prefs", JSON.stringify(newData))
    },
    800
  )

  useEffect(() => {
     const saved = localStorage.getItem("sih_acad_prefs")
     if (saved) {
        try { 
           const parsed = JSON.parse(saved)
           Object.keys(parsed).forEach(k => handleChange(k as any, parsed[k]))
        } catch {}
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderStatus = () => {
    if (status === "saving") return <span className="text-sm text-muted flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</span>
    if (status === "saved") return <span className="text-sm text-emerald-600 flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Saved</span>
    if (lastSaved) return <span className="text-sm text-muted">Last updated: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    return null
  }

  const toggleArray = (field: "domains" | "careers", val: string) => {
     const current = data[field]
     if (current.includes(val)) {
        handleChange(field, current.filter(item => item !== val))
     } else {
        handleChange(field, [...current, val])
     }
  }

  const SegmentControl = ({ options, value, onChange }: any) => (
    <div className="flex bg-surface-2/50 p-1 rounded-xl border border-border w-fit mt-3">
      {options.map((opt: any) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive ? 'bg-surface text-text shadow-sm border border-border' : 'text-muted hover:text-text'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Academic Preferences</h2>
          <p className="text-sm text-muted mt-1">Personalize your academic journey and AI recommendations.</p>
        </div>
        <div className="h-8 flex items-center">{renderStatus()}</div>
      </div>

      <div className="grid gap-8 max-w-3xl">
        
        {/* Chips Selection */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm p-6 space-y-8">
           <div>
             <h3 className="text-base font-semibold text-text mb-1">Preferred Domains</h3>
             <p className="text-sm text-muted mb-4">Select areas of computer science that interest you.</p>
             <div className="flex flex-wrap gap-2">
                {DOMAIN_OPTIONS.map(opt => {
                   const isSelected = data.domains.includes(opt)
                   return (
                     <button 
                       key={opt}
                       onClick={() => toggleArray("domains", opt)}
                       className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                         isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-2 text-muted border-transparent hover:border-border hover:text-text'
                       }`}
                     >
                       {opt}
                     </button>
                   )
                })}
             </div>
           </div>

           <div>
             <h3 className="text-base font-semibold text-text mb-1">Career Interests</h3>
             <p className="text-sm text-muted mb-4">What roles are you aiming for?</p>
             <div className="flex flex-wrap gap-2">
                {CAREER_OPTIONS.map(opt => {
                   const isSelected = data.careers.includes(opt)
                   return (
                     <button 
                       key={opt}
                       onClick={() => toggleArray("careers", opt)}
                       className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                         isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-2 text-muted border-transparent hover:border-border hover:text-text'
                       }`}
                     >
                       {opt}
                     </button>
                   )
                })}
             </div>
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-5 border-b border-border bg-surface-2/30">
              <h3 className="text-base font-semibold text-text">AI Recommendation Preferences</h3>
              <p className="text-sm text-muted mt-0.5">Allow AI to suggest tailored opportunities based on your profile.</p>
           </div>
           <div className="divide-y divide-border">
              {[
                { key: "recEvents", label: "Events" },
                { key: "recWorkshops", label: "Workshops" },
                { key: "recClubs", label: "Clubs" },
                { key: "recStudy", label: "Study Resources" },
                { key: "recHackathons", label: "Hackathons" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                  <span className="text-sm font-medium text-text">{item.label}</span>
                  <Switch
                    checked={(data as any)[item.key]}
                    onCheckedChange={(val) => handleChange(item.key as any, val)}
                  />
                </div>
              ))}
           </div>
           
           <div className="p-6 border-t border-border bg-surface-2/10">
              <h3 className="text-sm font-medium text-text">Preferred AI Response Style</h3>
              <SegmentControl 
                options={[
                  { value: "concise", label: "Concise" },
                  { value: "balanced", label: "Balanced" },
                  { value: "detailed", label: "Detailed" },
                ]}
                value={data.aiStyle}
                onChange={(val: any) => handleChange("aiStyle", val)}
              />
           </div>
        </div>
        
      </div>
    </div>
  )
}

import { useEffect } from "react"
import { useInlineSave } from "../hooks/use-inline-save"
import { Switch } from "./ui/switch"
import { Check, Loader2, Monitor, Moon, Sun, Type } from "lucide-react"
import { useAppSettings } from "@/context/app-settings"

export function AppearanceAccessibilitySettings() {
  const { theme, setTheme } = useAppSettings()
  
  const { data, handleChange, status, lastSaved } = useInlineSave(
    {
      fontSize: "medium",
      reduceMotion: false,
      highContrast: false,
      keyboardFocus: true,
      screenReader: false,
    },
    async (newData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("sih_a11y_settings", JSON.stringify(newData))
    },
    500
  )

  useEffect(() => {
     const saved = localStorage.getItem("sih_a11y_settings")
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

  const SegmentControl = ({ options, value, onChange }: any) => (
    <div className="flex bg-surface-2/50 p-1 rounded-xl border border-border w-fit">
      {options.map((opt: any) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive ? 'bg-surface text-text shadow-sm border border-border' : 'text-muted hover:text-text'
            }`}
          >
            {opt.icon && <opt.icon className="h-4 w-4" />}
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
          <h2 className="text-2xl font-display font-semibold text-text">Appearance & Accessibility</h2>
          <p className="text-sm text-muted mt-1">Customize your visual experience and accessibility preferences.</p>
        </div>
        <div className="h-8 flex items-center">{renderStatus()}</div>
      </div>

      <div className="grid gap-8 max-w-3xl">
        {/* Appearance Section */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm p-6 space-y-6">
           <div>
             <h3 className="text-base font-semibold text-text mb-4">Theme Preferences</h3>
             <SegmentControl 
               options={[
                 { value: "classic", label: "Light", icon: Sun },
                 { value: "carbon", label: "Dark", icon: Moon },
                 { value: "system", label: "System", icon: Monitor }, // Simulate system
               ]}
               value={theme === "carbon" ? "carbon" : "classic"}
               onChange={(val: any) => setTheme(val)}
             />
           </div>
        </div>

        {/* Accessibility Section */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-5 border-b border-border bg-surface-2/30">
              <h3 className="text-base font-semibold text-text">Accessibility Settings</h3>
              <p className="text-sm text-muted mt-0.5">Adjust the interface to match your needs.</p>
           </div>
           
           <div className="p-6 border-b border-border">
             <h4 className="text-sm font-medium text-text mb-3 flex items-center gap-2"><Type className="h-4 w-4 text-muted" /> Font Size</h4>
             <SegmentControl 
               options={[
                 { value: "small", label: "Small" },
                 { value: "medium", label: "Medium (Default)" },
                 { value: "large", label: "Large" },
                 { value: "xlarge", label: "Extra Large" },
               ]}
               value={data.fontSize}
               onChange={(val: any) => handleChange("fontSize", val)}
             />
           </div>

           <div className="divide-y divide-border">
              {[
                { key: "reduceMotion", label: "Reduce Motion", desc: "Minimize UI animations and transitions" },
                { key: "highContrast", label: "High Contrast", desc: "Increase contrast between text and backgrounds" },
                { key: "keyboardFocus", label: "Keyboard Focus Indicators", desc: "Show clear outlines when navigating via keyboard" },
                { key: "screenReader", label: "Screen Reader Support", desc: "Optimize semantic structure for screen readers" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                  <div>
                    <span className="text-sm font-medium text-text block">{item.label}</span>
                    <span className="text-xs text-muted block mt-1">{item.desc}</span>
                  </div>
                  <Switch
                    checked={(data as any)[item.key]}
                    onCheckedChange={(val) => handleChange(item.key as any, val)}
                  />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect } from "react"
import { useInlineSave } from "../hooks/use-inline-save"
import { Switch } from "./ui/switch"
import { Check, Loader2 } from "lucide-react"

export function NotificationSettings() {
  const { data, handleChange, status, lastSaved } = useInlineSave(
    {
      attendance: true,
      internalMarks: true,
      exams: true,
      assignments: true,
      events: true,
      workshops: false,
      clubs: true,
      hackathons: true,
      fees: true,
      scholarships: true,
      transport: false,
      email: true,
      push: true,
    },
    async (newData) => {
      // Simulate API call for debounced save
      await new Promise((resolve) => setTimeout(resolve, 600))
      localStorage.setItem("sih_notify_settings", JSON.stringify(newData))
    },
    500
  )

  useEffect(() => {
     const saved = localStorage.getItem("sih_notify_settings")
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

  const sections = [
    {
      title: "Academic",
      desc: "Updates related to your coursework and performance.",
      items: [
        { key: "attendance", label: "Attendance Alerts" },
        { key: "internalMarks", label: "Internal Marks" },
        { key: "exams", label: "Exam Notifications" },
        { key: "assignments", label: "Assignment Reminders" },
      ]
    },
    {
      title: "Campus",
      desc: "Stay informed about extracurricular activities.",
      items: [
        { key: "events", label: "Events" },
        { key: "workshops", label: "Workshops" },
        { key: "clubs", label: "Clubs" },
        { key: "hackathons", label: "Hackathons" },
      ]
    },
    {
      title: "Administration",
      desc: "Important notices from the college office.",
      items: [
        { key: "fees", label: "Fee Due Reminders" },
        { key: "scholarships", label: "Scholarship Updates" },
        { key: "transport", label: "Transport Alerts" },
      ]
    },
    {
      title: "Communication Methods",
      desc: "How you prefer to receive these notifications.",
      items: [
        { key: "email", label: "Email Notifications" },
        { key: "push", label: "Push Notifications" },
      ]
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Notifications</h2>
          <p className="text-sm text-muted mt-1">Control the alerts and updates you receive.</p>
        </div>
        <div className="h-8 flex items-center">{renderStatus()}</div>
      </div>

      <div className="grid gap-8 max-w-3xl">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border bg-surface-2/30">
              <h3 className="text-base font-semibold text-text">{section.title}</h3>
              <p className="text-sm text-muted mt-0.5">{section.desc}</p>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item) => {
                const isChecked = (data as any)[item.key]
                return (
                  <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                    <span className="text-sm font-medium text-text">{item.label}</span>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={(val) => handleChange(item.key as any, val)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

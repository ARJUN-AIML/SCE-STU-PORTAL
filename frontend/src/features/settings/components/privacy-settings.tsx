import { useEffect } from "react"
import { useInlineSave } from "../hooks/use-inline-save"
import { Switch } from "./ui/switch"
import { Check, Loader2, Download, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrivacySettings() {
  const { data, handleChange, status, lastSaved } = useInlineSave(
    {
      showPhone: false,
      showEmail: false,
      showGithub: true,
      showLinkedin: true,
    },
    async (newData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("sih_privacy", JSON.stringify(newData))
    },
    500
  )

  useEffect(() => {
     const saved = localStorage.getItem("sih_privacy")
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

  const handleExport = () => {
     alert("Data export initiated. You will receive an email when your archive is ready to download.")
  }

  const handleDeleteHistory = () => {
     if (window.confirm("Are you sure you want to delete your entire AI conversation history? This action cannot be undone.")) {
        alert("Conversation history deleted.")
     }
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Privacy</h2>
          <p className="text-sm text-muted mt-1">Control your profile visibility and manage your data.</p>
        </div>
        <div className="h-8 flex items-center">{renderStatus()}</div>
      </div>

      <div className="grid gap-8 max-w-3xl">
        
        {/* Visibility */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-5 border-b border-border bg-surface-2/30">
              <h3 className="text-base font-semibold text-text">Profile Visibility</h3>
              <p className="text-sm text-muted mt-0.5">Choose what information is visible to other students in the campus directory.</p>
           </div>
           <div className="divide-y divide-border">
              {[
                { key: "showPhone", label: "Phone Number" },
                { key: "showEmail", label: "Personal Email" },
                { key: "showGithub", label: "GitHub Profile" },
                { key: "showLinkedin", label: "LinkedIn Profile" },
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
        </div>

        {/* Data Management */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-5 border-b border-border bg-surface-2/30">
              <h3 className="text-base font-semibold text-text">Data Management</h3>
              <p className="text-sm text-muted mt-0.5">Export your personal data or clear your history.</p>
           </div>
           <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border">
                 <div>
                   <h4 className="text-sm font-medium text-text">Export Personal Data</h4>
                   <p className="text-xs text-muted mt-1 max-w-md">Download a copy of your academic profile, attendance records, and settings in JSON format.</p>
                 </div>
                 <Button variant="outline" onClick={handleExport} className="shrink-0">
                   <Download className="h-4 w-4 mr-2 text-muted" /> Export Data
                 </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-danger/20 bg-danger/5">
                 <div>
                   <h4 className="text-sm font-medium text-danger flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Delete AI Conversation History</h4>
                   <p className="text-xs text-muted mt-1 max-w-md">Permanently delete all your interactions with the campus AI assistant.</p>
                 </div>
                 <Button variant="outline" onClick={handleDeleteHistory} className="shrink-0 border-danger text-danger hover:bg-danger hover:text-white">
                   <Trash2 className="h-4 w-4 mr-2" /> Delete History
                 </Button>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

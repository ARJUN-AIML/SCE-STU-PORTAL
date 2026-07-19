import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from "lucide-react"

// Simulated initial profile data
const initialData = {
  phone: "+91 9876543210",
  emergencyContact: "+91 9876543211",
  personalEmail: "student.personal@gmail.com",
  github: "",
  linkedin: "",
  careerGoal: "Software Engineer",
  skills: "React, TypeScript, Python",
  interests: "",
}

export function ProfileSettings() {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState(initialData)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
     const saved = localStorage.getItem("sih_profile_settings")
     if (saved) {
        try { 
           setFormData(JSON.parse(saved))
           // update initialData logic here ideally if it was from API
        } catch {}
     }
  }, [])

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== localStorage.getItem("sih_profile_settings") && JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  const profileCompletion = useMemo(() => {
    const fields = Object.values(formData)
    const filled = fields.filter(val => val.trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }, [formData])

  const missingFields = useMemo(() => {
    const missing = []
    if (!formData.github) missing.push("GitHub")
    if (!formData.linkedin) missing.push("LinkedIn")
    if (!formData.careerGoal) missing.push("Career Goal")
    if (!formData.skills) missing.push("Skills")
    if (!formData.interests) missing.push("Interests")
    return missing
  }, [formData])

  const handleSave = async () => {
    setStatus("saving")
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 800))
    localStorage.setItem("sih_profile_settings", JSON.stringify(formData))
    setStatus("saved")
    setTimeout(() => setStatus("idle"), 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (status === "saved") setStatus("idle")
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Profile</h2>
          <p className="text-sm text-muted mt-1">Manage your academic and personal information.</p>
        </div>
      </div>

      {/* Profile Completion Card */}
      {profileCompletion < 100 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" /> Profile Completion: {profileCompletion}%
            </h3>
            <p className="text-xs text-muted mt-1">Complete your profile to receive better AI recommendations for events and clubs.</p>
            {missingFields.length > 0 && (
              <p className="text-xs font-medium text-text mt-2">
                Missing: <span className="text-muted font-normal">{missingFields.join(" • ")}</span>
              </p>
            )}
          </div>
          <div className="w-full sm:w-48 h-2 bg-surface-2 rounded-full overflow-hidden">
             <div className="h-full bg-primary transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
          </div>
        </div>
      )}

      {/* Official Information (Read Only) */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border bg-surface-2/30">
          <h3 className="text-base font-semibold text-text">Official Information</h3>
          <p className="text-sm text-muted mt-0.5">This information is managed by the administration and cannot be changed.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="h-20 w-20 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold shadow-sm border border-primary/10 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"
              )}
            </div>
            <div>
              <p className="font-semibold text-text text-xl">{user?.displayName || "Student User"}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><p className="text-xs font-medium text-muted mb-1">Register Number</p><p className="text-sm font-semibold text-text">813821104035</p></div>
            <div><p className="text-xs font-medium text-muted mb-1">Department</p><p className="text-sm font-semibold text-text">Computer Science</p></div>
            <div><p className="text-xs font-medium text-muted mb-1">Year & Semester</p><p className="text-sm font-semibold text-text">Year 3 • Semester 5</p></div>
            <div><p className="text-xs font-medium text-muted mb-1">Section</p><p className="text-sm font-semibold text-text">A Section</p></div>
            <div><p className="text-xs font-medium text-muted mb-1">Academic Batch</p><p className="text-sm font-semibold text-text">2021 - 2025</p></div>
            <div><p className="text-xs font-medium text-muted mb-1">Faculty Advisor</p><p className="text-sm font-semibold text-text">Dr. S. Venkat</p></div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border bg-surface-2/30">
          <h3 className="text-base font-semibold text-text">Personal Information</h3>
          <p className="text-sm text-muted mt-0.5">Contact details for college communications.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text">Phone Number</label>
            <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text">Emergency Contact</label>
            <Input value={formData.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-text">Personal Email</label>
            <Input type="email" value={formData.personalEmail} onChange={(e) => handleChange("personalEmail", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Professional Profile */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border bg-surface-2/30">
          <h3 className="text-base font-semibold text-text">Professional Profile</h3>
          <p className="text-sm text-muted mt-0.5">Helps us tailor career opportunities and placement alerts.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text">LinkedIn Profile</label>
            <Input placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text">GitHub Profile</label>
            <Input placeholder="https://github.com/username" value={formData.github} onChange={(e) => handleChange("github", e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-text">Career Goal</label>
            <Input placeholder="e.g. Full Stack Developer, Data Scientist" value={formData.careerGoal} onChange={(e) => handleChange("careerGoal", e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-text">Technical Skills</label>
            <Input placeholder="React, Python, Machine Learning..." value={formData.skills} onChange={(e) => handleChange("skills", e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-text">General Interests</label>
            <Input placeholder="Open Source, Robotics, Designing..." value={formData.interests} onChange={(e) => handleChange("interests", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Save Action Footer */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-surface border border-border rounded-2xl shadow-xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-5">
           <span className="text-sm font-medium text-text">You have unsaved changes</span>
           <Button onClick={handleSave} disabled={status === "saving"}>
             {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
             {status === "saved" ? "Saved!" : "Save Changes"}
           </Button>
        </div>
      )}
    </div>
  )
}

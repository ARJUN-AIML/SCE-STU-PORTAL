import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface ClubRegistrationModalProps {
  clubName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ClubRegistrationModal({ clubName, open, onOpenChange, onSuccess }: ClubRegistrationModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    student_name: user?.displayName || "",
    batch_no: "",
    department: "",
    year: "",
    mobile_number: "",
    college_email: user?.email || "",
    agree: false
  })
  const [emailError, setEmailError] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    
    if (name === "college_email") {
      if (value && !value.endsWith("@saranathan.ac.in")) {
        setEmailError("Email must end with @saranathan.ac.in")
      } else {
        setEmailError("")
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.college_email.endsWith("@saranathan.ac.in")) {
      toast.error("Invalid email domain. Must be @saranathan.ac.in")
      return
    }
    
    if (!formData.agree) {
      toast.error("You must agree to the Terms & Conditions")
      return
    }

    setLoading(true)
    try {
      await api.registerForClub({
        student_name: formData.student_name,
        batch_no: formData.batch_no,
        department: formData.department,
        year: formData.year,
        mobile_number: formData.mobile_number,
        college_email: formData.college_email,
        club_name: clubName
      })
      
      toast.success("Registration successful")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Join {clubName}</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 hover:bg-surface-2 transition-colors text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Full Name</label>
                <Input 
                  required 
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="bg-surface border-border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Batch Number</label>
                  <Input 
                    required 
                    name="batch_no"
                    value={formData.batch_no}
                    onChange={handleChange}
                    placeholder="e.g. 2021-2025" 
                    className="bg-surface border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Year of Study</label>
                  <select 
                    required
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Department</label>
                <Input 
                  required 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science" 
                  className="bg-surface border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Mobile Number</label>
                <Input 
                  required 
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="10-digit number" 
                  className="bg-surface border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">College Email ID</label>
                <Input 
                  required 
                  type="email"
                  name="college_email"
                  value={formData.college_email}
                  onChange={handleChange}
                  placeholder="student@saranathan.ac.in" 
                  className={`bg-surface border-border ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  required
                  name="agree"
                  id="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-surface"
                />
                <label htmlFor="agree" className="text-sm font-medium text-text">
                  I agree to the Terms & Conditions of joining this club
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !!emailError}
                  className="w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Apply Now"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

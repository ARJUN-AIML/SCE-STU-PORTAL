import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Check, Mail } from "lucide-react"

// A simple local SVG for Google since Lucide doesn't have a colored Google logo easily accessible
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#0a66c2]" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export function ConnectedAccounts() {
  const { user } = useAuth()
  
  // Simulated connection states for demo
  const [connections, setConnections] = useState({
     google: true,
     college: true,
     github: false,
     linkedin: false,
  })

  const toggleConnection = (key: keyof typeof connections) => {
     if (key === "google" || key === "college") return // these are required
     
     // Only simulate action if we are "connecting"
     if (!connections[key]) {
        alert(`Redirecting to ${key} to authenticate... (Demo only)`)
     }
     
     setConnections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const accounts = [
    {
      key: "google" as const,
      name: "Google Account",
      desc: "Used for Single Sign-On.",
      icon: <GoogleIcon />,
      required: true,
      email: user?.email || "student@gmail.com"
    },
    {
      key: "college" as const,
      name: "Official College Email",
      desc: "Required for academic communications and verifications.",
      icon: <Mail className="h-5 w-5 text-indigo-500 shrink-0" />,
      required: true,
      email: user?.email?.includes("@saranathan.ac.in") ? user.email : "student@saranathan.ac.in"
    },
    {
      key: "github" as const,
      name: "GitHub",
      desc: "Connect to show your open source contributions and projects.",
      icon: <GithubIcon />,
      required: false,
    },
    {
      key: "linkedin" as const,
      name: "LinkedIn",
      desc: "Connect to sync your professional profile and career updates.",
      icon: <LinkedinIcon />,
      required: false,
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Connected Accounts</h2>
          <p className="text-sm text-muted mt-1">Manage accounts linked to your student profile.</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {accounts.map(acc => {
           const isConnected = connections[acc.key]
           
           return (
             <div key={acc.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-surface-2 rounded-full flex items-center justify-center border border-border shrink-0">
                    {acc.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text">{acc.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{acc.desc}</p>
                    {isConnected && acc.email && (
                      <p className="text-[11px] font-medium text-text mt-1.5">{acc.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="shrink-0 pt-2 sm:pt-0">
                   {isConnected ? (
                     <div className="flex items-center gap-3">
                       <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full">
                         <Check className="h-3.5 w-3.5" /> Connected
                       </span>
                       {!acc.required && (
                         <Button variant="ghost" size="sm" onClick={() => toggleConnection(acc.key)} className="text-muted hover:text-danger hover:bg-danger/10 h-8 text-xs">
                           Disconnect
                         </Button>
                       )}
                     </div>
                   ) : (
                     <Button variant="outline" size="sm" onClick={() => toggleConnection(acc.key)} className="h-8">
                       Connect Account
                     </Button>
                   )}
                </div>
             </div>
           )
        })}
      </div>
    </div>
  )
}

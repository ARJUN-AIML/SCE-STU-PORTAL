import { Button } from "@/components/ui/button"
import { ExternalLink, Bug, MessageSquare } from "lucide-react"
import { Logo } from "@/components/logo"

export function AboutSettings() {
  
  const handleReportBug = () => {
     alert("Bug report dialog would open here. (Currently unavailable)")
  }

  const handleFeedback = () => {
     alert("Feedback dialog would open here. (Currently unavailable)")
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">About</h2>
          <p className="text-sm text-muted mt-1">Information about the SCE Portal platform.</p>
        </div>
      </div>

      <div className="grid gap-8 max-w-3xl">
        
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm p-8 text-center flex flex-col items-center justify-center">
           <Logo className="h-16 w-16 mb-4" />
           <h3 className="text-xl font-bold text-text font-display">SCE Portal</h3>
           <p className="text-sm text-muted mt-1 max-w-md">The unified digital campus experience for Saranathan College of Engineering.</p>
           
           <div className="mt-8 grid grid-cols-2 gap-8 text-left w-full max-w-xs mx-auto">
              <div>
                 <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Portal Version</p>
                 <p className="text-sm font-semibold text-text">v2.4.0</p>
              </div>
              <div>
                 <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Build ID</p>
                 <p className="text-sm font-semibold text-text">8f73b2a</p>
              </div>
           </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
           <div className="divide-y divide-border">
              <a href="#" className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                 <span className="text-sm font-medium text-text">Privacy Policy</span>
                 <ExternalLink className="h-4 w-4 text-muted" />
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                 <span className="text-sm font-medium text-text">Terms & Conditions</span>
                 <ExternalLink className="h-4 w-4 text-muted" />
              </a>
              <a href="mailto:support@sceadmin.ac.in" className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/30 transition-colors">
                 <span className="text-sm font-medium text-text">Support Contact</span>
                 <span className="text-sm text-muted">support@sceadmin.ac.in</span>
              </a>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <Button variant="outline" className="flex-1 bg-surface" onClick={handleReportBug}>
             <Bug className="h-4 w-4 mr-2 text-muted" /> Report a Bug
           </Button>
           <Button variant="outline" className="flex-1 bg-surface" onClick={handleFeedback}>
             <MessageSquare className="h-4 w-4 mr-2 text-muted" /> Send Feedback
           </Button>
        </div>

      </div>
    </div>
  )
}

import * as React from "react"
import { useState, Suspense, lazy } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Bell, Palette, GraduationCap, Shield, Link2, Info, Menu, X
} from "lucide-react"

// Lazy load components for performance
const ProfileSettings = lazy(() => import("./components/profile-settings").then(m => ({ default: m.ProfileSettings })))
const NotificationSettings = lazy(() => import("./components/notification-settings").then(m => ({ default: m.NotificationSettings })))
const AppearanceAccessibilitySettings = lazy(() => import("./components/appearance-accessibility-settings").then(m => ({ default: m.AppearanceAccessibilitySettings })))
const AcademicPreferences = lazy(() => import("./components/academic-preferences").then(m => ({ default: m.AcademicPreferences })))
const PrivacySettings = lazy(() => import("./components/privacy-settings").then(m => ({ default: m.PrivacySettings })))
const ConnectedAccounts = lazy(() => import("./components/connected-accounts").then(m => ({ default: m.ConnectedAccounts })))
const AboutSettings = lazy(() => import("./components/about-settings").then(m => ({ default: m.AboutSettings })))

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance & Accessibility", icon: Palette },
  { id: "academic", label: "Academic Preferences", icon: GraduationCap },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "accounts", label: "Connected Accounts", icon: Link2 },
  { id: "about", label: "About", icon: Info },
]

export function SettingsView() {
  const [activeSection, setActiveSection] = useState("profile")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "profile": return <ProfileSettings />
      case "notifications": return <NotificationSettings />
      case "appearance": return <AppearanceAccessibilitySettings />
      case "academic": return <AcademicPreferences />
      case "privacy": return <PrivacySettings />
      case "accounts": return <ConnectedAccounts />
      case "about": return <AboutSettings />
      default: return <ProfileSettings />
    }
  }

  const activeLabel = sections.find(s => s.id === activeSection)?.label

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] bg-background">
      
      {/* Mobile Sidebar Header / Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border z-10 shrink-0 shadow-sm rounded-t-2xl">
         <div className="flex items-center gap-2">
            <span className="font-semibold text-text">{activeLabel}</span>
         </div>
         <button 
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           className="p-2 bg-surface-2 rounded-lg text-text border border-border"
         >
           {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
         </button>
      </div>

      {/* Sidebar (Desktop Persistent, Mobile Collapsible) */}
      <div className={`
        absolute md:relative z-20 w-full md:w-64 lg:w-72 shrink-0 bg-surface md:bg-transparent md:border-r border-border h-full flex flex-col transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
         <div className="hidden md:block p-6 pb-2">
           <h2 className="font-display font-semibold text-xl text-text tracking-tight">Settings</h2>
         </div>
         <div className="flex-1 overflow-y-auto scrollbar-none p-4 md:px-4 md:py-2 space-y-1 bg-surface md:bg-transparent shadow-xl md:shadow-none border-b md:border-none border-border">
            {sections.map((section) => {
               const isActive = activeSection === section.id
               return (
                 <button
                   key={section.id}
                   onClick={() => {
                      setActiveSection(section.id)
                      setMobileMenuOpen(false)
                   }}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                     isActive 
                       ? 'bg-primary text-primary-foreground shadow-sm' 
                       : 'text-muted hover:bg-surface-2 hover:text-text hover:translate-x-1'
                   }`}
                 >
                   <section.icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-foreground' : 'text-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                   {section.label}
                 </button>
               )
            })}
         </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden absolute inset-0 z-10 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-surface md:bg-surface md:rounded-2xl md:ml-6 md:border border-border md:shadow-sm">
         <div className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto min-h-full">
            <Suspense fallback={<div className="flex items-center gap-3 text-muted justify-center py-20"><div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Loading section...</div>}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </Suspense>
         </div>
      </div>
    </div>
  )
}

import { 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  Map, 
  Settings, 
  FileText,
  Bot,
  Building,
  BookOpen,
  Bus,
  Clock,
  Lock,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Logo } from "@/components/logo"

import { useAuth } from "@/context/auth-context"
import { logoutUser } from "@/lib/firebase"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useCallback, useRef } from "react"
import { dataProvider } from "@/repositories/data-provider"
import { useTranslation } from "react-i18next"

// Map sidebar keys to their prefetch functions
const prefetchMap: Record<string, (prefetch: (key: string[], fn: () => Promise<unknown>) => void) => void> = {
  events:       (pf) => pf(["events", dataProvider.getScenario()], () => dataProvider.fetch("events", api.getEvents)),
  faculty:      (pf) => pf(["faculty", dataProvider.getScenario()], () => dataProvider.fetch("faculty", api.getFaculty)),
  notices:      (pf) => pf(["notices", dataProvider.getScenario()], () => dataProvider.fetch("notices", api.getNotices)),
  departments:  (pf) => pf(["departments"], api.getDepartments),
  library:      (pf) => pf(["library", dataProvider.getScenario()], () => dataProvider.fetch("library", api.getLibrary)),
  transport:    (pf) => pf(["transport", dataProvider.getScenario()], () => dataProvider.fetch("transport", api.getTransport)),
  resources:    (pf) => pf(["resources", dataProvider.getScenario()], () => dataProvider.fetch("resources", api.getResources)),
}

const getNavGroups = (t: any) => [
  {
    label: t('sidebar.groups.main', 'Main'),
    items: [
      { key: "dashboard", label: t('sidebar.items.dashboard', 'Dashboard'), icon: LayoutDashboard },
      { key: "map", label: t('sidebar.items.map', 'Campus Navigation'), icon: Map },
      { key: "timetable", label: t('sidebar.items.timetable', 'Timetable'), icon: Clock },
    ]
  },
  {
    label: t('sidebar.groups.campus', 'Campus'),
    items: [
      { key: "notices", label: t('sidebar.items.notices', 'Announcements'), icon: FileText },
      { key: "events", label: t('sidebar.items.events', 'Events'), icon: CalendarDays },
      { key: "clubs", label: t('sidebar.items.clubs', 'Student Clubs'), icon: Users },
      { key: "faculty", label: t('sidebar.items.faculty', 'Faculty'), icon: GraduationCap },
      { key: "departments", label: t('sidebar.items.departments', 'Departments'), icon: Building },
    ]
  },
  {
    label: t('sidebar.groups.academics', 'Academics'),
    items: [
      { key: "library", label: t('sidebar.items.library', 'Library'), icon: BookOpen },
      { key: "transport", label: t('sidebar.items.transport', 'Transport'), icon: Bus },
    ]
  }
]

export function Sidebar({ active, onNavigate }: { active: string; onNavigate: (k: string) => void }) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const prefetchTimeoutRef = useRef<number | null>(null)

  const handlePrefetch = useCallback((key: string) => {
    const prefetcher = prefetchMap[key]
    if (prefetcher) {
      if (prefetchTimeoutRef.current) window.clearTimeout(prefetchTimeoutRef.current)
      prefetchTimeoutRef.current = window.setTimeout(() => {
        prefetcher((queryKey, queryFn) => {
          queryClient.prefetchQuery({ queryKey, queryFn, staleTime: 5 * 60 * 1000 })
        })
      }, 100)
    }
  }, [queryClient])

  const handleMouseLeave = useCallback(() => {
    if (prefetchTimeoutRef.current) window.clearTimeout(prefetchTimeoutRef.current)
  }, [])

  const visibleGroups = getNavGroups(t)
  
  if (isAdmin) {
    visibleGroups.push({
      label: t('sidebar.groups.administration', 'Administration'),
      items: [
        { key: "admin-cms", label: t('sidebar.items.admin-cms', 'Content Manager'), icon: Settings },
        { key: "admin-knowledge", label: t('sidebar.items.admin-knowledge', 'Knowledge Base'), icon: Bot },
        { key: "admin-analytics", label: t('sidebar.items.admin-analytics', 'Analytics'), icon: LayoutDashboard },
        { key: "admin-clubs", label: t('sidebar.items.admin-clubs', 'Club Admin'), icon: Users },
      ]
    })
  }

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col bg-[#FFFFFF] border-r border-[#E5E7EB] lg:flex h-full">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E5E7EB]">
        <Logo className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-[18px] font-bold text-[#111827] leading-tight mb-1">{t('sidebar.header.title', 'SCE Portal')}</span>
          <span className="text-[13px] font-medium text-[#6B7280] leading-tight">{t('sidebar.header.subtitle1', 'Saranathan College of')}</span>
          <span className="text-[13px] font-medium text-[#6B7280] leading-tight">{t('sidebar.header.subtitle2', 'Engineering')}</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex flex-col flex-1 overflow-y-auto scrollbar-none px-4 pt-2 pb-6">
        {visibleGroups.map((group, idx) => (
          <div key={group.label} className={cn("flex flex-col", idx > 0 && "mt-6")}>
            <span className="text-[11px] uppercase font-medium text-[#9CA3AF] mb-2 px-2 tracking-wider">
              {group.label}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const { key, label, icon: Icon } = item
                const isActive = active === key
                const isLocked = !isAdmin && key.startsWith("admin-")
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (isLocked) return
                      if ((item as any).action) {
                        (item as any).action()
                      } else {
                        onNavigate(key)
                      }
                    }}
                    onMouseEnter={() => handlePrefetch(key)}
                    onMouseLeave={handleMouseLeave}
                    disabled={isLocked}
                    className={cn(
                      "group relative flex items-center gap-[14px] h-[44px] rounded-[12px] transition-all duration-300 outline-none w-full overflow-hidden",
                      isLocked
                        ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 pointer-events-none"
                        : isActive
                          ? "text-primary font-semibold"
                          : "text-slate-500 font-medium hover:bg-slate-100/80 hover:text-slate-900"
                    )}
                  >
                    {/* Active State Accents */}
                    {isActive && !isLocked && (
                      <>
                        <div className="absolute inset-0 bg-primary/10" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-primary rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                      </>
                    )}

                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-[20px] h-[20px] ml-3 transition-transform duration-300",
                      isLocked ? "text-slate-400" : isActive ? "text-primary scale-110" : "text-slate-400 group-hover:scale-110 group-hover:text-primary/70"
                    )}>
                      <Icon className="h-5 w-5" strokeWidth={isActive && !isLocked ? 2.5 : 2} />
                    </div>
                    <span className="relative z-10 text-[14px] leading-none tracking-wide flex-1 text-left transition-all duration-300 group-hover:translate-x-1">{label}</span>
                    {isLocked && <Lock className="relative z-10 h-4 w-4 mr-3 text-slate-400" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-6 pt-4 shrink-0">
        <button
          onClick={() => onNavigate("settings")}
          className={cn(
            "group relative flex items-center gap-[14px] w-full h-[44px] rounded-[12px] transition-all duration-300 outline-none overflow-hidden",
            active === "settings"
              ? "text-primary font-semibold"
              : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-medium"
          )}
        >
          {active === "settings" && (
            <>
              <div className="absolute inset-0 bg-primary/10" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-primary rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
            </>
          )}
          <div className={cn("relative z-10 flex items-center justify-center w-[20px] h-[20px] ml-3 transition-transform duration-300", active === "settings" ? "text-primary scale-110" : "group-hover:scale-110")}>
             <Settings className="h-5 w-5" strokeWidth={active === "settings" ? 2.5 : 2} />
          </div>
          <span className="relative z-10 text-[14px] leading-none tracking-wide flex-1 text-left transition-all duration-300 group-hover:translate-x-1">{t('sidebar.items.settings', 'Settings')}</span>
        </button>

        <button onClick={() => void logoutUser()} className="group relative mt-2 flex h-[44px] w-full items-center gap-[14px] rounded-[12px] outline-none overflow-hidden text-slate-500 font-medium transition-all duration-300 hover:text-red-600 hover:bg-red-50">
          <div className="relative z-10 flex items-center justify-center w-[20px] h-[20px] ml-3 transition-transform duration-300 group-hover:-translate-x-1">
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
          <span className="relative z-10 text-[14px] leading-none tracking-wide flex-1 text-left transition-all duration-300">{t('sidebar.items.logout', 'Logout')}</span>
        </button>
      </div>

    </aside>
  )
}

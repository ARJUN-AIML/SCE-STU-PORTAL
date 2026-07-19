import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { AiDrawer } from "@/components/ai-drawer"
import { useAuth } from "@/context/auth-context"
import { Toaster, toast } from "sonner"
import { GlobalSearch } from "@/components/global-search"
import { LoginView } from "@/features/auth/login-view"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { commandDispatcher } from "@/core/commands/dispatcher"
import { Loader2 } from "lucide-react"

// Lazy load all views to improve performance
const DashboardView = React.lazy(() => import("@/features/dashboard/dashboard-view").then(m => ({ default: m.DashboardView })))
const EventsView = React.lazy(() => import("@/features/events/events-view").then(m => ({ default: m.EventsView })))
const ClubsView = React.lazy(() => import("@/features/clubs/clubs-view").then(m => ({ default: m.ClubsView })))
const FacultyView = React.lazy(() => import("@/features/faculty/faculty-view").then(m => ({ default: m.FacultyView })))
const MapView = React.lazy(() => import("@/features/map/map-view").then(m => ({ default: m.MapView })))
const SettingsView = React.lazy(() => import("@/features/settings/settings-view").then(m => ({ default: m.SettingsView })))
const NoticesView = React.lazy(() => import("@/features/notices/notices-view").then(m => ({ default: m.NoticesView })))

const TransportView = React.lazy(() => import("@/features/transport/transport-view").then(m => ({ default: m.TransportView })))
const LibraryView = React.lazy(() => import("@/features/library/library-view").then(m => ({ default: m.LibraryView })))
const TimetableView = React.lazy(() => import("@/features/academics/timetable-view").then(m => ({ default: m.TimetableView })))
const DepartmentsView = React.lazy(() => import("@/features/departments/departments-view").then(m => ({ default: m.DepartmentsView })))
const ResourcesView = React.lazy(() => import("@/features/resources/resources-view").then(m => ({ default: m.ResourcesView })))

const KnowledgeDashboard = React.lazy(() => import("@/features/admin/knowledge-dashboard").then(m => ({ default: m.KnowledgeDashboard })))
const CmsView = React.lazy(() => import("@/features/admin/cms-view").then(m => ({ default: m.CmsView })))
const AnalyticsView = React.lazy(() => import("@/features/admin/analytics-view").then(m => ({ default: m.AnalyticsView })))
const ClubAdminView = React.lazy(() => import("@/features/admin/club-admin-view").then(m => ({ default: m.ClubAdminView })))

function LiveBadge() {
  const { data: health, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
    refetchInterval: (query: any) => (query.state?.data?.status === "ready" ? 15000 : 1000),
  })

  let status: "live" | "connecting" | "failed" = "connecting"
  if (!isLoading) {
    if (isError || !health) {
      status = "connecting"
    } else if (health.status === "failed") {
      status = "failed"
    } else if (health.status === "ready" || health.status === "live" || health.status === "ok") {
      status = "live"
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted">
      {status === "live" && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-emerald-500">Backend Connected • v2.1.0</span>
        </>
      )}
      {status === "connecting" && (
        <>
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-yellow-500">Connecting...</span>
        </>
      )}
      {status === "failed" && (
        <>
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-red-500">Error: {health.error || "Startup Failed"}</span>
        </>
      )}
    </div>
  )
}

function ViewContainer({ active }: { active: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="h-full relative min-h-[500px]"
      >
        <React.Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
          </div>
        }>
          {active === "dashboard" && <DashboardView />}
          {active === "events" && <EventsView />}
          {active === "clubs" && <ClubsView />}
          {active === "faculty" && <FacultyView />}
          {active === "map" && <MapView />}
          {active === "settings" && <SettingsView />}
          {active === "notices" && <NoticesView />}
          {active === "transport" && <TransportView />}
          {active === "library" && <LibraryView />}
          {active === "timetable" && <TimetableView />}
          {active === "departments" && <DepartmentsView />}
          {active === "resources" && <ResourcesView />}
          {active === "admin-knowledge" && <KnowledgeDashboard />}
          {active === "admin-cms" && <CmsView />}
          {active === "admin-analytics" && <AnalyticsView />}
          {active === "admin-clubs" && <ClubAdminView />}
        </React.Suspense>
      </motion.div>
    </AnimatePresence>
  )
}


export default function App() {
  const { user, loading } = useAuth()
  const [active, setActive] = React.useState("dashboard")
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    commandDispatcher.register('navigate', (route: string) => {
      if (route.startsWith('admin-') && user?.role !== 'admin') {
        toast.error("Access Denied")
        setActive("dashboard")
      } else {
        setActive(route)
      }
    })
    return () => commandDispatcher.unregister('navigate')
  }, [user])
  
  React.useEffect(() => {
    if (active.startsWith('admin-') && user?.role !== 'admin') {
      toast.error("Access Denied")
      setActive("dashboard")
    }
  }, [active, user])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (loading) return null
  
  if (!user) {
    return (
       <>
         <LoginView />
         <Toaster position="bottom-right" />
       </>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      <Sidebar active={active} onNavigate={setActive} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 relative" id="main-scroll-container">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 min-h-full">
            
            {/* Header Area that stays persistent across views */}
            <div className="flex justify-end mb-2 shrink-0">
               <LiveBadge />
            </div>

            <div className="flex-1">
              <ViewContainer active={active} />
            </div>
          </div>
        </main>
      </div>
      <AiDrawer />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} onNavigate={setActive} />
      <Toaster position="bottom-right" />
    </div>
  )
}

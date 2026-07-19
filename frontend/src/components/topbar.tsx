import { useState } from "react"
import { Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { logoutUser } from "@/lib/firebase"
import { CommandPalette } from "./command-palette"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslation } from "react-i18next"

export function TopBar() {
  const { user, requireAuth } = useAuth()
  const [commandOpen, setCommandOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-5 py-3 relative z-40">
        
        {/* Left: Brand */}
        <div className="mr-auto flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="hidden font-display text-base font-semibold text-text sm:inline ml-2">
            {t('sidebar.header.title', 'SCE Portal')}
          </span>
        </div>

        {/* Center: Global Search */}
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 text-sm text-muted bg-surface-2 hover:bg-surface-2/80 border border-border rounded-xl px-4 py-2 w-full max-w-xs transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">{t('topbar.search', 'Search campus...')}</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-muted">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Auth & Language */}
        <div className="ml-2 flex items-center gap-3">
          <LanguageSwitcher />
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-medium text-text">{user.displayName || "Student"}</span>
                <button
                  onClick={logoutUser}
                  className="flex items-center justify-end gap-1 text-[10px] font-medium text-danger hover:underline"
                >
                  <LogOut className="h-3 w-3" />
                  {t('sidebar.items.logout', 'Logout')}
                </button>
              </div>
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-2 border border-border">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-text">{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</span>
                )}
              </div>
            </div>
          ) : (
            <Button size="sm" variant="default" onClick={() => requireAuth()}>
              Sign In
            </Button>
          )}
        </div>
        
      </header>
      
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  )
}

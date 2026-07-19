import * as React from "react"
import type { ThemeName, LangCode } from "@/types"
import { dictionaries } from "@/data/i18n"

interface AppSettingsContextValue {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  lang: LangCode
  setLang: (l: LangCode) => void
  t: (key: string) => string
}

const AppSettingsContext = React.createContext<AppSettingsContextValue | null>(null)

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeName>(() => {
    return (localStorage.getItem("sce-theme") as ThemeName) || "classic"
  })
  const [lang, setLang] = React.useState<LangCode>(() => {
    return (localStorage.getItem("sce-lang") as LangCode) || "EN"
  })

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("sce-theme", theme)
  }, [theme])

  React.useEffect(() => {
    localStorage.setItem("sce-lang", lang)
  }, [lang])

  const t = React.useCallback(
    (key: string) => dictionaries[lang][key] ?? dictionaries.EN[key] ?? key,
    [lang]
  )

  const value = React.useMemo(
    () => ({ theme, setTheme, lang, setLang, t }),
    [theme, lang, t]
  )

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppSettings() {
  const ctx = React.useContext(AppSettingsContext)
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider")
  return ctx
}

import * as React from "react"

interface AiContextType {
  isOpen: boolean
  prompt: string
  open: () => void
  close: () => void
  toggle: () => void
  prefillPrompt: (text: string) => void
  clearPrompt: () => void
}

const AiContext = React.createContext<AiContextType | undefined>(undefined)

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  
  const prefillPrompt = React.useCallback((text: string) => {
    setPrompt(text)
    setIsOpen(true)
  }, [])
  
  const clearPrompt = React.useCallback(() => setPrompt(""), [])

  return (
    <AiContext.Provider value={{ isOpen, prompt, open, close, toggle, prefillPrompt, clearPrompt }}>
      {children}
    </AiContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useAi() {
  const context = React.useContext(AiContext)
  if (!context) {
    throw new Error("useAi must be used within an AiProvider")
  }
  return context
}

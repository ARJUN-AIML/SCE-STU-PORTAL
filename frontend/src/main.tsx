import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import App from "./App.tsx"
import "./i18n"
import { AppSettingsProvider } from "@/context/app-settings"
import { AuthProvider } from "@/context/auth-context"
import { AiProvider } from "@/context/ai-context"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes — cached pages feel instant
      gcTime: 30 * 60 * 1000,          // 30 minutes — keep in memory
      refetchOnWindowFocus: false,      // Don't refetch when user alt-tabs back
      retry: 1,                         // Single retry on failure
      refetchOnMount: false,            // Don't refetch if data is fresh
      networkMode: "always",            // NEVER pause queries if browser thinks it's offline
    }
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <AuthProvider>
          <AiProvider>
            <App />
          </AiProvider>
        </AuthProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  </StrictMode>
)

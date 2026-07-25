import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useAi } from "@/context/ai-context"
import type { ChatMessage } from "@/types"
import { commandDispatcher } from "@/core/commands/dispatcher"
import { resolveDestination } from "@/features/map/map-resolver"
import { API_BASE } from "@/lib/api"


// --- Agent Pipeline Visualizer ---
/*
function _AgentPipeline({ plan, tools, confidence, source }: { plan: string[], tools: string[], confidence?: number, source?: string }) {
  return (
    <div className="mt-3 bg-surface-2 p-3 rounded-xl border border-border shadow-sm text-xs">
      <div className="mb-2 font-semibold tracking-wide text-[10px] uppercase text-muted flex items-center gap-1.5">
        <Terminal className="h-3 w-3" /> Agent Execution Pipeline
      </div>
      <div className="flex flex-col gap-2 relative pl-2">
         // Vertical line
         <div className="absolute left-3 top-2 bottom-2 w-px bg-border"></div>
         
         {plan.map((step, i) => (
           <div key={i} className="flex items-start gap-2.5 z-10">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
              <span className="text-text font-medium">{step}</span>
           </div>
         ))}
         
         {tools.length > 0 && (
           <div className="flex items-start gap-2.5 z-10 mt-1">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                <span className="text-muted">Tools:</span>
                {tools.map((t, i) => (
                   <code key={i} className="px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue-text rounded text-[10px] font-mono">{t}</code>
                ))}
              </div>
           </div>
         )}
      </div>

      {(confidence || source) && (
        <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-[10px] text-muted">
           {source && <span>Source: {source}</span>}
           {confidence && <span className="text-emerald-500 font-semibold">{confidence}% Confidence</span>}
        </div>
      )}
    </div>
  )
}

function _InteractiveWidget({ data }: { data: any }) {
  if (data.type === "map") {
    return (
      <div className="mt-3 bg-surface p-3 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
           <div className="p-1.5 bg-accent-blue/20 text-accent-blue-text rounded-md"><Map className="h-4 w-4" /></div>
           <span className="font-semibold text-text text-sm">Location Found: {data.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted mb-3 px-1">
           <span>Distance: {data.distance}</span>
           <span>Walk: {data.time}</span>
        </div>
        <Button onClick={() => commandDispatcher.dispatch('openMap')} className="w-full text-xs h-8"><ArrowRight className="h-3 w-3 mr-1" /> Open Map</Button>
      </div>
    )
  }
  if (data.type === "event") {
    return (
      <div className="mt-3 bg-surface p-3 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-accent-pink/20 text-accent-pink-text rounded-md"><Calendar className="h-4 w-4" /></div>
             <span className="font-semibold text-text text-sm">{data.event}</span>
           </div>
           <Badge variant="outline" className="bg-surface-2 text-[10px]">{data.seats} seats left</Badge>
        </div>
        <div className="flex gap-2 mt-3">
          <Button className="flex-1 text-xs h-8 bg-primary/10 text-primary hover:bg-primary/20"><Calendar className="h-3 w-3 mr-1" /> Add to Cal</Button>
          <Button className="flex-1 text-xs h-8" onClick={() => commandDispatcher.dispatch('registerEvent')}>Register Now</Button>
        </div>
      </div>
    )
  }
  if (data.type === "faculty") {
    return (
      <div className="mt-3 bg-surface p-3 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-3">
           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" className="h-10 w-10 rounded-full object-cover" />
           <div>
             <span className="font-semibold text-text text-sm block">{data.name}</span>
             <span className="text-xs text-muted">{data.office} • {data.status}</span>
           </div>
        </div>
        <Button onClick={() => commandDispatcher.dispatch('bookAppointment')} className="w-full text-xs h-8"><Calendar className="h-3 w-3 mr-1" /> Book Appointment</Button>
      </div>
    )
  }
  return null
}


*/
export function AiAssistantCard({ isDrawer = false }: { isDrawer?: boolean }) {
  const { prompt, clearPrompt } = useAi()
  const [messages, setMessages] = React.useState<(ChatMessage & { widget?: any })[]>([])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)
  const [wsStatus, setWsStatus] = React.useState<"connecting" | "connected" | "disconnected">("connecting")
  const [isBackendReady, setIsBackendReady] = React.useState(false)
  
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (prompt) {
      setInput(prompt)
      clearPrompt()
    }
  }, [prompt, clearPrompt])
  
  const wsRef = React.useRef<WebSocket | null>(null)

  const connectWebSocket = React.useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    setWsStatus("connecting")

    const wsUrl = API_BASE.replace(/^http/, "ws") + "/ws/chat"

    try {
      wsRef.current = new WebSocket(wsUrl)
    } catch (e) {
      setWsStatus("disconnected")
      // schedule a retry
      setTimeout(() => connectWebSocket(), 2000)
      return
    }

    let reconnectAttempts = 0
    const scheduleReconnect = () => {
      reconnectAttempts = Math.min(reconnectAttempts + 1, 10)
      const delay = Math.min(1000 * reconnectAttempts, 10000)
      setTimeout(() => {
        if (!isBackendReady) return // wait for backend readiness check
        connectWebSocket()
      }, delay)
    }

    wsRef.current.onopen = () => {
      setWsStatus("connected")
    }

    wsRef.current.onclose = () => {
      setWsStatus("disconnected")
      scheduleReconnect()
    }

    wsRef.current.onerror = () => {
      // mark disconnected and attempt reconnect
      setWsStatus("disconnected")
      try { wsRef.current?.close() } catch (e) {}
      scheduleReconnect()
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "status") {
          setStatusMessage(data.content)
        } else if (data.type === "stream") {
          setStatusMessage(null)
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.role === "assistant" && last.isStreaming) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + data.content }
              ]
            } else {
              return [...prev, { id: crypto.randomUUID(), role: "assistant", content: data.content, isStreaming: true }]
            }
          })
          setIsTyping(false)
        } else if (data.type === "done") {
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.role === "assistant") {
              // Intelligent Map Integration
              // Only trigger if the user's prompt indicates they are looking for a location
              const lastUserMsg = prev.slice().reverse().find(m => m.role === "user");
              const isLocationQuery = lastUserMsg && /\b(where|navigate|locate|directions|map|find|how to go|route|path|location)\b/i.test(lastUserMsg.content);
              
              if (isLocationQuery) {
                const res = resolveDestination(last.content)
                if (res.physicalBlock) {
                   commandDispatcher.dispatch('navigate', 'map')
                   setTimeout(() => commandDispatcher.dispatch('openMapLocation', res.requestedDestination), 100)
                }
              }

              return [
                ...prev.slice(0, -1),
                { ...last, content: data.answer || last.content, isStreaming: false, sources: data.sources, follow_ups: data.follow_ups, confidence: data.confidence, devMetrics: data.dev_metrics }
              ]
            }
            return prev
          })
        } else if (data.type === "error") {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "Error: " + data.content }])
          setIsTyping(false)
        }
      } catch (e) {
        console.error("Failed to parse WS message", e)
      }
    }
  }, [isBackendReady])

  React.useEffect(() => {
    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [connectWebSocket])

  // Health check polling
  React.useEffect(() => {
    let intervalId: any;

    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`)
        if (res.ok) {
          const data = await res.json()
          if (data.status === "ready" || data.status === "live" || data.status === "ok") {
            setIsBackendReady(true)
            // Attempt to ensure websocket connection now that backend is ready
            connectWebSocket()
            if (intervalId) clearInterval(intervalId)
          }
        }
      } catch (_e) {
        // Backend not reachable yet
      }
    }

    checkHealth()
    if (!isBackendReady) {
      intervalId = setInterval(checkHealth, 2000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isBackendReady, connectWebSocket])

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }])
    setInput("")
    setIsTyping(true)
    setStatusMessage(null)

    // Send to backend via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ question: trimmed }))
    } else {
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "Error: AI disconnected. Check backend server." }])
    }
  }

  return (
    <Card className={`flex flex-col h-full ${isDrawer ? "border-none shadow-none" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            Campus Copilot
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide">
              {wsStatus === "connected" && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              )}

              {wsStatus === "connecting" && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Connecting...
                </span>
              )}

              {wsStatus === "disconnected" && !isBackendReady && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  Starting up...
                </span>
              )}

              {wsStatus === "disconnected" && isBackendReady && (
                <span className="flex items-center gap-1 text-red-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Disconnected
                </span>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col overflow-y-auto pr-2 pb-2 scrollbar-thin">
            <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent-purple shadow-sm"
              >
                <Sparkles className="h-7 w-7 text-primary" />
              </motion.div>
              <div className="space-y-2">
                 <p className="font-display text-base font-semibold text-text">Hi! I'm your AI Campus Assistant powered by Google Gemini.</p>
                 <p className="text-sm text-muted">Ask me anything about campus events, faculty, clubs, academics, notices, or registration.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                "👨‍🏫 Who is the HOD of Computer Science?",
                "🚌 Which bus goes to KK Nagar?",
                "📢 Are there any placement notices?",
                "🎉 What technical events are coming up?",
                "💻 Tell me about the coding clubs.",
                "🏛️ Where is the Library located?",
                "📝 What is the course registration process?",
                "🎓 Tell me about the B.Tech IT program."
              ].map((q) => (
                 <button
                   key={q}
                   onClick={() => sendMessage(q.replace(/^[^\w\s]+/, '').trim())}
                   className="text-left text-xs bg-surface border border-border hover:border-primary hover:bg-primary/5 rounded-xl px-3 py-2.5 transition-colors shadow-sm font-medium text-text"
                 >
                   {q}
                 </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="mb-3 flex max-h-[60vh] flex-1 flex-col gap-4 overflow-y-auto pr-2 pt-2 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full"
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-surface-2 text-text border border-border/50 rounded-bl-sm"
                  }`}>
                    {m.role === "user" ? (
                      m.content
                    ) : (
                      <>
                        {/* Explainable AI Execution Pipeline */}
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({...props}: any) => <a className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                            code: ({className, ...props}: any) => <code className={`${className || ''} bg-surface rounded px-1.5 py-0.5 text-accent-pink-text font-mono text-[11px]`} {...props} />
                          }}
                        >
                          {m.content.split('---FOLLOW_UPS---')[0]}
                        </ReactMarkdown>
                        
                        
                        {/* Sources & Confidence */}
                        {!m.isStreaming && m.sources && m.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">📚 Sources</span>
                               {m.confidence && (
                                 <Badge variant="outline" className={`text-[9px] ${
                                    m.confidence.includes("High") ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    m.confidence.includes("Medium") ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                    "bg-danger/10 text-danger border-danger/20"
                                 }`}>
                                   {m.confidence}
                                 </Badge>
                               )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {m.sources.map((s, i) => (
                                <Badge key={i} variant="outline" className="bg-surface-2 text-[9px] text-muted-foreground border-border">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Dev Metrics (Only in Development Mode) */}
                            {import.meta.env.DEV && m.devMetrics && (
                              <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200 text-[9px] font-mono text-slate-600">
                                <div className="font-semibold text-[10px] text-slate-800 mb-1 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" /> Dev Metrics
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                  <span>TTFT: {m.devMetrics.ttft_ms}ms</span>
                                  <span>LLM Time: {m.devMetrics.llm_time_ms}ms</span>
                                  <span>Retrieval: {m.devMetrics.retrieval_time_ms}ms</span>
                                  <span>Top K: {m.devMetrics.top_k}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Follow-ups */}
                        {!m.isStreaming && m.follow_ups && m.follow_ups.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5">
                            {m.follow_ups.map((q, i) => (
                              <button 
                                key={i} 
                                onClick={() => sendMessage(q)}
                                className="text-left text-[11px] text-primary/80 hover:text-primary hover:bg-primary/5 rounded px-2 py-1 transition-colors border border-primary/20 bg-primary/5 w-fit"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 rounded-2xl rounded-bl-sm bg-surface-2 border border-border/50 px-4 py-3 w-fit"
                >
                  {statusMessage && <span className="text-xs text-muted font-medium">{statusMessage}</span>}
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface shadow-sm p-1.5 mt-auto shrink-0 focus-within:ring-1 focus-within:ring-primary/50 transition-all"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-[13px] h-9"

          />
          <Button type="submit" size="icon" className="h-9 w-9 rounded-xl" disabled={isTyping || !input.trim() || !isBackendReady || wsStatus !== "connected"}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

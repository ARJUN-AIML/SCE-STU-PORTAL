import { motion, AnimatePresence } from "framer-motion"
import { Bot, X } from "lucide-react"
import { useAi } from "@/context/ai-context"
import { AiAssistantCard } from "@/components/ai-assistant-card"

export function AiDrawer() {
  const { isOpen, toggle, close } = useAi()

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-primary/30 animate-ping [animation-duration:3s] pointer-events-none"
        />
        <motion.button
          onClick={toggle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-primary via-[#2563EB] to-[#4F46E5] text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Bot className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[420px] flex-col border-l border-border bg-bg shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-text">Campus AI</h2>
                </div>
                <button
                  onClick={close}
                  className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* The existing Chatbot wrapped nicely */}
              <div className="flex-1 overflow-hidden p-4">
                <AiAssistantCard isDrawer />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

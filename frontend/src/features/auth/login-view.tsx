import * as React from "react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Brain, Building, GraduationCap } from "lucide-react"
import { isAllowedEmail } from "@/lib/firebase"

export function LoginView() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginWithEmail, signupWithEmail } = useAuth()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailLower = email.toLowerCase().trim()

    // ── Domain pre-check ────────────────────────────────────────
    if (!isAllowedEmail(emailLower)) {
      toast.error("Access Denied", {
        description:
          "Only official @saranathan.ac.in or @sceadmin.ac.in accounts are allowed.",
      })
      return
    }

    // ── Password validation for signup ──────────────────────────
    if (!isLogin && password.length < 6) {
      toast.error("Weak password", {
        description: "Password must be at least 6 characters.",
      })
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await loginWithEmail(emailLower, password)
        toast.success("Welcome back!")
      } else {
        await signupWithEmail(emailLower, password)
        toast.success("Account created!", {
          description: "A verification email has been sent to your inbox.",
        })
      }
    } catch (error: any) {
      console.error("Auth error:", error)

      const code: string = error?.code ?? ""

      switch (code) {
        case "auth/user-not-found":
          toast.error("Account not found. Please register first.")
          break
        case "auth/wrong-password":
        case "auth/invalid-credential":
          toast.error("Incorrect email or password.")
          break
        case "auth/email-already-in-use":
          toast.error("This email is already registered. Please log in instead.")
          setIsLogin(true)
          break
        case "auth/weak-password":
          toast.error("Password is too weak. Use at least 6 characters.")
          break
        case "auth/invalid-email":
          toast.error("Invalid email address format.")
          break
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again later.")
          break
        case "auth/invalid-domain":
          toast.error("Access Denied", {
            description: "Only official college email accounts are allowed.",
          })
          break
        default:
          toast.error(isLogin ? "Login failed" : "Signup failed", {
            description: error.message || "An unexpected error occurred.",
          })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      
      {/* Left Form Section */}
      <div className="w-full lg:w-[480px] shrink-0 flex flex-col p-8 sm:p-12 xl:p-16 relative z-10 bg-white border-r border-slate-100 overflow-y-auto">
         
         <div className="mb-12">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-10 object-contain rounded-md" />
         </div>

         <div className="mb-8">
            <h1 className="text-[28px] font-display font-semibold text-[#00684a] mb-2 tracking-tight">
               {isLogin ? "Log in to your account" : "Create an account"}
            </h1>
            <p className="text-[14px] text-slate-600 font-medium">
               {isLogin ? "Don't have an account? " : "Already have an account? "}
               <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-[#00684a] hover:underline font-semibold"
               >
                  {isLogin ? "Sign Up" : "Log In"}
               </button>
            </p>
         </div>

         <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
               <label className="text-[13px] font-semibold text-slate-700">Email Address</label>
               <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@saranathan.ac.in"
                  className="h-11 rounded-lg border-slate-300 focus-visible:ring-[#00684a] focus-visible:border-[#00684a] shadow-sm"
                  required
               />
            </div>
            
            <div className="flex flex-col gap-1.5">
               <label className="text-[13px] font-semibold text-slate-700">Password</label>
               <div className="relative">
                 <Input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-lg border-slate-300 focus-visible:ring-[#00684a] focus-visible:border-[#00684a] shadow-sm pr-10"
                    required
                    minLength={6}
                 />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                 >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
            </div>

            <div className="mt-4">
               <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#EAEAEA] text-[#333333] hover:bg-[#D5D5D5] font-semibold h-11 px-8 rounded-[4px] shadow-none"
               >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isLogin ? "Log In" : "Sign Up"}
               </Button>
            </div>
         </form>
         
         <div className="mt-auto pt-12">
            <p className="text-[12px] text-slate-500 font-medium">
               Authorized personnel only. Access restricted to internal network.
            </p>
         </div>
      </div>

      {/* Right Banner Section */}
      <div className="hidden lg:flex flex-1 relative bg-[#1A365D] overflow-hidden items-center justify-center">
         
         {/* Abstract background elements */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
            <svg viewBox="0 0 1000 1000" className="w-full h-full object-cover">
               <path d="M0,500 C300,800 600,200 1000,500 L1000,1000 L0,1000 Z" fill="#ffffff" />
               <circle cx="850" cy="800" r="150" fill="#ffffff" />
               <polygon points="100,100 200,300 0,300" fill="#ffffff" />
            </svg>
         </div>
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400 rounded-full blur-[140px] opacity-10 pointer-events-none" />

         <div className="relative z-10 w-full max-w-2xl px-16 flex flex-col items-start text-white">
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-[1.1] mb-6">
               Welcome to the SCE Portal.
            </h2>
            <p className="text-lg md:text-xl text-blue-50 leading-relaxed max-w-xl mb-12 font-medium opacity-90">
               Your centralized hub to integrate with campus life. Explore AI-powered insights, manage your academics, connect with peers, and track your engineering journey.
            </p>
            
            <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-lg">
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                     <Brain className="h-5 w-5 text-blue-50" />
                  </div>
                  <span className="text-[13px] font-semibold text-blue-50 leading-tight">AI Mentorship</span>
               </div>
               
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                     <Building className="h-5 w-5 text-blue-50" />
                  </div>
                  <span className="text-[13px] font-semibold text-blue-50 leading-tight">Campus Map & Facilities</span>
               </div>
               
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                     <GraduationCap className="h-5 w-5 text-blue-50" />
                  </div>
                  <span className="text-[13px] font-semibold text-blue-50 leading-tight">Academic Roadmap</span>
               </div>
            </div>

            <p className="text-[14px] text-blue-200 font-medium mb-5">
               Use authorized college credentials to continue.
            </p>
            
            <a href="#" className="inline-flex items-center text-[14px] font-semibold text-white hover:text-blue-200 transition-colors border-b border-blue-400/30 hover:border-blue-200 pb-0.5">
               Learn more <span className="ml-2">→</span>
            </a>
         </div>
         
         {/* Decorative curly braces */}
         <div className="absolute top-24 right-32 text-[300px] leading-none font-bold text-white/[0.03] pointer-events-none select-none font-mono">
            &#123; &#125;
         </div>
         
         {/* Decorative asterisk */}
         <div className="absolute -bottom-16 -right-16 text-[400px] leading-none font-bold text-white/[0.03] pointer-events-none select-none">
            *
         </div>

      </div>
    </div>
  )
}

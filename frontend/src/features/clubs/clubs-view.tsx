import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "@/components/error-boundary"
import { ClubRegistrationModal } from "./club-registration-modal"
import { cn } from "@/lib/utils"
import { Trophy, ChevronDown, ChevronUp } from "lucide-react"

const CATEGORIES = [
  {
    id: "technical",
    label: "Technical Clubs",
    clubs: [
      { name: "Web Cell (Delta Force)", achievement: "Built the official CampusOS portal used by 5000+ students daily." },
      { name: "R&D Cell", achievement: "Published 20+ research papers in international journals last year." },
      { name: "Nakshatra (Astronomy)", achievement: "Discovered a minor exoplanet candidate during the NASA space apps challenge." },
      { name: "Aero Modelling", achievement: "Won 1st place in the National Drone Racing Championship 2024." },
      { name: "PSI Racing (Motorsports)", achievement: "Designed and manufactured an F1-style race car for SAE SUPRA." },
      { name: "Designers Club", achievement: "Redesigned the college magazine and UI for all campus applications." },
      { name: "Builders Hive (Civil)", achievement: "Constructed a sustainable rainwater harvesting model for the campus." },
      { name: "RMI (Robotics)", achievement: "Secured top 10 at the International Robotics Challenge in Japan." },
      { name: "E-Cell", achievement: "Incubated 5 student startups that raised seed funding." },
      { name: "Business/Finance/Consulting", achievement: "Organized the largest mock stock exchange event with 1000+ participants." },
      { name: "Maths & Algorithms", achievement: "Consistent top performers in ACM ICPC regional rounds." },
    ]
  },
  {
    id: "social",
    label: "Social Service Groups",
    clubs: [
      { name: "IGNITTE", achievement: "Trained 500+ rural students for competitive exams with a 90% success rate." },
      { name: "Prakruthi", achievement: "Planted 10,000+ saplings around the campus and nearby villages." },
      { name: "Omega", achievement: "Organized state-wide medical and blood donation camps." },
      { name: "TaskForce", achievement: "Rapid response team for campus events and emergency crowd management." },
      { name: "NSS / NCC", achievement: "Received the Best Unit award from the State Directorate." },
    ]
  },
  {
    id: "cultural",
    label: "Cultural & Fine Arts",
    clubs: [
      { name: "Amruthavarshini", achievement: "Won overall championship in Festember for 3 consecutive years." },
      { name: "SPIC-MACAY", achievement: "Hosted Grammy-winning classical artists for campus concerts." },
      { name: "The Thespians' Society", achievement: "Performed critically acclaimed street plays on social issues across the state." },
      { name: "Film Society", achievement: "Produced a short film that was screened at the Mumbai International Film Festival." },
      { name: "Graphique", achievement: "Hosted a national level art exhibition featuring student masterpieces." },
    ]
  },
  {
    id: "literary",
    label: "Language & Literary",
    clubs: [
      { name: "Tamil Mandram", achievement: "Organized state-level Pattimandram with renowned speakers." },
      { name: "Quiz & Debate Club", achievement: "National finalists in the Tata Crucible Campus Quiz." },
      { name: "Aayaam", achievement: "Published the annual trilingual college anthology." },
      { name: "Literary Society", achievement: "Hosted MUN with delegates from over 50 colleges nationwide." },
    ]
  }
]

function ClubCard({ club }: { club: { name: string, achievement: string } }) {
  const [expanded, setExpanded] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <>
      <div className="border border-border bg-surface rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 text-left outline-none"
        >
          <span className="font-semibold text-text text-lg">{club.name}</span>
          <div className="text-muted">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>
        
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-border bg-surface-2/30 pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-0.5 bg-amber-500/10 p-1.5 rounded-lg text-amber-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Core Contribution</span>
                    <p className="text-sm text-text leading-relaxed">{club.achievement}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                >
                  Join {club.name}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ClubRegistrationModal 
        clubName={club.name} 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        onSuccess={() => setExpanded(false)}
      />
    </>
  )
}

function ClubsViewContent() {
  const [activeTab, setActiveTab] = React.useState(CATEGORIES[0].id)
  
  const activeCategory = CATEGORIES.find(c => c.id === activeTab)

  return (
    <div className="flex h-full flex-col p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full gap-8 pb-24 lg:pb-8 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">Student Clubs & Societies</h1>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Discover and join communities that match your passions. Explore our diverse range of technical cells, 
          social service groups, cultural societies, and literary clubs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2 border-b border-border">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={cn(
              "px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2",
              activeTab === category.id 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-muted hover:text-text hover:bg-surface-2"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCategory?.clubs.map((club, idx) => (
          <ClubCard key={idx} club={club} />
        ))}
      </div>
    </div>
  )
}

export function ClubsView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Clubs.">
       <ClubsViewContent />
    </ErrorBoundary>
  )
}

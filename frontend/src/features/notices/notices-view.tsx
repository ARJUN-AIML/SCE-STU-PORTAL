import * as React from "react"
import { useState } from "react"
import { Search, FileText, Download, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ErrorBoundary } from "@/components/error-boundary"

const FALLBACK_NOTICES = [
  {
    "id": 1,
    "type": "Placement",
    "title": "Zoho Off-Campus Drive 2026",
    "date": "Oct 15, 2026",
    "brief": "Zoho Corporation is conducting an off-campus placement drive for final-year engineering students. Roles include Software Developer and QA Engineer. Ensure your resumes are updated.",
    "pdfLink": "/1. ZOHO PLACEMENT DRIVE.pdf"
  },
  {
    "id": 2,
    "type": "Event",
    "title": "NIT Trichy Pragyan - National Hackathon",
    "date": "Oct 20, 2026",
    "brief": "Participate in the 24-hour national-level hackathon at NIT Trichy. Problem statements cover Web3, AI, and Sustainable Tech. Transport will be arranged for registered teams.",
    "pdfLink": "/downloads/pragyan_hackathon.pdf"
  },
  {
    "id": 3,
    "type": "Workshop",
    "title": "High-Performance Computing & CUDA Architecture",
    "date": "Oct 22, 2026",
    "brief": "A two-day hands-on workshop focusing on GPU architecture, memory optimization, and CUDA programming. Open to 3rd and 4th-year students.",
    "pdfLink": "/downloads/cuda_workshop_schedule.pdf"
  },
  {
    "id": 4,
    "type": "Academic",
    "title": "Odd Semester End Practical Exam Schedule",
    "date": "Nov 02, 2026",
    "brief": "The finalized schedule for the Odd Semester practical examinations has been released. Please check your department-specific dates and batch timings.",
    "pdfLink": "/downloads/practical_exam_timetable.pdf"
  },
  {
    "id": 5,
    "type": "Admin",
    "title": "Tuition Fee Payment Deadline",
    "date": "Nov 15, 2026",
    "brief": "The last date to pay the even semester tuition fee without a fine is November 15th. Payments can be made via the student portal or at the college office.",
    "pdfLink": "/downloads/fee_structure_guidelines.pdf"
  },
  {
    "id": 6,
    "type": "Extracurricular",
    "title": "NSS Blood Donation Camp",
    "date": "Nov 18, 2026",
    "brief": "The college NSS unit, in association with Trichy Government Hospital, is organizing a blood donation camp in the main auditorium. All eligible students are encouraged to participate.",
    "pdfLink": "/downloads/blood_donation_consent.pdf"
  },
  {
    "id": 7,
    "type": "Placement",
    "title": "TCS Ninja & Digital Mock Interview Phase 2",
    "date": "Nov 25, 2026",
    "brief": "The placement cell is conducting the second phase of mock interviews for TCS Ninja and Digital profiles. Attendance is mandatory for registered students.",
    "pdfLink": "/downloads/tcs_mock_interview_slots.pdf"
  }
]

import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"


function NoticesViewContent() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotices = React.useMemo(() => FALLBACK_NOTICES.filter((n) => {
    return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           n.brief.toLowerCase().includes(searchQuery.toLowerCase())
  }), [searchQuery])

  return (
    <div className="flex flex-col gap-6 pb-20 p-4 md:p-6 mx-auto w-full max-w-4xl animate-in fade-in-0 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-text">Announcements</h1>
          <p className="text-muted text-sm mt-1">Latest updates and circulars from the college.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices..." 
              className="pl-9 bg-surface border-border text-sm" 
            />
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-4">
        {filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-surface">
            <FileText className="h-10 w-10 text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-text mb-1">No notices found</h3>
            <p className="text-sm text-muted">Try adjusting your search query.</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <Card 
              key={notice.id} 
              className="border-border bg-surface hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer overflow-hidden group"
              onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-surface-2 text-text border-border font-medium px-2 py-0.5 shadow-sm">
                      {notice.type}
                    </Badge>
                    <span className="text-sm text-muted font-medium">{notice.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-text group-hover:text-primary transition-colors">
                    {notice.title}
                  </h3>
                </div>
                <div className="text-muted group-hover:text-primary transition-colors hidden sm:block">
                  {expandedId === notice.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedId === notice.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-3 border-t border-border bg-surface-2/30">
                      <p className="text-text leading-relaxed mb-5 text-sm md:text-base">
                        {notice.brief}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full sm:w-auto shadow-sm" onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = notice.pdfLink;
                          link.download = notice.pdfLink.split('/').pop() || 'notice.pdf';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Notice (PDF)
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto shadow-sm" onClick={(e) => {
                          e.stopPropagation();
                          window.open(notice.pdfLink, "_blank");
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export function NoticesView() {
  return (
    <ErrorBoundary fallbackMessage="Could not load Notices module.">
       <NoticesViewContent />
    </ErrorBoundary>
  )
}


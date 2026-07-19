import timetableDataset from "./timetable-dataset.json"

export const demoData: Record<string, any> = {
  default: {
    health: { status: "live", version: "2.1.0" },
    schedule: timetableDataset,
    events: [
      { id: "e1", title: "SIH Grand Finale", category: "Hackathon", date: "Aug 20", location: "Main Auditorium", attendees: 540, status: "upcoming", matchScore: 98, reason: "Matches your interest in competitive programming.", imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" },
      { id: "e2", title: "AI Workshop", category: "Technical", date: "Sep 5", location: "Lab 3", attendees: 120, status: "upcoming", matchScore: 95, reason: "Required for your Machine Learning specialization.", imageUrl: "https://images.unsplash.com/photo-1485827404727-83b0f56a1571?auto=format&fit=crop&w=600&q=80" }
    ],
    clubs: [
      { id: "c1", name: "AI/ML Society", category: "Tech", members: 210, matchScore: 94, reason: "Strong synergy with your recent Python courses." },
      { id: "c2", name: "Debate Club", category: "Cultural", members: 85, matchScore: 60, reason: "Good for improving soft skills." }
    ],
    faculty: [
      { id: "f1", name: "Dr. A. Sharma", department: "Computer Science", expertise: ["AI", "Machine Learning"], office: "Block A, Room 301" },
      { id: "f2", name: "Prof. S. Gupta", department: "Computer Science", expertise: ["Data Structures", "Algorithms"], office: "Block A, Room 302" }
    ],
    notices: [
      { id: "n1", title: "Semester Fee Deadline", date: "2026-07-25", category: "administration", summary: "All students must pay semester fees by July 25 to avoid late fines. Visit the accounts office or pay online.", fileUrl: "", isUrgent: true },
      { id: "n2", title: "Library Maintenance", date: "2026-07-20", category: "library", summary: "The central library will be closed on July 20 for scheduled maintenance. Online resources and e-books remain accessible.", fileUrl: "", isUrgent: false },
      { id: "n3", title: "Midterm Exam Schedule Released", date: "2026-08-01", category: "academics", summary: "Midterm schedules for all departments have been published. Check the Exams portal for date, time and venue details.", fileUrl: "/docs/midterm-schedule.pdf", isUrgent: true },
      { id: "n4", title: "Placement Drive: Company XYZ", date: "2026-08-10", category: "placements", summary: "Company XYZ will conduct on-campus recruitment for software developer roles. Eligible students must register by Aug 5.", fileUrl: "", isUrgent: false },
      { id: "n5", title: "Guest Lecture: AI Ethics", date: "2026-07-30", category: "seminar", summary: "Guest lecture on AI Ethics by Prof. R. Kumar in the Seminar Hall at 3:00 PM. All students and faculty are welcome.", fileUrl: "", isUrgent: false }
    ],
    resources: [
      { id: "r1", title: "AI Syllabus", type: "PDF", course: "CS-401" }
    ],
    transport: [
      { id: "t1", routeName: "Route 1 - City Center", busNumber: "TN-45-AT-1234", driverName: "Ramesh", driverPhone: "9876543210", status: "on-time", stops: [
        { name: "City Center", time: "07:30 AM" },
        { name: "Main Junction", time: "07:45 AM" },
        { name: "Campus", time: "08:15 AM" }
      ]}
    ],
    library: [
      { id: "l1", title: "Introduction to Algorithms", type: "book", category: "Computer Science", link: "#", author: "Thomas H. Cormen" },
      { id: "l2", title: "CS PYQ 2024", type: "pyq", category: "Exam Papers", link: "#", author: "University" }
    ]
  },
  freshers: {
    // Specific overrides for the freshers scenario
    events: [
      { id: "f_e1", title: "Freshers Orientation", category: "General", date: "Aug 1", location: "Main Auditorium", attendees: 1200, status: "upcoming", matchScore: 100, reason: "Mandatory for all first-year students.", imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80" },
      { id: "f_e2", title: "Campus Tour", category: "General", date: "Aug 2", location: "Main Gate", attendees: 400, status: "upcoming", matchScore: 90, reason: "Highly recommended to familiarize yourself with facilities.", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  placements: {
    events: [
      { id: "p_e1", title: "Resume Building Session", category: "Career", date: "Aug 10", location: "Seminar Hall", attendees: 300, status: "upcoming", matchScore: 99, reason: "Critical for your upcoming placement drive.", imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" },
      { id: "p_e2", title: "Mock Interviews", category: "Career", date: "Aug 15", location: "Block B", attendees: 150, status: "upcoming", matchScore: 95, reason: "Practice for technical rounds.", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" }
    ]
  }
}

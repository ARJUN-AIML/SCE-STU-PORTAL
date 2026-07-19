import * as React from "react"
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  Download,
  FileText,
  FlaskConical,
  Globe2,
  MonitorPlay,
  Play,
  Search,
  X,
} from "lucide-react"

type Resource = {
  id: number
  title: string
  subject: string
  type: "PDF" | "PPT"
  semester: "Semester 1" | "Semester 2"
  category: string
  updated: string
}

const categories = [
  { label: "Semester Books", icon: BookOpen, color: "violet" },
  { label: "Notes", icon: FileText, color: "amber" },
  { label: "Previous Year Question Papers", icon: FileText, color: "rose" },
  { label: "Lab Manuals", icon: FlaskConical, color: "cyan" },
  { label: "Programming Resources", icon: Code2, color: "blue" },
  { label: "Video Tutorials", icon: MonitorPlay, color: "emerald" },
]

const resources: Resource[] = [
  { id: 1, title: "Engineering Mathematics — Complete Guide", subject: "Mathematics I", type: "PDF", semester: "Semester 1", category: "Semester Books", updated: "Today" },
  { id: 2, title: "Engineering Physics: Key Concepts", subject: "Engineering Physics", type: "PDF", semester: "Semester 1", category: "Notes", updated: "Yesterday" },
  { id: 3, title: "C Programming Fundamentals", subject: "Programming in C", type: "PPT", semester: "Semester 1", category: "Notes", updated: "2 days ago" },
  { id: 4, title: "Engineering Chemistry — Unit Notes", subject: "Engineering Chemistry", type: "PDF", semester: "Semester 2", category: "Notes", updated: "3 days ago" },
  { id: 5, title: "Data Structures Question Paper 2025", subject: "Data Structures", type: "PDF", semester: "Semester 2", category: "Previous Year Question Papers", updated: "5 days ago" },
  { id: 6, title: "Workshop Practice Lab Manual", subject: "Engineering Workshop", type: "PDF", semester: "Semester 1", category: "Lab Manuals", updated: "1 week ago" },
]

const programming = [
  { name: "Python", icon: "🐍", description: "Start coding with Python fundamentals, syntax, and small projects.", url: "https://www.w3schools.com/python/" },
  { name: "C Programming", icon: "C", description: "Master the building blocks of programming with C examples.", url: "https://www.geeksforgeeks.org/c-programming-language/" },
  { name: "HTML", icon: "</>", description: "Build your first webpages with semantic HTML structure.", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS", icon: "✦", description: "Style responsive, accessible interfaces from the ground up.", url: "https://www.w3schools.com/css/" },
  { name: "Java Basics", icon: "☕", description: "Learn object-oriented programming with beginner Java lessons.", url: "https://dev.java/learn/" },
]

const videos = [
  { title: "Calculus in 30 Minutes", duration: "32 min", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=720&q=80", url: "https://www.youtube.com/results?search_query=calculus+for+engineering+students" },
  { title: "C Programming for Beginners", duration: "48 min", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=720&q=80", url: "https://www.youtube.com/results?search_query=C+programming+for+beginners" },
  { title: "How to Write Better Lab Records", duration: "18 min", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=720&q=80", url: "https://www.youtube.com/results?search_query=how+to+write+engineering+lab+record" },
]

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return <div className="library-section-heading"><div>{eyebrow && <p className="library-eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action && <button className="library-text-button">{action}<ArrowRight size={15} /></button>}</div>
}

export function LibraryView() {
  const [query, setQuery] = React.useState("")
  const [semester, setSemester] = React.useState("All semesters")
  const [subject, setSubject] = React.useState("All subjects")
  const [type, setType] = React.useState("All types")
  const [preview, setPreview] = React.useState<Resource | null>(null)

  const filtered = React.useMemo(() => resources.filter((resource) => {
    const text = `${resource.title} ${resource.subject} ${resource.category}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (semester === "All semesters" || resource.semester === semester) && (subject === "All subjects" || resource.subject === subject) && (type === "All types" || resource.type === type)
  }), [
	query,
	semester,
	subject,
	type
])

  const download = (resource: Resource) => {
    const blob = new Blob([`${resource.title}\n${resource.subject}\n${resource.semester}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${resource.title}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <div className="library-page">
    <section className="library-hero">
      <div><span className="library-kicker"><span className="library-kicker-dot" /> Your academic space</span><h1>Library</h1><p>Find all your first-year study materials in one place.</p></div>
      <div className="library-hero-art"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><BookOpen size={82} strokeWidth={1.2} /></div>
      <label className="library-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books, notes, subjects..." aria-label="Search resources" /><kbd>⌘ K</kbd></label>
    </section>

    <section><SectionHeading eyebrow="Browse by topic" title="Quick categories" /><div className="library-category-grid">{categories.map(({ label, icon: Icon, color }) => <button key={label} className="library-category-card" onClick={() => setQuery(label === "Programming Resources" ? "" : label)}><span className={`category-icon category-${color}`}><Icon size={21} /></span><span>{label}</span><ArrowRight className="category-arrow" size={17} /></button>)}</div></section>

    <section><SectionHeading eyebrow="Your curriculum" title="Semester resources" action="View all resources" /><div className="library-filter-bar"><div className="library-result-count"><span className="count-badge">{filtered.length}</span> resources found</div><div className="library-filters">{[["semester", semester, setSemester, ["All semesters", "Semester 1", "Semester 2"]], ["subject", subject, setSubject, ["All subjects", "Mathematics I", "Engineering Physics", "Programming in C", "Engineering Chemistry", "Data Structures", "Engineering Workshop"]], ["type", type, setType, ["All types", "PDF", "PPT"]]].map(([key, value, setter, options]) => <label key={key as string} className="library-select"><span>{key === "semester" ? "Semester" : key === "subject" ? "Subject" : "Type"}</span><select value={value as string} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)}>{(options as string[]).map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></label>)}</div></div>
      <div className="resource-grid">{filtered.map((resource) => <article className="resource-card" key={resource.id}><div className="resource-card-top"><span className={`file-icon file-${resource.type.toLowerCase()}`}><FileText size={20} /></span><span className="file-type">{resource.type}</span></div><div><h3>{resource.title}</h3><p>{resource.subject}</p></div><div className="resource-card-footer"><span>{resource.semester} <span className="footer-dot">•</span> {resource.updated}</span><div className="resource-actions"><button className="preview-button" onClick={() => setPreview(resource)}>Preview</button><button className="download-button" onClick={() => download(resource)} aria-label={`Download ${resource.title}`}><Download size={15} /></button></div></div></article>)}</div>{filtered.length === 0 && <div className="library-empty"><Search size={28} /><h3>No resources found</h3><p>Try a different search or filter combination.</p></div>}</section>

    <section><SectionHeading eyebrow="Build your skills" title="Programming resources" /><div className="programming-grid">{programming.map((item) => <article className="programming-card" key={item.name}><span className="programming-icon">{item.icon}</span><h3>{item.name}</h3><p>{item.description}</p><a className="programming-link" href={item.url} target="_blank" rel="noreferrer">Open <ArrowRight size={15} /></a></article>)}</div></section>

    <section><div className="library-section-heading"><div><p className="library-eyebrow">Learn at your pace</p><h2>Video tutorials</h2></div><a className="library-text-button" href="https://www.youtube.com/results?search_query=first+year+engineering+tutorials" target="_blank" rel="noreferrer">See all videos <ArrowRight size={15} /></a></div><div className="video-grid">{videos.map((video) => <article className="video-card" key={video.title}><a className="video-thumbnail" href={video.url} target="_blank" rel="noreferrer" aria-label={`Watch ${video.title}`}><img src={video.image} alt="" /><span className="video-duration">{video.duration}</span><span className="play-button"><Play size={17} fill="currentColor" /></span></a><div className="video-card-content"><h3>{video.title}</h3><a href={video.url} target="_blank" rel="noreferrer">Watch <ArrowRight size={15} /></a></div></article>)}</div></section>

    <section className="recent-section"><SectionHeading eyebrow="Fresh from the community" title="Recent uploads" action="View upload history" /><div className="recent-list">{resources.slice(0, 4).map((resource) => <div className="recent-item" key={resource.id}><span className={`file-icon file-${resource.type.toLowerCase()}`}><FileText size={18} /></span><div><h3>{resource.title}</h3><p>{resource.subject} <span>•</span> Uploaded {resource.updated.toLowerCase()}</p></div><button className="recent-download" onClick={() => download(resource)}><Download size={15} /> <span>Download</span></button></div>)}</div></section>

    {preview && <div className="library-modal-backdrop" role="presentation" onClick={() => setPreview(null)}><div className="library-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setPreview(null)} aria-label="Close preview"><X size={18} /></button><span className={`file-icon file-${preview.type.toLowerCase()}`}><FileText size={23} /></span><p className="library-eyebrow">{preview.type} preview</p><h2 id="preview-title">{preview.title}</h2><p>{preview.subject} · {preview.semester}</p><div className="modal-preview-placeholder"><Check size={18} /> This resource is ready to view in a new tab.</div><button className="modal-primary" onClick={() => download(preview)}><Download size={16} /> Download resource</button></div></div>}
  </div>
}

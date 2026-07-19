import * as React from "react"
import { useState } from "react"
import { Search, Plus, MapPin, Calendar, CheckCircle, Upload, X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const mockItems = [
  {
    id: "lf1",
    title: "Black HP Laptop Charger",
    type: "Lost",
    date: "Today, 10:30 AM",
    location: "Library Reading Room",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    status: "active"
  },
  {
    id: "lf2",
    title: "Titan Men's Watch",
    type: "Found",
    date: "Yesterday, 4:00 PM",
    location: "Basketball Court",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    status: "active"
  },
  {
    id: "lf3",
    title: "College ID Card - CSE",
    type: "Found",
    date: "Jul 15, 2:15 PM",
    location: "Canteen Area",
    image: "https://images.unsplash.com/photo-1587282862804-0370f5e1b4b7?w=800&q=80",
    status: "active"
  }
]

export function LostFoundView() {
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setUploadStep(1) // Analyzing Image
    setTimeout(() => setUploadStep(2), 1500) // Finding Matches
    setTimeout(() => {
       setIsUploading(false)
       setSearchQuery("watch") // simulate finding the matching item
       setShowUploadModal(false)
    }, 3000)
  }

  const filtered = mockItems.filter((item) => {
    if (activeTab !== "All" && item.type !== activeTab) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-text">Lost & Found</h1>
          <p className="text-muted text-sm mt-1">Report lost items or claim found ones.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..." 
              className="pl-9 bg-surface border-border" 
            />
          </div>
          <Button onClick={() => setShowUploadModal(true)} variant="default" className="shrink-0 shadow-md">
            <Plus className="h-4 w-4 mr-2" /> Report Item
          </Button>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
           <Card className="w-full max-w-md border-border shadow-lg">
             <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-semibold text-lg">Report Item via Image</h3>
                   <button onClick={() => setShowUploadModal(false)}><X className="h-5 w-5 text-muted hover:text-text" /></button>
                </div>
                
                {!isUploading ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer" onClick={handleUpload}>
                     <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                       <Upload className="h-5 w-5" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-text">Upload Image of Item</p>
                       <p className="text-xs text-muted mt-1">JPG, PNG up to 5MB</p>
                     </div>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                     <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                     <h4 className="font-semibold text-text mb-2">AI Image Processing</h4>
                     <div className="space-y-2 w-full max-w-[200px] text-left mx-auto">
                        <div className={`flex items-center gap-2 text-sm ${uploadStep >= 1 ? 'text-text' : 'text-muted'}`}>
                          {uploadStep >= 1 ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border border-muted" />}
                          Analyzing Features...
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${uploadStep >= 2 ? 'text-text' : 'text-muted'}`}>
                          {uploadStep >= 2 ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border border-muted" />}
                          Finding Similarity Match...
                        </div>
                     </div>
                  </div>
                )}
             </CardContent>
           </Card>
        </div>
      )}

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {["All", "Lost", "Found", "Resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeTab === tab 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-surface text-muted border-border hover:bg-surface-2 hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="border-border bg-surface hover:shadow-md transition-shadow overflow-hidden group flex flex-col h-full">
             <div className="relative h-32 w-full">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <Badge className={`absolute top-2 left-2 shadow-sm border-none backdrop-blur-md ${item.type === 'Lost' ? 'bg-danger/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
                  {item.type}
                </Badge>
             </div>
             <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-display font-semibold text-text text-sm leading-snug mb-3 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="space-y-1.5 mt-auto mb-4">
                   <div className="flex items-center gap-1.5 text-xs text-muted">
                     <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{item.location}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-muted">
                     <Calendar className="h-3 w-3 shrink-0" /> <span className="truncate">{item.date}</span>
                   </div>
                </div>

                <Button variant={item.type === 'Lost' ? 'outline' : 'default'} size="sm" className="w-full text-xs h-8">
                  {item.type === 'Lost' ? 'I found this' : 'Claim Item'}
                </Button>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

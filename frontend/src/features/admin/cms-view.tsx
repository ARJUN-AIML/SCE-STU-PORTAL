import * as React from "react"
import { Upload, File, Search, Trash2, RefreshCw, Folder, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"


export function CmsView() {
  const [documents, setDocuments] = React.useState([
    { id: 1, name: "Academic_Regulations_2024.pdf", type: "PDF", category: "Academics", date: "2024-05-12", status: "Indexed" },
    { id: 2, name: "Hostel_Rules.docx", type: "DOCX", category: "Facilities", date: "2024-06-01", status: "Indexed" },
    { id: 3, name: "Transport_Routes.csv", type: "CSV", category: "Transport", date: "2024-07-15", status: "Pending" },
  ])
  const [search, setSearch] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setDocuments([{
        id: Date.now(),
        name: "New_Document_Upload.pdf",
        type: "PDF",
        category: "General",
        date: new Date().toISOString().split('T')[0],
        status: "Pending"
      }, ...documents])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(d => d.id !== id))
  }

  const filtered = documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-full flex-col p-6 max-w-[1200px] mx-auto w-full gap-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">Content Manager (CMS)</h1>
          <p className="text-sm text-muted mt-1">Manage documents, PDFs, and assets for the AI Knowledge Base.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert("Re-indexing started!")} className="flex items-center gap-2 px-4 py-2 bg-surface-2 text-text rounded-xl font-medium text-sm hover:bg-border transition-colors border border-border">
            <RefreshCw className="h-4 w-4" /> Re-index to RAG
          </button>
          <button onClick={handleUpload} disabled={isUploading} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors">
            {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Search documents by name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-transparent border-none focus-visible:ring-0 shadow-none"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-2 text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Upload Date</th>
                <th className="px-6 py-4 font-medium">RAG Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    <Folder className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    No documents found.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text flex items-center gap-3">
                      <File className="h-4 w-4 text-primary" /> {doc.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-surface-2 rounded text-xs text-muted font-medium">{doc.category}</span>
                    </td>
                    <td className="px-6 py-4 text-muted font-mono text-xs">{doc.type}</td>
                    <td className="px-6 py-4 text-muted">{doc.date}</td>
                    <td className="px-6 py-4">
                      {doc.status === "Indexed" ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded w-fit">
                          <CheckCircle className="h-3 w-3" /> Indexed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-500 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded w-fit">
                          <AlertCircle className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

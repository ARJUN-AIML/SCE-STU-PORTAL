import { useState, useEffect } from "react"
import { Database, FileText, Activity, RefreshCw, Layers } from "lucide-react"

export function KnowledgeDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/admin/knowledge/metrics")
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const handleRebuild = async () => {
    if (!confirm("Are you sure you want to completely rebuild the vector database? This will clear all existing embeddings.")) return
    
    try {
      await fetch("http://localhost:8000/admin/knowledge/rebuild", { method: "POST" })
      alert("Rebuild started in the background. It may take a few minutes depending on dataset size.")
    } catch (_e) {
      alert("Failed to start rebuild.")
    }
  }

  if (loading) return <div className="p-8">Loading metrics...</div>

  const metrics = data?.metrics || {}
  const documents = data?.documents || []

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Monitor ingestion, vector embeddings, and RAG health.</p>
        </div>
        <button 
          onClick={handleRebuild}
          className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Rebuild Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-sm">Indexed Documents</h3>
          </div>
          <div className="text-3xl font-bold">{metrics.total_documents || 0}</div>
        </div>
        
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Layers className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium text-sm">Semantic Chunks</h3>
          </div>
          <div className="text-3xl font-bold">{metrics.total_chunks || 0}</div>
        </div>
        
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Database className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-sm">Vector Count (Chroma)</h3>
          </div>
          <div className="text-3xl font-bold">{metrics.vector_count || 0}</div>
        </div>
        
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Activity className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium text-sm">OCR Processed</h3>
          </div>
          <div className="text-3xl font-bold">{metrics.ocr_processed || 0}</div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">Ingestion Pipeline</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Document Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Chunks</th>
                <th className="px-6 py-3 font-medium">OCR Used</th>
                <th className="px-6 py-3 font-medium">Indexed At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No documents indexed yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{doc.name}</td>
                    <td className="px-6 py-4 uppercase text-xs">{doc.type?.replace('.', '') || 'UNKNOWN'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                        doc.status === 'success' ? 'bg-green-100 text-green-700' :
                        doc.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{doc.chunks}</td>
                    <td className="px-6 py-4">{doc.ocr ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

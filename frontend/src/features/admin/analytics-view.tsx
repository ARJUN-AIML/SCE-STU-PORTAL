import * as React from "react"
import { BarChart, Users, Database, FileText, Activity, Server, Clock, Zap } from "lucide-react"

export function AnalyticsView() {
  return (
    <div className="flex h-full flex-col p-6 max-w-[1200px] mx-auto w-full gap-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text">System Analytics</h1>
          <p className="text-sm text-muted mt-1">Real-time metrics for AI, Database, and Platform performance.</p>
        </div>
        <div className="flex gap-2 items-center px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          System Healthy
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Faculty</span>
          </div>
          <span className="text-3xl font-bold text-text">142</span>
          <span className="text-xs text-emerald-500 font-medium">+12 Departments</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted mb-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Knowledge Docs</span>
          </div>
          <span className="text-3xl font-bold text-text">84</span>
          <span className="text-xs text-muted font-medium">Across all vectors</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Database className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Indexed Chunks</span>
          </div>
          <span className="text-3xl font-bold text-text">7,013</span>
          <span className="text-xs text-emerald-500 font-medium">ChromaDB Synced</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider">AI Questions</span>
          </div>
          <span className="text-3xl font-bold text-text">1,248</span>
          <span className="text-xs text-emerald-500 font-medium">+15% this week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl">
          <h3 className="font-semibold text-text mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Performance Metrics
          </h3>
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Average Retrieval Time (RAG)</span>
                <span className="font-mono text-text">240ms</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[24%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Average AI Response Time</span>
                <span className="font-mono text-text">1.2s</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[60%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Database Latency</span>
                <span className="font-mono text-text">45ms</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[15%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl">
          <h3 className="font-semibold text-text mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" /> System Status
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-surface-2/50 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-text">PostgreSQL Database</p>
                  <p className="text-xs text-muted">Primary Data Store</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-2/50 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-text">FastAPI Backend</p>
                  <p className="text-xs text-muted">API Gateway</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-2/50 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-text">ChromaDB Vector Store</p>
                  <p className="text-xs text-muted">AI Embeddings</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

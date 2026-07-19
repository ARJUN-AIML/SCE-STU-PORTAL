export type ThemeName = "classic" | "carbon" | "forest"
export type LangCode = "EN" | "TA"

export type AccentColor = "pink" | "blue" | "green" | "purple"

export * from "./schemas"

export interface ResourceFile {
  id: string
  name: string
  kind: "pdf" | "docx" | "json" | "pptx"
}

export interface DevMetrics {
  indexed_documents: number;
  indexed_chunks: number;
  embedding_model: string;
  collection_name: string;
  top_k: number;
  retrieval_time_ms: number;
  llm_time_ms: number;
  ttft_ms?: number;
  retrieved_chunks: Array<{
    source: string;
    score: number;
    preview: string;
  }>;
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
  sources?: string[]
  devMetrics?: DevMetrics
  follow_ups?: string[]
  confidence?: string
  widget?: any
  pipeline?: any
}

export interface RegisterFormValues {
  name: string
  email: string
  rollNumber: string
  notes?: string
}

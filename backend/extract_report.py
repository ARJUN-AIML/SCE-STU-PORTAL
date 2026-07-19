import codecs
import json
import os

def get_text(filename):
    try:
        with codecs.open(filename, "r", "utf-16le") as f:
            text = f.read()
            if text.startswith("\ufeff"):
                text = text[1:]
            return text
    except Exception:
        pass
        
    try:
        with codecs.open(filename, "r", "utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading {filename}: {e}"

audit_text = get_text("audit_log.txt")
test_text = get_text("test_final_log.txt")

report_path = r"C:\Users\arjun\.gemini\antigravity\brain\ce2b5e59-30c0-41bb-842b-9532c146003c\report.md"
with codecs.open(report_path, "w", "utf-8") as f:
    f.write("# Campus OS AI Assistant - Final Production Report\n\n")
    
    f.write("## 1. Files Modified\n")
    f.write("- `backend/ai/prompts.py` (Improved hallucination fallback, added follow-up gen)\n")
    f.write("- `backend/ai/assistant.py` (Implemented confidence scoring)\n")
    f.write("- `backend/websocket/socket.py` (Handled follow-ups and streaming integration)\n")
    f.write("- `frontend/src/types/index.ts` (Extended ChatMessage interface)\n")
    f.write("- `frontend/src/components/ai-assistant-card.tsx` (Integrated VITE_DEV_MODE diagnostics, sources, and confidence badge)\n")
    f.write("- `frontend/src/components/command-palette.tsx` (Enhanced fallback search to redirect to AI Drawer)\n\n")

    f.write("## 2. Improvements Made\n")
    f.write("- Added explainable AI metrics via Dev Mode\n")
    f.write("- Re-integrated structured source citations directly in chat bubble\n")
    f.write("- Ensured all TypeScript builds succeed with `noEmit`\n\n")
    
    f.write("## 3. Dataset Audit\n")
    f.write("```\n")
    f.write(audit_text)
    f.write("```\n\n")
    
    f.write("## 4. Functional Validation & RAG Performance\n")
    f.write("```\n")
    f.write(test_text)
    f.write("```\n\n")
    
    f.write("## 5. Remaining Limitations & Recommendations\n")
    f.write("- The assistant grounds responses using Retrieval-Augmented Generation (RAG) over indexed institutional documents. When sufficient evidence is unavailable, it explicitly communicates uncertainty and avoids fabricating information.\n")
    f.write("- Latency for LLM generation is highly dependent on the chosen remote API. Implementing a streaming token-by-token integration at the FastAPI level is recommended for production.\n")

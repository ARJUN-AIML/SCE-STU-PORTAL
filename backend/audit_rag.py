import sys
import os
sys.path.append('.')

import time
from ai import config
from ai.retriever import get_vectorstore

def audit():
    print("--- RAG RETRIEVAL AUDIT ---")
    
    start = time.time()
    vectorstore = get_vectorstore(force_rebuild=False)
    
    try:
        chunks = len(vectorstore.get()["ids"])
        print("Total Chunks in DB:", chunks)
    except Exception as e:
        print("ChromaDB Error:", e)
        return
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    
    test_queries = [
        "Where is the library?",
        "Who is the HOD of CSE?",
        "What are today's events?",
        "What clubs are available?",
        "Admission process",
        "Attendance rules",
        "Fee payment",
        "Placement cell"
    ]
    
    for q in test_queries:
        print(f"\nQ: {q}")
        try:
            docs = retriever.invoke(q)
            for i, d in enumerate(docs):
                source = d.metadata.get('source_file', 'Unknown')
                content = d.page_content.replace('\n', ' ')[:80]
                print(f"  [{i+1}] Source: {source} | Content: {content}...")
        except Exception as e:
            print("  Error:", e)
        
    print(f"\nRetrieval Audit complete in {time.time() - start:.2f} seconds.")

if __name__ == '__main__':
    audit()

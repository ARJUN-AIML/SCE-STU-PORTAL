import sys
import os
from pathlib import Path
from ai.config import CHROMA_DB_DIR
import chromadb

def run_audit():
    print("==============================")
    print("DATASET AUDIT REPORT")
    print("==============================\n")
    
    if not os.path.exists(CHROMA_DB_DIR):
        print("ERROR: ChromaDB directory not found.")
        sys.exit(1)
        
    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    collections = client.list_collections()
    if not collections:
        print("ERROR: No collections found in ChromaDB.")
        sys.exit(1)
        
    collection = client.get_collection(collections[0].name)
    count = collection.count()
    print(f"Total Chunks Indexed: {count}")
    
    data = collection.get(include=["metadatas", "documents"])
    metadatas = data["metadatas"]
    documents = data["documents"]
    
    sources = set()
    missing_metadata = 0
    empty_chunks = 0
    orphan_metadata = 0
    
    for i, meta in enumerate(metadatas):
        doc = documents[i] if documents else ""
        if not doc.strip():
            empty_chunks += 1
            
        if not meta:
            missing_metadata += 1
            continue
            
        source = meta.get("source_file")
        if not source:
            orphan_metadata += 1
        else:
            sources.add(source)
            
    print(f"Unique Sources Found: {len(sources)}")
    print(f"Empty Chunks: {empty_chunks}")
    print(f"Missing Metadata: {missing_metadata}")
    print(f"Orphan Vectors (No Source): {orphan_metadata}")
    
    print("\nAudit Complete.")

if __name__ == "__main__":
    run_audit()

import collections
from . import config
from .llm import get_embeddings
from langchain_chroma import Chroma

def get_vectorstore():
    embeddings = get_embeddings()
    vectorstore = Chroma(
        persist_directory=str(config.CHROMA_DB_DIR),
        embedding_function=embeddings
    )
    return vectorstore

def print_collection_statistics(vectorstore):
    print("="*60)
    print("COLLECTION STATISTICS")
    print("="*60)
    
    collection = vectorstore._collection
    data = collection.get(include=["metadatas", "documents", "embeddings"])
    
    num_chunks = len(data.get("ids", []))
    
    if num_chunks == 0:
        print("Database is empty!")
        return
        
    embeddings = data.get("embeddings", [])
    emb_dim = len(embeddings[0]) if embeddings is not None and len(embeddings) > 0 else "Unknown"
    
    docs = data.get("documents", [])
    avg_len = sum(len(d) for d in docs) / num_chunks if num_chunks > 0 else 0
    
    metadatas = data.get("metadatas", [])
    source_files = set(m.get("source_file", "Unknown") for m in metadatas)
    doc_types = set(m.get("document_type", "Unknown") for m in metadatas)
    
    print(f"Collection Name:      {collection.name}")
    print(f"Total Files:          {len(source_files)}")
    print(f"Total Chunks:         {num_chunks}")
    print(f"Embedding Model:      {config.EMBEDDING_MODEL_NAME}")
    print(f"Embedding Dimension:  {emb_dim}")
    print(f"Average Chunk Length: {avg_len:.2f} characters")
    print(f"Document Types:       {', '.join(doc_types)}")
    print()

def list_source_files(vectorstore):
    print("="*60)
    print("SOURCE FILES AND CHUNK COUNTS")
    print("="*60)
    
    data = vectorstore._collection.get(include=["metadatas"])
    metadatas = data.get("metadatas", [])
    
    counter = collections.Counter(m.get("source_file", "Unknown") for m in metadatas)
    
    for source, count in counter.most_common():
        print(f"{source} -> {count} chunks")
    print()

def print_sample_records(vectorstore, n=5):
    print("="*60)
    print(f"SAMPLE RECORDS (First {n})")
    print("="*60)
    
    data = vectorstore._collection.get(include=["metadatas", "documents", "embeddings"], limit=n)
    ids = data.get("ids", [])
    
    if not ids:
        print("No records found.")
        return
        
    for i in range(len(ids)):
        print(f"--- Record {i+1} ---")
        print(f"ID:                  {ids[i]}")
        meta = data["metadatas"][i]
        print(f"Source file:         {meta.get('source_file', 'Unknown')}")
        print(f"Document type:       {meta.get('document_type', 'Unknown')}")
        
        doc = data["documents"][i]
        chunk_text = doc[:300].replace("\n", " ") + ("..." if len(doc) > 300 else "")
        print(f"Chunk text:          {chunk_text}")
        
        emb = data.get("embeddings")[i] if data.get("embeddings") is not None and len(data.get("embeddings")) > i else []
        if len(emb) > 0:
            print(f"Embedding dimension: {len(emb)}")
            print(f"Embedding values:    {[round(x, 4) for x in emb[:10]]} ...")
        print()

def search(vectorstore, query: str, k: int=5):
    print("="*60)
    print(f"SIMILARITY SEARCH: '{query}'")
    print("="*60)
    
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    if not results:
        print("No results found.")
        return
        
    for rank, (doc, score) in enumerate(results, start=1):
        print(f"--- Rank {rank} ---")
        print(f"Distance Score:   {score:.4f}")
        print(f"Source File:      {doc.metadata.get('source_file', 'Unknown')}")
        print(f"Metadata:         {doc.metadata}")
        chunk_text = doc.page_content[:300].replace("\n", " ") + ("..." if len(doc.page_content) > 300 else "")
        print(f"Retrieved chunk:  {chunk_text}")
        print()

if __name__ == "__main__":
    print("Initializing ChromaDB Inspector...\n")
    vs = get_vectorstore()
    
    print_collection_statistics(vs)
    list_source_files(vs)
    print_sample_records(vs, n=5)
    search(vs, "placement cell", k=5)

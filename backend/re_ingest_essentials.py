import os
from pathlib import Path
from database.config import SessionLocal
from models.models import DocumentMetadata

def re_ingest_essentials():
    db = SessionLocal()
    try:
        records = db.query(DocumentMetadata).filter(
            DocumentMetadata.file_type.in_([".csv", ".txt"])
        ).all()
        for r in records:
            r.embedding_status = "pending"
        db.commit()
        print(f"Set {len(records)} essential files to pending for ingestion.")
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    re_ingest_essentials()

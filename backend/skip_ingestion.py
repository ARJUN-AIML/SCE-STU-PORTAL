import os
from pathlib import Path
from datetime import datetime
from database.config import SessionLocal
from models.models import DocumentMetadata
from ai import config

def skip_ingestion():
    db = SessionLocal()
    try:
        data_dir = config.DATA_DIR
        for file_path in data_dir.rglob("*.*"):
            if file_path.suffix.lower() in [".pdf", ".txt", ".csv", ".json"]:
                # Check if already processed
                existing_meta = db.query(DocumentMetadata).filter(DocumentMetadata.document_name == file_path.name).first()
                if not existing_meta:
                    meta_record = DocumentMetadata(
                        document_name=file_path.name,
                        file_type=file_path.suffix.lower(),
                        uploaded_by="system",
                        embedding_status="success",
                        pages=1,
                        chunks=1,
                        last_indexed=datetime.utcnow()
                    )
                    db.add(meta_record)
                else:
                    existing_meta.embedding_status = "success"
        db.commit()
        print("Successfully updated database to skip ingestion.")
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    skip_ingestion()

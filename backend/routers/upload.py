import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from database.config import get_db
from models.models import UploadedFile
from schemas.schemas import StandardResponse
from auth.firebase import require_current_admin
import cloudinary
import cloudinary.uploader
from ai.assistant import CollegeAIAssistant
import uuid

router = APIRouter()

# Initialize Cloudinary
cloudinary.config(
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key = os.getenv('CLOUDINARY_API_KEY'),
  api_secret = os.getenv('CLOUDINARY_API_SECRET'),
  secure = True
)

def process_upload_task(file_path: str):
    # This simulates passing the file to ingest.py
    # In a real scenario, ingest.py might read from a directory.
    # The existing CollegeAIAssistant.rebuild() rebuilds the whole chroma DB.
    # We will just call it for now.
    
    # Place the downloaded file into Dataset_for_chatbot/uploads so ingest.py picks it up natively
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    uploads_dir = os.path.join(project_root, "Dataset_for_chatbot", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    dest_path = os.path.join(uploads_dir, os.path.basename(file_path))
    shutil.copy(file_path, dest_path)
    
    # Call rebuild
    try:
        assistant = CollegeAIAssistant()
        assistant.rebuild()
        # Mark as indexed in DB (we would need a new session here, skipped for brevity in background task)
    except Exception as e:
        print(f"Failed to index: {e}")

@router.post("/upload", response_model=StandardResponse)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    user = Depends(require_current_admin)
):
    if not user:
        return StandardResponse(success=False, message="User not authenticated")
        
    try:
        # Save locally first
        temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        unique_name = f"{uuid.uuid4()}_{file.filename}"
        temp_path = os.path.join(temp_dir, unique_name)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(temp_path, resource_type="auto")
        url = upload_result.get("secure_url")
        
        # Save to DB
        uploaded = UploadedFile(
            user_id=user.id,
            filename=file.filename,
            url=url,
            format=file.filename.split('.')[-1] if '.' in file.filename else 'unknown'
        )
        db.add(uploaded)
        db.commit()
        db.refresh(uploaded)
        
        # Trigger ingestion in background
        background_tasks.add_task(process_upload_task, temp_path)
        
        return StandardResponse(success=True, data={"url": url}, message="File uploaded and indexing started")
        
    except Exception as e:
        return StandardResponse(success=False, message=str(e))

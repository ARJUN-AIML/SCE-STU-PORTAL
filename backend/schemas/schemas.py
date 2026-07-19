from pydantic import BaseModel
from typing import Optional, List, Any

class StandardResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: str = ""

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
    metadata: List[dict] = []

class RegisterRequest(BaseModel):
    event_id: str
    type: Optional[str] = None
    name: str
    email: str
    rollNumber: str
    notes: Optional[str] = None

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import logging
from ai.assistant import CollegeAIAssistant
from database.config import SessionLocal
from models.models import ChatHistory
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await manager.connect(websocket)
    session_id = str(uuid.uuid4())
    
    # Each connection gets its own assistant to maintain isolated multi-turn context
    assistant = CollegeAIAssistant()
    db = SessionLocal()
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                question = payload.get("question", "")
                user_id = payload.get("user_id") # Optional authentication
                
                # Log user query
                if user_id:
                    db.add(ChatHistory(user_id=user_id, session_id=session_id, role="user", content=question))
                    db.commit()
                
                # Fetch full response from existing RAG streaming method
                async for chunk in assistant.ask_stream(question):
                    if chunk["type"] in ("status", "stream"):
                        await websocket.send_text(json.dumps(chunk))
                    elif chunk["type"] == "done":
                        answer = chunk.get("answer", "")
                        sources = chunk.get("sources", [])
                        
                        # split follow-ups
                        if "---FOLLOW_UPS---" in answer:
                            main_answer, follow_ups_text = answer.split("---FOLLOW_UPS---", 1)
                            follow_ups = [line.strip("- ").strip() for line in follow_ups_text.split('\n') if line.strip("- ").strip()]
                        else:
                            main_answer = answer
                            follow_ups = []
                        
                        # Log assistant answer
                        if user_id:
                            db.add(ChatHistory(user_id=user_id, session_id=session_id, role="assistant", content=main_answer))
                            db.commit()
                        
                        # Send final sources
                        final_msg = {
                            "type": "done",
                            "answer": main_answer,
                            "sources": sources,
                            "confidence": chunk.get("confidence", "Low Confidence"),
                            "follow_ups": follow_ups,
                            "dev_metrics": chunk.get("dev_metrics")
                        }
                        await websocket.send_text(json.dumps(final_msg))
                
            except Exception as e:
                import traceback
                traceback_str = traceback.format_exc()
                logger.error(f"WS Error processing message: {e}\n{traceback_str}")
                await websocket.send_text(json.dumps({"type": "error", "content": f"Failed to process message: {str(e)}"}))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        db.close()

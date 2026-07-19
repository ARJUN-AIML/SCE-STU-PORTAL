import os
import firebase_admin
from firebase_admin import auth
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from database.config import get_db
from models.models import User

# Initialize Firebase Admin
# Requires GOOGLE_APPLICATION_CREDENTIALS environment variable
BYPASS_AUTH = os.getenv("BYPASS_AUTH", "false").lower() == "true"

if not BYPASS_AUTH and not firebase_admin._apps:
    try:
        # Default initialization (looks for GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app()
    except Exception as e:
        print("Firebase Admin initialization failed. Make sure GOOGLE_APPLICATION_CREDENTIALS is set.")


async def verify_token(request: Request, db: Session = Depends(get_db)):
    if BYPASS_AUTH:
        user = db.query(User).filter(User.firebase_uid == "dev-user").first()
        if not user:
            user = User(firebase_uid="dev-user", email="developer@sce.local", name="Developer")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = auth_header.split(' ')[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '').strip().lower()
        if not decoded_token.get('email_verified') or not (email.endswith('@saranathan.ac.in') or email.endswith('@sceadmin.ac.in')):
            raise HTTPException(status_code=403, detail="Only official Saranathan College accounts are allowed.")
        
        # Determine role based on email domain
        role = "admin" if email.endswith("@sceadmin.ac.in") else "student"
        
        # Sync user to postgres
        user = db.query(User).filter(User.firebase_uid == uid).first()
        if not user:
            user = User(firebase_uid=uid, email=email, name=decoded_token.get('name', ''), role=role)
            db.add(user)
            db.commit()
            db.refresh(user)
        elif user.role != role:
            # Update role if domain implies a change
            user.role = role
            db.commit()
            db.refresh(user)
            
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Optional auth dependency
async def get_current_user_optional(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    try:
        return await verify_token(request, db)
    except:
        return None

async def require_current_user(request: Request, db: Session = Depends(get_db)):
    user = await verify_token(request, db)
    return user

async def require_current_admin(request: Request, db: Session = Depends(get_db)):
    user = await verify_token(request, db)
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail={"success": False, "message": "Administrator access required."}
        )
    return user

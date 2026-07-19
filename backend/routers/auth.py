from fastapi import APIRouter, Depends
from auth.firebase import require_current_user
from schemas.schemas import StandardResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/me", response_model=StandardResponse)
async def get_me(user = Depends(require_current_user)):
    return StandardResponse(
        success=True,
        data={
            "id": str(user.id),
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "name": user.name,
            "role": user.role
        },
        message="User fetched successfully"
    )

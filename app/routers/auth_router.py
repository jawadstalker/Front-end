from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.otp import OTP

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    SendOTPRequest,
    VerifyOTPRequest
)

from app.core.security import verify_password
from app.core.token import create_access_token

from app.services.otp_service import generate_otp


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# =========================================================
# LOGIN WITH PASSWORD
# =========================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    print("LOGIN HIT")
    print(data.phone)

    # پیدا کردن کاربر
    user = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    # ==========================================
    # CHECK ACTIVE STATUS
    # ==========================================

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    # ==========================================
    # CHECK PASSWORD
    # ==========================================

    if not verify_password(
        data.password,
        user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Wrong password"
        )

    # ==========================================
    # CREATE TOKEN
    # ==========================================

    token = create_access_token(
        {
            "user_id": user.id,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# =========================================================
# SEND OTP
# =========================================================

@router.post(
    "/send-otp"
)
def send_otp(
    data: SendOTPRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ==========================================
    # CHECK ACTIVE STATUS
    # ==========================================

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    # ==========================================
    # GENERATE OTP
    # ==========================================

    code = generate_otp()

    otp = OTP(
        phone=data.phone,
        code=code
    )

    db.add(otp)
    db.commit()

    # فعلاً برای تست
    # بعداً پیامک واقعی اینجا قرار می‌گیرد

    print(
        "OTP CODE:",
        code
    )

    return {
        "message": "OTP sent successfully"
    }


# =========================================================
# VERIFY OTP
# =========================================================

@router.post(
    "/verify-otp",
    response_model=TokenResponse
)
def verify_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):

    # ==========================================
    # FIND OTP
    # ==========================================

    otp = db.query(OTP).filter(
        OTP.phone == data.phone,
        OTP.code == data.code
    ).order_by(
        OTP.id.desc()
    ).first()

    if not otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # ==========================================
    # FIND USER
    # ==========================================

    user = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ==========================================
    # CHECK ACTIVE STATUS
    # ==========================================

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    # ==========================================
    # CREATE TOKEN
    # ==========================================

    token = create_access_token(
        {
            "user_id": user.id,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserProfileUpdate
)

from app.core.security import hash_password


# =========================================================
# Create User
# =========================================================

def create_user(
    db: Session,
    user: UserCreate
):
    existing_user = (
        db.query(User)
        .filter(User.phone == user.phone)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Phone already registered"
        )

    db_user = User(
        full_name=user.full_name,
        phone=user.phone,
        password=hash_password(user.password),

        role="volunteer",

        is_active=True,

        city=None,
        region=None,
        location=None,

        availability_status="available",

        skills="[]",

        profile_image=None
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# =========================================================
# Update Profile
# =========================================================

def update_profile(
    db: Session,
    user_id: int,
    profile: UserProfileUpdate
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -------------------------
    # Full Name
    # -------------------------

    if profile.full_name is not None:
        user.full_name = profile.full_name

    # -------------------------
    # City
    # -------------------------

    if profile.city is not None:
        user.city = profile.city

    # -------------------------
    # Region
    # -------------------------

    if profile.region is not None:
        user.region = profile.region

    # -------------------------
    # Availability Status
    # -------------------------

    if profile.availability_status is not None:
        user.availability_status = (
            profile.availability_status
        )

    # -------------------------
    # Location
    # -------------------------

    if profile.location is not None:
        user.location = profile.location

    # -------------------------
    # Skills
    # -------------------------

    if profile.skills is not None:
        user.skills = profile.skills

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# Get User By Id
# =========================================================

def get_user_by_id(
    db: Session,
    user_id: int
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


# =========================================================
# Get All Users
# =========================================================

def get_all_users(
    db: Session
):
    return (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )


# =========================================================
# Get Users By Role
# =========================================================

def get_users_by_role(
    db: Session,
    role: str
):
    return (
        db.query(User)
        .filter(User.role == role)
        .order_by(User.id.desc())
        .all()
    )


# =========================================================
# Get All Volunteers
# =========================================================

def get_all_volunteers(
    db: Session
):
    return (
        db.query(User)
        .filter(
            User.role == "volunteer"
        )
        .order_by(
            User.id.desc()
        )
        .all()
    )


# =========================================================
# Change User Role
# =========================================================

def update_user_role(
    db: Session,
    user_id: int,
    role: str
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    allowed_roles = [
        "admin",
        "coordinator",
        "volunteer"
    ]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    user.role = role

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# Change User Active Status
# =========================================================

def update_user_status(
    db: Session,
    user_id: int,
    is_active: bool
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# Toggle Volunteer Active
# =========================================================

def toggle_user_active(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role != "volunteer":
        raise HTTPException(
            status_code=400,
            detail="User is not a volunteer"
        )

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# Delete User
# =========================================================

def delete_user(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return user
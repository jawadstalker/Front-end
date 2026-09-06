from typing import Optional

from pydantic import BaseModel


# =========================================================
# CREATE USER
# =========================================================

class UserCreate(BaseModel):

    full_name: str

    phone: str

    password: str


# =========================================================
# USER RESPONSE
# =========================================================

class UserResponse(BaseModel):

    id: int

    full_name: str

    phone: str

    role: str

    is_active: bool

    city: Optional[str] = None

    region: Optional[str] = None

    availability_status: Optional[str] = None

    location: Optional[str] = None

    skills: Optional[str] = None

    # عکس پروفایل
    profile_image: Optional[str] = None

    class Config:

        from_attributes = True


# =========================================================
# UPDATE PROFILE
# =========================================================

class UserProfileUpdate(BaseModel):

    full_name: Optional[str] = None

    city: Optional[str] = None

    region: Optional[str] = None

    availability_status: Optional[str] = None

    location: Optional[str] = None

    skills: Optional[str] = None


# =========================================================
# UPDATE ROLE
# =========================================================

class UserRoleUpdate(BaseModel):

    role: str


# =========================================================
# UPDATE STATUS
# =========================================================

class UserStatusUpdate(BaseModel):

    is_active: bool
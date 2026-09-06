from datetime import datetime
from typing import Optional, List

from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
)


# ==========================================
# Create Mission
# ==========================================

class MissionCreate(BaseModel):

    disaster_id: int

    title: str = Field(
        ...,
        min_length=1,
    )

    description: Optional[str] = None

    # Example:
    # "برق, شبکه, مخابرات"
    required_skills: Optional[str] = None

    location: Optional[str] = None

    priority: str = "medium"

    required_volunteers: int = Field(
        default=1,
        ge=1,
    )


# ==========================================
# Update Mission
# ==========================================

class MissionUpdate(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    required_skills: Optional[str] = None

    location: Optional[str] = None

    priority: Optional[str] = None

    required_volunteers: Optional[int] = Field(
        default=None,
        ge=1,
    )

    status: Optional[str] = None


# ==========================================
# Mission User
# ==========================================

class MissionUserResponse(BaseModel):

    id: int

    full_name: str

    phone: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# Mission Disaster
# ==========================================

class MissionDisasterResponse(BaseModel):

    id: int

    title: str

    city: Optional[str] = None

    location: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# Mission Report - Create
# ==========================================

class MissionReportCreate(BaseModel):

    report: str = Field(
        ...,
        min_length=10,
        max_length=2000,
    )


# ==========================================
# Mission Report - Response
# ==========================================

class MissionReportResponse(BaseModel):

    mission_id: int

    user_id: int

    report: Optional[str] = None

    report_submitted_at: Optional[datetime] = None

    reviewed_at: Optional[datetime] = None

    review_status: Optional[str] = None


# ==========================================
# Mission Response
# ==========================================

class MissionResponse(BaseModel):

    id: int

    title: Optional[str] = None

    description: Optional[str] = None

    # مهارت‌های موردنیاز مأموریت
    required_skills: Optional[str] = None

    location: Optional[str] = None

    priority: Optional[str] = None

    required_volunteers: Optional[int] = None

    status: str

    assigned_at: Optional[datetime] = None

    user: Optional[MissionUserResponse] = None

    disaster: MissionDisasterResponse

    # تعداد داوطلب‌های فعلی
    volunteer_count: int = 0

    # آیا کاربر فعلی این مأموریت را گرفته؟
    accepted_by_me: bool = False

    # میزان تطابق مهارت داوطلب با مأموریت
    skill_match_count: int = 0

    # آیا حداقل یک مهارت مشترک وجود دارد؟
    skill_matched: bool = False

    # لیست داوطلب‌ها
    volunteers: List[MissionUserResponse] = Field(
        default_factory=list
    )

    model_config = ConfigDict(
        from_attributes=True
    )
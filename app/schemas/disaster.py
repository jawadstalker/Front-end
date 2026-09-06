from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# -----------------------------
# Create
# -----------------------------

class DisasterCreate(BaseModel):

    title: str

    description: Optional[str] = None

    type: str

    city: Optional[str] = None

    region: Optional[str] = None

    location: Optional[str] = None



# -----------------------------
# Update
# -----------------------------

class DisasterUpdate(BaseModel):

    title: str

    description: Optional[str] = None

    type: str

    city: Optional[str] = None

    region: Optional[str] = None

    location: Optional[str] = None



# -----------------------------
# Response
# -----------------------------

class DisasterResponse(BaseModel):

    id: int

    title: str

    description: Optional[str]

    type: str

    city: Optional[str]

    region: Optional[str]

    location: Optional[str]

    status: str

    created_at: datetime


    class Config:
        from_attributes = True
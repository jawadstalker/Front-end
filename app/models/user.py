from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(20),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    # ==========================================
    # Volunteer Profile
    # ==========================================

    city = Column(
        String(100),
        nullable=True
    )

    region = Column(
        String(100),
        nullable=True
    )

    availability_status = Column(
        String(50),
        default="available"
    )

    location = Column(
        String(200),
        nullable=True
    )

    # ==========================================
    # Volunteer Skills
    # ==========================================

    skills = Column(
        String(1000),
        nullable=True
    )

    # ==========================================
    # Profile Image
    # ==========================================

    profile_image = Column(
        String(500),
        nullable=True
    )

    # ==========================================
    # Mission Relationship
    # ==========================================

    missions = relationship(
        "Mission",
        back_populates="user"
    )
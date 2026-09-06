from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


# ==========================================
# Mission Volunteers
# ==========================================

mission_volunteers = Table(
    "mission_volunteers",
    Base.metadata,

    Column(
        "mission_id",
        Integer,
        ForeignKey("missions.id", ondelete="CASCADE"),
        primary_key=True,
    ),

    Column(
        "user_id",
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    ),

    # زمان پذیرش مأموریت
    Column(
        "assigned_at",
        DateTime,
        nullable=True,
    ),

    # زمان تکمیل مأموریت
    Column(
        "completed_at",
        DateTime,
        nullable=True,
    ),

    # ======================================
    # Mission Report
    # ======================================

    Column(
        "report",
        String(2000),
        nullable=True,
    ),

    Column(
        "report_submitted_at",
        DateTime,
        nullable=True,
    ),

    Column(
        "reviewed_at",
        DateTime,
        nullable=True,
    ),

    # pending / approved / rejected
    Column(
        "review_status",
        String(50),
        nullable=True,
    ),
)


# ==========================================
# Mission
# ==========================================

class Mission(Base):

    __tablename__ = "missions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # --------------------------------------
    # Compatibility field
    # --------------------------------------

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    # --------------------------------------
    # Disaster
    # --------------------------------------

    disaster_id = Column(
        Integer,
        ForeignKey("disasters.id"),
        nullable=False,
    )

    # --------------------------------------
    # Basic information
    # --------------------------------------

    title = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        String(1000),
        nullable=True,
    )

    # --------------------------------------
    # Required skills
    #
    # Example:
    # "برق, شبکه, مخابرات"
    # --------------------------------------

    required_skills = Column(
        String(1000),
        nullable=True,
    )

    location = Column(
        String(255),
        nullable=True,
    )

    priority = Column(
        String(50),
        default="medium",
        nullable=False,
    )

    required_volunteers = Column(
        Integer,
        default=1,
        nullable=False,
    )

    # active
    # accepted
    # completed
    status = Column(
        String(50),
        default="active",
        nullable=False,
    )

    assigned_at = Column(
        DateTime,
        nullable=True,
    )

    # --------------------------------------
    # Relationships
    # --------------------------------------

    user = relationship(
        "User",
        back_populates="missions",
    )

    disaster = relationship(
        "Disaster",
        back_populates="missions",
    )

    volunteers = relationship(
        "User",
        secondary=mission_volunteers,
        backref="volunteer_missions",
    )
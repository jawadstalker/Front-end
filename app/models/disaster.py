from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.database import Base


class Disaster(Base):

    __tablename__ = "disasters"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    title = Column(
        String(200),
        nullable=False
    )


    description = Column(
        Text
    )


    type = Column(
        String(50)
    )


    city = Column(
        String(100)
    )


    region = Column(
        String(100)
    )


    location = Column(
        String(200)
    )


    status = Column(
        String(50),
        default="active"
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    # ارتباط با Mission
    missions = relationship(
        "Mission",
        back_populates="disaster"
    )
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)

    description = Column(Text, nullable=True)

    location = Column(String(100), nullable=False)

    status = Column(
        String(50),
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
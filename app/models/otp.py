from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class OTP(Base):

    __tablename__ = "otps"

    id = Column(Integer, primary_key=True)

    phone = Column(
        String,
        index=True
    )

    code = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
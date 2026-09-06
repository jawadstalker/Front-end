from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User
from app.models.disaster import Disaster
from app.models.mission import Mission


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)



@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):

    users_count = db.query(User).count()

    disasters_count = db.query(Disaster).count()

    missions_count = db.query(Mission).count()


    return {
        "users": users_count,
        "disasters": disasters_count,
        "missions": missions_count
    }
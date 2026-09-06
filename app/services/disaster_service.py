from sqlalchemy.orm import Session

from app.models.disaster import Disaster

from app.schemas.disaster import (
    DisasterCreate,
    DisasterUpdate
)



# -----------------------------
# Create
# -----------------------------

def create_disaster(
    db: Session,
    disaster: DisasterCreate
):

    db_disaster = Disaster(

        title=disaster.title,

        description=disaster.description,

        type=disaster.type,

        city=disaster.city,

        region=disaster.region,

        location=disaster.location,

        status="active"

    )

    db.add(db_disaster)

    db.commit()

    db.refresh(db_disaster)

    return db_disaster





# -----------------------------
# Get All
# -----------------------------

def get_all_disasters(
    db: Session
):

    return db.query(Disaster).all()





# -----------------------------
# Get By ID
# -----------------------------

def get_disaster_by_id(
    db: Session,
    disaster_id: int
):

    return db.query(Disaster).filter(
        Disaster.id == disaster_id
    ).first()





# -----------------------------
# Update
# -----------------------------

def update_disaster(
    db: Session,
    disaster_id: int,
    data: DisasterUpdate
):

    disaster = db.query(Disaster).filter(
        Disaster.id == disaster_id
    ).first()


    if not disaster:
        return None


    disaster.title = data.title
    disaster.description = data.description
    disaster.type = data.type
    disaster.city = data.city
    disaster.region = data.region
    disaster.location = data.location


    db.commit()

    db.refresh(disaster)

    return disaster





# -----------------------------
# Delete
# -----------------------------

def delete_disaster(
    db: Session,
    disaster_id: int
):

    disaster = db.query(Disaster).filter(
        Disaster.id == disaster_id
    ).first()


    if not disaster:
        return False


    db.delete(disaster)

    db.commit()

    return True
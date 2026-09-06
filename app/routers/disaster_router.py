from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.disaster import (
    DisasterCreate,
    DisasterResponse,
    DisasterUpdate
)

from app.services.disaster_service import (
    create_disaster,
    get_all_disasters,
    get_disaster_by_id,
    delete_disaster,
    update_disaster
)


router = APIRouter(
    prefix="/disasters",
    tags=["Disasters"]
)



# -----------------------------
# Create
# -----------------------------
@router.post(
    "/",
    response_model=DisasterResponse
)
def create_new_disaster(
    disaster: DisasterCreate,
    db: Session = Depends(get_db)
):

    return create_disaster(
        db,
        disaster
    )



# -----------------------------
# Read All
# -----------------------------
@router.get(
    "/",
    response_model=List[DisasterResponse]
)
def read_disasters(
    db: Session = Depends(get_db)
):

    return get_all_disasters(db)



# -----------------------------
# Read One
# -----------------------------
@router.get(
    "/{disaster_id}",
    response_model=DisasterResponse
)
def read_disaster(
    disaster_id: int,
    db: Session = Depends(get_db)
):

    disaster = get_disaster_by_id(
        db,
        disaster_id
    )

    if not disaster:

        raise HTTPException(
            status_code=404,
            detail="Disaster not found"
        )

    return disaster



# -----------------------------
# Update
# -----------------------------
@router.put(
    "/{disaster_id}",
    response_model=DisasterResponse
)
def edit_disaster(
    disaster_id: int,
    disaster: DisasterUpdate,
    db: Session = Depends(get_db)
):

    updated = update_disaster(
        db,
        disaster_id,
        disaster
    )

    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Disaster not found"
        )

    return updated



# -----------------------------
# Delete
# -----------------------------
@router.delete(
    "/{disaster_id}"
)
def remove_disaster(
    disaster_id: int,
    db: Session = Depends(get_db)
):

    result = delete_disaster(
        db,
        disaster_id
    )

    if not result:

        raise HTTPException(
            status_code=404,
            detail="Disaster not found"
        )

    return {
        "message": "Disaster deleted successfully"
    }
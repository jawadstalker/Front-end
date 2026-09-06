from typing import Any, Dict, List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User

from app.models.mission import (
    Mission,
    mission_volunteers,
)

from app.schemas.mission import (
    MissionCreate,
    MissionUpdate,
    MissionResponse,
    MissionReportCreate,
    MissionReportResponse,
)

from app.services.mission_service import (
    create_mission,
    update_mission,
    get_mission_by_id,
    get_all_missions,
    get_available_missions,
    get_my_missions,
    accept_mission,
    complete_mission,
    delete_mission,
    submit_mission_report,
    get_mission_report,
    review_mission_report,
    get_pending_mission_reports,
    calculate_skill_match,
    calculate_skill_match_ratio,
    calculate_volunteer_match_score,
    get_matching_volunteers,
    assign_volunteer_to_mission,
    auto_assign_volunteers,
)

from app.core.dependencies import (
    get_current_user,
)


router = APIRouter(
    prefix="/missions",
    tags=["Missions"],
)


# =========================================================
# HELPERS
# =========================================================

def is_admin_or_coordinator(
    current_user: User,
) -> bool:
    return current_user.role in [
        "admin",
        "coordinator",
    ]


def prepare_mission_response(
    db: Session,
    mission: Mission,
    current_user: User,
) -> MissionResponse:
    """
    آماده‌سازی Response مأموریت برای کاربر فعلی.
    """

    # -----------------------------------------------------
    # Volunteer count
    # -----------------------------------------------------

    volunteer_count = (
        db.query(mission_volunteers)
        .filter(
            mission_volunteers.c.mission_id
            == mission.id
        )
        .count()
    )

    # -----------------------------------------------------
    # Accepted by current user
    # -----------------------------------------------------

    accepted_by_me = (
        db.query(mission_volunteers)
        .filter(
            mission_volunteers.c.mission_id
            == mission.id,
            mission_volunteers.c.user_id
            == current_user.id,
        )
        .first()
        is not None
    )

    # -----------------------------------------------------
    # Skill match
    # -----------------------------------------------------

    volunteer_skills = getattr(
        current_user,
        "skills",
        None,
    )

    skill_match_count = calculate_skill_match(
        volunteer_skills,
        mission,
    )

    skill_matched = (
        skill_match_count > 0
    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return MissionResponse(
        id=mission.id,

        title=mission.title,

        description=mission.description,

        required_skills=(
            mission.required_skills
        ),

        location=mission.location,

        priority=mission.priority,

        required_volunteers=(
            mission.required_volunteers
        ),

        status=mission.status,

        assigned_at=mission.assigned_at,

        user=mission.user,

        disaster=mission.disaster,

        volunteer_count=(
            volunteer_count
        ),

        accepted_by_me=(
            accepted_by_me
        ),

        skill_match_count=(
            skill_match_count
        ),

        skill_matched=(
            skill_matched
        ),

        volunteers=(
            mission.volunteers or []
        ),
    )


# =========================================================
# CREATE MISSION
# =========================================================

@router.post(
    "/",
    response_model=MissionResponse,
)
def create_new_mission(
    mission: MissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Admin or coordinator "
                "access required"
            ),
        )

    created = create_mission(
        db,
        mission,
    )

    return prepare_mission_response(
        db,
        created,
        current_user,
    )


# =========================================================
# ALL MISSIONS
# =========================================================

@router.get(
    "/",
    response_model=List[MissionResponse],
)
def read_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Admin or coordinator "
                "access required"
            ),
        )

    missions = get_all_missions(db)

    return [
        prepare_mission_response(
            db,
            mission,
            current_user,
        )
        for mission in missions
    ]


# =========================================================
# AVAILABLE MISSIONS
# =========================================================

@router.get(
    "/available",
    response_model=List[MissionResponse],
)
def read_available_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    مأموریت‌های مناسب برای داوطلب.

    ترتیب بر اساس:
        1. skill match
        2. location
        3. priority
        4. mission id
    """

    if current_user.role != "volunteer":
        raise HTTPException(
            status_code=403,
            detail=(
                "Volunteer access required"
            ),
        )

    missions = get_available_missions(
        db,
        current_user.id,
    )

    return [
        prepare_mission_response(
            db,
            mission,
            current_user,
        )
        for mission in missions
    ]


# =========================================================
# MY MISSIONS
# =========================================================

@router.get(
    "/my",
    response_model=List[MissionResponse],
)
def read_my_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    missions = get_my_missions(
        db,
        current_user.id,
    )

    return [
        prepare_mission_response(
            db,
            mission,
            current_user,
        )
        for mission in missions
    ]


# =========================================================
# MATCHING VOLUNTEERS
# =========================================================

@router.get(
    "/{mission_id}/matching-volunteers",
)
def read_matching_volunteers(
    mission_id: int,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
) -> List[Dict[str, Any]]:
    """
    پیدا کردن بهترین داوطلب‌ها برای یک مأموریت.

    فقط admin / coordinator.
    """

    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Only admin or coordinator "
                "can find matching volunteers"
            ),
        )

    if limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Limit must be at least 1",
        )

    if limit > 100:
        limit = 100

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return get_matching_volunteers(
        db,
        mission_id,
        limit=limit,
    )


# =========================================================
# ASSIGN VOLUNTEER
# =========================================================

@router.patch(
    "/{mission_id}/assign/{volunteer_id}",
    response_model=MissionResponse,
)
def assign_volunteer(
    mission_id: int,
    volunteer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    تخصیص دستی داوطلب به مأموریت.

    فقط admin / coordinator.
    """

    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    volunteer = (
        db.query(User)
        .filter(
            User.id == volunteer_id,
            User.role == "volunteer",
        )
        .first()
    )

    if not volunteer:
        raise HTTPException(
            status_code=404,
            detail="Volunteer not found",
        )

    assigned = assign_volunteer_to_mission(
        db,
        mission_id,
        volunteer_id,
    )

    if not assigned:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to assign volunteer "
                "to this mission"
            ),
        )

    return prepare_mission_response(
        db,
        assigned,
        current_user,
    )


# =========================================================
# AUTO ASSIGN VOLUNTEERS
# =========================================================

@router.post(
    "/{mission_id}/auto-assign",
)
def auto_assign_mission_volunteers(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
) -> Dict[str, Any]:
    """
    تخصیص خودکار بهترین داوطلب‌ها به مأموریت.

    تعداد تخصیص بر اساس:
        mission.required_volunteers

    امتیاز بر اساس:
        skill
        city
        region
        availability
    """

    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    assigned = auto_assign_volunteers(
        db,
        mission_id,
    )

    updated_mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not updated_mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return {
        "message": (
            "Volunteers assigned successfully"
        ),

        "mission": (
            prepare_mission_response(
                db,
                updated_mission,
                current_user,
            )
        ),

        "assigned_count": len(
            assigned
        ),

        "assigned_volunteers": assigned,
    }


# =========================================================
# PENDING REPORTS
# =========================================================

@router.get(
    "/reports/pending",
)
def get_pending_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Only admin or coordinator "
                "can view pending reports"
            ),
        )

    rows = get_pending_mission_reports(
        db
    )

    return [
        {
            "mission_id": row.mission_id,

            "user_id": row.user_id,

            "report": row.report,

            "report_submitted_at": (
                row.report_submitted_at
            ),

            "reviewed_at": (
                row.reviewed_at
            ),

            "review_status": (
                row.review_status
            ),

            "mission_title": (
                row.mission_title
            ),

            "mission_status": (
                row.mission_status
            ),

            "user_full_name": (
                row.user_full_name
            ),

            "user_phone": (
                row.user_phone
            ),
        }
        for row in rows
    ]


# =========================================================
# GET MISSION BY ID
# =========================================================

@router.get(
    "/{mission_id}",
    response_model=MissionResponse,
)
def read_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return prepare_mission_response(
        db,
        mission,
        current_user,
    )


# =========================================================
# UPDATE MISSION
# =========================================================

@router.put(
    "/{mission_id}",
    response_model=MissionResponse,
)
def edit_mission(
    mission_id: int,
    mission: MissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    updated = update_mission(
        db,
        mission_id,
        mission,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return prepare_mission_response(
        db,
        updated,
        current_user,
    )


# =========================================================
# DELETE MISSION
# =========================================================

@router.delete(
    "/{mission_id}",
)
def remove_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    mission = delete_mission(
        db,
        mission_id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return {
        "message":
            "Mission deleted successfully"
    }


# =========================================================
# ACCEPT MISSION
# =========================================================

@router.patch(
    "/{mission_id}/accept",
    response_model=MissionResponse,
)
def accept_my_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "volunteer":
        raise HTTPException(
            status_code=403,
            detail=(
                "Only volunteers "
                "can accept missions"
            ),
        )

    mission = accept_mission(
        db,
        mission_id,
        current_user.id,
    )

    if not mission:
        raise HTTPException(
            status_code=400,
            detail=(
                "Mission is not available "
                "or cannot be accepted"
            ),
        )

    return prepare_mission_response(
        db,
        mission,
        current_user,
    )


# =========================================================
# SUBMIT REPORT
# =========================================================

@router.post(
    "/{mission_id}/report",
    response_model=MissionReportResponse,
)
def submit_report(
    mission_id: int,
    report_data: MissionReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "volunteer":
        raise HTTPException(
            status_code=403,
            detail=(
                "Only volunteers "
                "can submit reports"
            ),
        )

    report_text = (
        report_data.report.strip()
    )

    if len(report_text) < 10:
        raise HTTPException(
            status_code=400,
            detail=(
                "Report must contain "
                "at least 10 characters"
            ),
        )

    if len(report_text) > 2000:
        raise HTTPException(
            status_code=400,
            detail=(
                "Report cannot exceed "
                "2000 characters"
            ),
        )

    mission = submit_mission_report(
        db,
        mission_id,
        current_user.id,
        report_text,
    )

    if not mission:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to submit "
                "mission report"
            ),
        )

    report = get_mission_report(
        db,
        mission_id,
        current_user.id,
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail=(
                "Mission report not found"
            ),
        )

    return MissionReportResponse(
        mission_id=report.mission_id,

        user_id=report.user_id,

        report=report.report,

        report_submitted_at=(
            report.report_submitted_at
        ),

        reviewed_at=(
            report.reviewed_at
        ),

        review_status=(
            report.review_status
        ),
    )


# =========================================================
# MY REPORT
# =========================================================

@router.get(
    "/{mission_id}/report",
    response_model=MissionReportResponse,
)
def read_my_report(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "volunteer":
        raise HTTPException(
            status_code=403,
            detail=(
                "Only volunteers "
                "can view their reports"
            ),
        )

    report = get_mission_report(
        db,
        mission_id,
        current_user.id,
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail=(
                "Mission report not found"
            ),
        )

    return MissionReportResponse(
        mission_id=report.mission_id,

        user_id=report.user_id,

        report=report.report,

        report_submitted_at=(
            report.report_submitted_at
        ),

        reviewed_at=(
            report.reviewed_at
        ),

        review_status=(
            report.review_status
        ),
    )


# =========================================================
# REVIEW REPORT
# =========================================================

@router.patch(
    "/{mission_id}/report/review",
    response_model=MissionReportResponse,
)
def review_report(
    mission_id: int,
    user_id: int,
    approved: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if not is_admin_or_coordinator(
        current_user
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Only admin or coordinator "
                "can review reports"
            ),
        )

    mission = review_mission_report(
        db,
        mission_id,
        user_id,
        approved,
    )

    if not mission:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to review "
                "mission report"
            ),
        )

    report = get_mission_report(
        db,
        mission_id,
        user_id,
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail=(
                "Mission report not found"
            ),
        )

    return MissionReportResponse(
        mission_id=report.mission_id,

        user_id=report.user_id,

        report=report.report,

        report_submitted_at=(
            report.report_submitted_at
        ),

        reviewed_at=(
            report.reviewed_at
        ),

        review_status=(
            report.review_status
        ),
    )


# =========================================================
# COMPLETE MISSION
# =========================================================

@router.patch(
    "/{mission_id}/complete",
    response_model=MissionResponse,
)
def complete_my_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "volunteer":
        raise HTTPException(
            status_code=403,
            detail=(
                "Only volunteers "
                "can complete missions"
            ),
        )

    mission = complete_mission(
        db,
        mission_id,
        current_user.id,
    )

    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return prepare_mission_response(
        db,
        mission,
        current_user,
    )
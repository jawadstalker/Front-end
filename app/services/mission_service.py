# from datetime import datetime
# from typing import List, Optional, Set

# from sqlalchemy.orm import Session

# from app.models.mission import Mission, mission_volunteers
# from app.models.user import User
# from app.schemas.mission import MissionCreate, MissionUpdate


# # =========================================================
# # NORMALIZE ONE SKILL
# # =========================================================

# def normalize_skill(skill: Optional[str]) -> str:
#     """
#     استانداردسازی یک مهارت برای مقایسه.

#     مثال:
#         " برق "
#         "برق"
#         "بـرق"
#     همگی تا حد ممکن به فرم یکسان تبدیل می‌شوند.
#     """

#     if skill is None:
#         return ""

#     value = str(skill).strip().lower()

#     # -----------------------------------------
#     # Arabic characters -> Persian
#     # -----------------------------------------

#     value = value.replace("ي", "ی")
#     value = value.replace("ى", "ی")
#     value = value.replace("ك", "ک")

#     # -----------------------------------------
#     # نیم‌فاصله
#     # -----------------------------------------

#     value = value.replace("\u200c", " ")

#     # -----------------------------------------
#     # حذف فاصله‌های اضافی
#     # -----------------------------------------

#     value = " ".join(value.split())

#     return value.strip()


# # =========================================================
# # PARSE SKILLS
# # =========================================================

# def parse_skills(skills: Optional[str]) -> Set[str]:
#     """
#     تبدیل رشته مهارت‌ها به Set.

#     پشتیبانی از:
#         برق, شبکه, مخابرات

#     و:

#         برق، شبکه، مخابرات
#     """

#     if not skills:
#         return set()

#     # -----------------------------------------
#     # همه جداکننده‌ها را به کامای انگلیسی تبدیل کن
#     # -----------------------------------------

#     value = str(skills)

#     value = value.replace("،", ",")
#     value = value.replace("؛", ",")
#     value = value.replace(";", ",")

#     result = set()

#     for skill in value.split(","):
#         normalized = normalize_skill(skill)

#         if normalized:
#             result.add(normalized)

#     return result


# # =========================================================
# # SKILL MATCH COUNT
# # =========================================================

# def calculate_skill_match(
#     volunteer_skills: Optional[str],
#     mission_skills: Optional[str],
# ) -> int:
#     """
#     تعداد مهارت‌های مشترک داوطلب و مأموریت.

#     مثال:

#     داوطلب:
#         برق, شبکه, نجات

#     مأموریت:
#         نجات, کمک‌های اولیه

#     نتیجه:
#         1
#     """

#     volunteer = parse_skills(volunteer_skills)
#     required = parse_skills(mission_skills)

#     if not volunteer:
#         return 0

#     if not required:
#         return 0

#     return len(
#         volunteer.intersection(required)
#     )


# # =========================================================
# # HAS SKILL MATCH
# # =========================================================

# def has_skill_match(
#     volunteer_skills: Optional[str],
#     mission_skills: Optional[str],
# ) -> bool:

#     return (
#         calculate_skill_match(
#             volunteer_skills,
#             mission_skills,
#         )
#         > 0
#     )


# # =========================================================
# # CREATE MISSION
# # =========================================================

# def create_mission(
#     db: Session,
#     mission_data: MissionCreate,
# ) -> Mission:

#     required_skills = mission_data.required_skills

#     if required_skills:
#         cleaned_skills = parse_skills(
#             required_skills
#         )

#         # Set را دوباره به رشته مرتب تبدیل می‌کنیم
#         required_skills = ", ".join(
#             sorted(cleaned_skills)
#         )

#     mission = Mission(
#         disaster_id=mission_data.disaster_id,
#         title=mission_data.title,
#         description=mission_data.description,
#         required_skills=required_skills,
#         location=mission_data.location,
#         priority=mission_data.priority,
#         required_volunteers=mission_data.required_volunteers,
#         status="active",
#     )

#     db.add(mission)
#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # GET MISSION BY ID
# # =========================================================

# def get_mission_by_id(
#     db: Session,
#     mission_id: int,
# ) -> Optional[Mission]:

#     return (
#         db.query(Mission)
#         .filter(
#             Mission.id == mission_id
#         )
#         .first()
#     )


# # =========================================================
# # GET ALL MISSIONS
# # =========================================================

# def get_all_missions(
#     db: Session,
# ) -> List[Mission]:

#     return (
#         db.query(Mission)
#         .order_by(
#             Mission.id.desc()
#         )
#         .all()
#     )


# # =========================================================
# # GET AVAILABLE MISSIONS
# # =========================================================

# def get_available_missions(
#     db: Session,
#     volunteer_id: int,
# ) -> List[Mission]:
#     """
#     مأموریت‌های فعال را برای داوطلب برمی‌گرداند.

#     ترتیب:

#     1. بیشترین تطابق مهارتی
#     2. اولویت بالاتر
#     3. مأموریت جدیدتر
#     """

#     # =====================================================
#     # GET VOLUNTEER
#     # =====================================================

#     volunteer = (
#         db.query(User)
#         .filter(
#             User.id == volunteer_id
#         )
#         .first()
#     )

#     if not volunteer:
#         return []

#     volunteer_skills = (
#         volunteer.skills or ""
#     )

#     # =====================================================
#     # GET ACTIVE MISSIONS
#     # =====================================================

#     missions = (
#         db.query(Mission)
#         .filter(
#             Mission.status == "active"
#         )
#         .all()
#     )

#     # =====================================================
#     # REMOVE ALREADY ACCEPTED MISSIONS
#     # =====================================================

#     accepted_rows = (
#         db.query(
#             mission_volunteers.c.mission_id
#         )
#         .filter(
#             mission_volunteers.c.user_id
#             == volunteer_id
#         )
#         .all()
#     )

#     accepted_ids = {
#         row[0]
#         for row in accepted_rows
#     }

#     missions = [
#         mission
#         for mission in missions
#         if mission.id not in accepted_ids
#     ]

#     # =====================================================
#     # PRIORITY
#     # =====================================================

#     priority_order = {
#         "critical": 4,
#         "high": 3,
#         "medium": 2,
#         "low": 1,
#     }

#     # =====================================================
#     # CALCULATE MATCH
#     # =====================================================

#     mission_matches = []

#     for mission in missions:

#         match_count = calculate_skill_match(
#             volunteer_skills,
#             mission.required_skills,
#         )

#         mission_matches.append(
#             (
#                 mission,
#                 match_count,
#             )
#         )

#     # =====================================================
#     # SORT
#     # =====================================================

#     mission_matches.sort(
#         key=lambda item: (
#             item[1],

#             priority_order.get(
#                 str(
#                     item[0].priority or ""
#                 ).lower(),
#                 0,
#             ),

#             item[0].id,
#         ),
#         reverse=True,
#     )

#     # =====================================================
#     # RETURN ONLY MISSION OBJECTS
#     # =====================================================

#     return [
#         mission
#         for mission, match_count
#         in mission_matches
#     ]


# # =========================================================
# # MY MISSIONS
# # =========================================================

# def get_my_missions(
#     db: Session,
#     user_id: int,
# ) -> List[Mission]:

#     missions = (
#         db.query(Mission)
#         .join(
#             mission_volunteers,
#             Mission.id
#             == mission_volunteers.c.mission_id,
#         )
#         .filter(
#             mission_volunteers.c.user_id
#             == user_id
#         )
#         .order_by(
#             Mission.id.desc()
#         )
#         .all()
#     )

#     return missions


# # =========================================================
# # UPDATE MISSION
# # =========================================================

# def update_mission(
#     db: Session,
#     mission_id: int,
#     mission_data: MissionUpdate,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     data = mission_data.dict(
#         exclude_unset=True
#     )

#     # -----------------------------------------
#     # Normalize required skills
#     # -----------------------------------------

#     if "required_skills" in data:

#         raw_skills = data.get(
#             "required_skills"
#         )

#         if raw_skills:

#             parsed = parse_skills(
#                 raw_skills
#             )

#             data["required_skills"] = (
#                 ", ".join(
#                     sorted(parsed)
#                 )
#             )

#         else:
#             data["required_skills"] = None

#     # -----------------------------------------
#     # Apply changes
#     # -----------------------------------------

#     for key, value in data.items():

#         setattr(
#             mission,
#             key,
#             value,
#         )

#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # ACCEPT MISSION
# # =========================================================

# def accept_mission(
#     db: Session,
#     mission_id: int,
#     user_id: int,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     if mission.status != "active":
#         return None

#     # =====================================================
#     # ALREADY ACCEPTED?
#     # =====================================================

#     existing = (
#         db.query(
#             mission_volunteers
#         )
#         .filter(
#             mission_volunteers.c.mission_id
#             == mission_id,

#             mission_volunteers.c.user_id
#             == user_id,
#         )
#         .first()
#     )

#     if existing:
#         return None

#     # =====================================================
#     # CURRENT CAPACITY
#     # =====================================================

#     current_count = (
#         db.query(
#             mission_volunteers
#         )
#         .filter(
#             mission_volunteers.c.mission_id
#             == mission_id
#         )
#         .count()
#     )

#     if (
#         current_count
#         >= mission.required_volunteers
#     ):
#         return None

#     # =====================================================
#     # INSERT VOLUNTEER
#     # =====================================================

#     db.execute(
#         mission_volunteers.insert().values(
#             mission_id=mission_id,
#             user_id=user_id,
#             assigned_at=datetime.utcnow(),
#             completed_at=None,
#             report=None,
#             report_submitted_at=None,
#             reviewed_at=None,
#             review_status=None,
#         )
#     )

#     # =====================================================
#     # UPDATE STATUS
#     # =====================================================

#     if (
#         current_count + 1
#         >= mission.required_volunteers
#     ):
#         mission.status = "accepted"
#     else:
#         mission.status = "active"

#     mission.assigned_at = (
#         datetime.utcnow()
#     )

#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # COMPLETE MISSION
# # =========================================================

# def complete_mission(
#     db: Session,
#     mission_id: int,
#     user_id: int,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     volunteer = (
#         db.query(
#             mission_volunteers
#         )
#         .filter(
#             mission_volunteers.c.mission_id
#             == mission_id,

#             mission_volunteers.c.user_id
#             == user_id,
#         )
#         .first()
#     )

#     if not volunteer:
#         return None

#     db.execute(
#         mission_volunteers.update()
#         .where(
#             mission_volunteers.c.mission_id
#             == mission_id
#         )
#         .where(
#             mission_volunteers.c.user_id
#             == user_id
#         )
#         .values(
#             completed_at=datetime.utcnow()
#         )
#     )

#     mission.status = "completed"

#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # DELETE MISSION
# # =========================================================

# def delete_mission(
#     db: Session,
#     mission_id: int,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     db.delete(mission)
#     db.commit()

#     return mission


# # =========================================================
# # SUBMIT REPORT
# # =========================================================

# def submit_mission_report(
#     db: Session,
#     mission_id: int,
#     user_id: int,
#     report_text: str,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     volunteer = (
#         db.query(
#             mission_volunteers
#         )
#         .filter(
#             mission_volunteers.c.mission_id
#             == mission_id,

#             mission_volunteers.c.user_id
#             == user_id,
#         )
#         .first()
#     )

#     if not volunteer:
#         return None

#     db.execute(
#         mission_volunteers.update()
#         .where(
#             mission_volunteers.c.mission_id
#             == mission_id
#         )
#         .where(
#             mission_volunteers.c.user_id
#             == user_id
#         )
#         .values(
#             report=report_text,
#             report_submitted_at=datetime.utcnow(),
#             review_status="pending",
#             reviewed_at=None,
#         )
#     )

#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # GET REPORT
# # =========================================================

# def get_mission_report(
#     db: Session,
#     mission_id: int,
#     user_id: int,
# ):

#     return (
#         db.query(
#             mission_volunteers
#         )
#         .filter(
#             mission_volunteers.c.mission_id
#             == mission_id,

#             mission_volunteers.c.user_id
#             == user_id,
#         )
#         .first()
#     )


# # =========================================================
# # REVIEW REPORT
# # =========================================================

# def review_mission_report(
#     db: Session,
#     mission_id: int,
#     user_id: int,
#     approved: bool,
# ) -> Optional[Mission]:

#     mission = get_mission_by_id(
#         db,
#         mission_id,
#     )

#     if not mission:
#         return None

#     report = get_mission_report(
#         db,
#         mission_id,
#         user_id,
#     )

#     if not report:
#         return None

#     status = (
#         "approved"
#         if approved
#         else "rejected"
#     )

#     db.execute(
#         mission_volunteers.update()
#         .where(
#             mission_volunteers.c.mission_id
#             == mission_id
#         )
#         .where(
#             mission_volunteers.c.user_id
#             == user_id
#         )
#         .values(
#             review_status=status,
#             reviewed_at=datetime.utcnow(),
#         )
#     )

#     db.commit()
#     db.refresh(mission)

#     return mission


# # =========================================================
# # PENDING REPORTS
# # =========================================================

# def get_pending_mission_reports(
#     db: Session,
# ):

#     rows = (
#         db.query(
#             mission_volunteers.c.mission_id,
#             mission_volunteers.c.user_id,
#             mission_volunteers.c.report,
#             mission_volunteers.c.report_submitted_at,
#             mission_volunteers.c.reviewed_at,
#             mission_volunteers.c.review_status,

#             Mission.title.label(
#                 "mission_title"
#             ),

#             Mission.status.label(
#                 "mission_status"
#             ),

#             User.full_name.label(
#                 "user_full_name"
#             ),

#             User.phone.label(
#                 "user_phone"
#             ),
#         )
#         .join(
#             Mission,
#             Mission.id
#             == mission_volunteers.c.mission_id,
#         )
#         .join(
#             User,
#             User.id
#             == mission_volunteers.c.user_id,
#         )
#         .filter(
#             mission_volunteers.c.review_status
#             == "pending"
#         )
#         .all()
#     )

#     return rows

from datetime import datetime
from typing import List, Optional, Set, Union, Dict, Any

from sqlalchemy.orm import Session

from app.models.mission import (
    Mission,
    mission_volunteers,
)

from app.models.user import User

from app.schemas.mission import (
    MissionCreate,
    MissionUpdate,
)


# =========================================================
# NORMALIZE ONE SKILL
# =========================================================

def normalize_skill(skill: Optional[str]) -> str:
    """
    استانداردسازی یک مهارت برای مقایسه.

    مثال:
        " برق "
        "برق"
        "بـرق"

    تا حد ممکن به فرم یکسان تبدیل می‌شوند.
    """

    if skill is None:
        return ""

    value = str(skill).strip().lower()

    # Arabic -> Persian
    value = value.replace("ي", "ی")
    value = value.replace("ى", "ی")
    value = value.replace("ك", "ک")

    # حذف کشیده
    value = value.replace("ـ", "")

    # نیم فاصله
    value = value.replace("\u200c", " ")

    # فاصله‌های اضافه
    value = " ".join(value.split())

    return value.strip()


# =========================================================
# PARSE SKILLS
# =========================================================

def parse_skills(
    skills: Optional[str],
) -> Set[str]:
    """
    تبدیل رشته مهارت‌ها به Set.

    پشتیبانی از:

        برق, شبکه, مخابرات

    و:

        برق، شبکه، مخابرات
    """

    if not skills:
        return set()

    value = str(skills)

    value = value.replace("،", ",")
    value = value.replace("؛", ",")
    value = value.replace(";", ",")

    result = set()

    for skill in value.split(","):

        normalized = normalize_skill(skill)

        if normalized:
            result.add(normalized)

    return result


# =========================================================
# GET MISSION SKILLS
# =========================================================

def get_mission_required_skills(
    mission_or_skills: Optional[
        Union[str, Mission]
    ],
) -> Set[str]:
    """
    اگر Mission object دریافت شود،
    required_skills آن را استخراج می‌کند.

    اگر string باشد،
    همان string را پردازش می‌کند.
    """

    if mission_or_skills is None:
        return set()

    if isinstance(
        mission_or_skills,
        Mission,
    ):
        return parse_skills(
            mission_or_skills.required_skills
        )

    return parse_skills(
        mission_or_skills
    )


# =========================================================
# SKILL MATCH COUNT
# =========================================================

def calculate_skill_match(
    volunteer_skills: Optional[str],
    mission_or_skills: Optional[
        Union[str, Mission]
    ],
) -> int:
    """
    تعداد مهارت‌های مشترک داوطلب و مأموریت.

    مثال:

    داوطلب:
        برق, شبکه, نجات

    مأموریت:
        نجات, کمک‌های اولیه

    نتیجه:
        1
    """

    volunteer = parse_skills(
        volunteer_skills
    )

    required = get_mission_required_skills(
        mission_or_skills
    )

    if not volunteer:
        return 0

    if not required:
        return 0

    return len(
        volunteer.intersection(
            required
        )
    )


# =========================================================
# SKILL MATCH RATIO
# =========================================================

def calculate_skill_match_ratio(
    volunteer_skills: Optional[str],
    mission_or_skills: Optional[
        Union[str, Mission]
    ],
) -> float:
    """
    درصد تطابق مهارت داوطلب با مهارت‌های موردنیاز مأموریت.

    مثال:

    required:
        برق, شبکه, مخابرات

    volunteer:
        برق, شبکه

    نتیجه:
        0.666...
    """

    required = get_mission_required_skills(
        mission_or_skills
    )

    if not required:
        return 0.0

    matched = calculate_skill_match(
        volunteer_skills,
        mission_or_skills,
    )

    return matched / len(required)


# =========================================================
# HAS SKILL MATCH
# =========================================================

def has_skill_match(
    volunteer_skills: Optional[str],
    mission_or_skills: Optional[
        Union[str, Mission]
    ],
) -> bool:

    return (
        calculate_skill_match(
            volunteer_skills,
            mission_or_skills,
        )
        > 0
    )


# =========================================================
# PRIORITY SCORE
# =========================================================

def get_priority_score(
    priority: Optional[str],
) -> int:

    priority_order = {
        "critical": 4,
        "high": 3,
        "medium": 2,
        "low": 1,
    }

    return priority_order.get(
        str(
            priority or "medium"
        ).lower(),
        2,
    )


# =========================================================
# CREATE MISSION
# =========================================================

def create_mission(
    db: Session,
    mission_data: MissionCreate,
) -> Mission:

    required_skills = (
        mission_data.required_skills
    )

    if required_skills:

        cleaned_skills = parse_skills(
            required_skills
        )

        required_skills = ", ".join(
            sorted(cleaned_skills)
        )

    mission = Mission(
        disaster_id=mission_data.disaster_id,
        title=mission_data.title,
        description=mission_data.description,
        required_skills=required_skills,
        location=mission_data.location,
        priority=mission_data.priority,
        required_volunteers=(
            mission_data.required_volunteers
        ),
        status="active",
    )

    db.add(mission)

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# GET MISSION BY ID
# =========================================================

def get_mission_by_id(
    db: Session,
    mission_id: int,
) -> Optional[Mission]:

    return (
        db.query(Mission)
        .filter(
            Mission.id == mission_id
        )
        .first()
    )


# =========================================================
# GET ALL MISSIONS
# =========================================================

def get_all_missions(
    db: Session,
) -> List[Mission]:

    return (
        db.query(Mission)
        .order_by(
            Mission.id.desc()
        )
        .all()
    )


# =========================================================
# GET CURRENT VOLUNTEER IDS
# =========================================================

def get_mission_volunteer_ids(
    db: Session,
    mission_id: int,
) -> Set[int]:

    rows = (
        db.query(
            mission_volunteers.c.user_id
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id
        )
        .all()
    )

    return {
        row[0]
        for row in rows
    }


# =========================================================
# GET MISSION VOLUNTEER COUNT
# =========================================================

def get_mission_volunteer_count(
    db: Session,
    mission_id: int,
) -> int:

    return (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id
        )
        .count()
    )


# =========================================================
# VOLUNTEER LOCATION MATCH
# =========================================================

def calculate_location_match(
    volunteer: User,
    mission: Mission,
) -> int:
    """
    امتیاز تطابق مکانی.

    شهر یکسان:
        20 امتیاز

    منطقه یکسان:
        10 امتیاز

    محل یکسان:
        5 امتیاز
    """

    score = 0

    volunteer_city = normalize_skill(
        volunteer.city
    )

    volunteer_region = normalize_skill(
        volunteer.region
    )

    volunteer_location = normalize_skill(
        volunteer.location
    )

    mission_location = normalize_skill(
        mission.location
    )

    # اگر location مأموریت با location داوطلب
    # دقیقاً یکی باشد
    if (
        mission_location
        and volunteer_location
        and mission_location
        == volunteer_location
    ):
        score += 5

    # اگر شهر در location مأموریت آمده باشد
    if (
        mission_location
        and volunteer_city
        and volunteer_city
        in mission_location
    ):
        score += 20

    return score


# =========================================================
# VOLUNTEER MATCH SCORE
# =========================================================

def calculate_volunteer_match_score(
    volunteer: User,
    mission: Mission,
) -> Dict[str, Any]:
    """
    امتیاز کامل داوطلب برای یک مأموریت.

    ساختار امتیاز:

    Skills:
        حداکثر 60

    City / Location:
        حداکثر 20

    Region:
        حداکثر 10

    Availability:
        10

    Total:
        100
    """

    # -----------------------------------------------------
    # SKILLS
    # -----------------------------------------------------

    required_skills = (
        get_mission_required_skills(
            mission
        )
    )

    matched_skills = parse_skills(
        volunteer.skills
    ).intersection(
        required_skills
    )

    if required_skills:

        skill_ratio = (
            len(matched_skills)
            / len(required_skills)
        )

    else:

        # اگر مأموریت مهارت خاصی
        # نیاز نداشته باشد
        skill_ratio = 1.0

    skill_score = (
        skill_ratio * 60
    )

    # -----------------------------------------------------
    # CITY
    # -----------------------------------------------------

    city_score = 0

    volunteer_city = normalize_skill(
        volunteer.city
    )

    mission_location = normalize_skill(
        mission.location
    )

    if (
        volunteer_city
        and mission_location
        and volunteer_city
        in mission_location
    ):
        city_score = 20

    # -----------------------------------------------------
    # REGION
    # -----------------------------------------------------

    region_score = 0

    volunteer_region = normalize_skill(
        volunteer.region
    )

    if (
        volunteer_region
        and mission_location
        and volunteer_region
        in mission_location
    ):
        region_score = 10

    # -----------------------------------------------------
    # AVAILABILITY
    # -----------------------------------------------------

    availability_score = 0

    availability = normalize_skill(
        volunteer.availability_status
    )

    if availability in {
        "available",
        "آزاد",
        "در دسترس",
    }:
        availability_score = 10

    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    total_score = (
        skill_score
        + city_score
        + region_score
        + availability_score
    )

    return {
        "volunteer_id": volunteer.id,

        "full_name": volunteer.full_name,

        "phone": volunteer.phone,

        "skills": volunteer.skills,

        "city": volunteer.city,

        "region": volunteer.region,

        "availability_status": (
            volunteer.availability_status
        ),

        "matched_skills": sorted(
            matched_skills
        ),

        "skill_match_count": len(
            matched_skills
        ),

        "required_skill_count": len(
            required_skills
        ),

        "skill_match_ratio": round(
            skill_ratio,
            2,
        ),

        "skill_score": round(
            skill_score,
            2,
        ),

        "city_score": city_score,

        "region_score": region_score,

        "availability_score": (
            availability_score
        ),

        "total_score": round(
            total_score,
            2,
        ),
    }


# =========================================================
# GET BEST VOLUNTEERS FOR MISSION
# =========================================================

def get_matching_volunteers(
    db: Session,
    mission_id: int,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """
    بهترین داوطلب‌ها را برای یک مأموریت پیدا می‌کند.

    فقط داوطلب‌های:
        - فعال
        - در دسترس
        - هنوز تخصیص داده نشده

    بررسی می‌شوند.
    """

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return []

    assigned_ids = (
        get_mission_volunteer_ids(
            db,
            mission_id,
        )
    )

    volunteers = (
        db.query(User)
        .filter(
            User.role == "volunteer",
            User.is_active == True,
        )
        .all()
    )

    results = []

    for volunteer in volunteers:

        # قبلاً عضو مأموریت نباشد
        if volunteer.id in assigned_ids:
            continue

        # فقط available
        availability = normalize_skill(
            volunteer.availability_status
        )

        if availability not in {
            "available",
            "آزاد",
            "در دسترس",
        }:
            continue

        score = (
            calculate_volunteer_match_score(
                volunteer,
                mission,
            )
        )

        results.append(score)

    # -----------------------------------------------------
    # SORT
    # -----------------------------------------------------

    results.sort(
        key=lambda item: (
            item["total_score"],
            item["skill_match_count"],
        ),
        reverse=True,
    )

    return results[:limit]


# =========================================================
# ASSIGN VOLUNTEER TO MISSION
# =========================================================

def assign_volunteer_to_mission(
    db: Session,
    mission_id: int,
    volunteer_id: int,
) -> Optional[Mission]:
    """
    تخصیص دستی یک داوطلب به مأموریت.

    این تابع برای Admin / Coordinator است.
    """

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    if mission.status == "completed":
        return None

    volunteer = (
        db.query(User)
        .filter(
            User.id == volunteer_id,
            User.role == "volunteer",
        )
        .first()
    )

    if not volunteer:
        return None

    if not volunteer.is_active:
        return None

    # -----------------------------------------------------
    # CHECK ALREADY ASSIGNED
    # -----------------------------------------------------

    existing = (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id,

            mission_volunteers.c.user_id
            == volunteer_id,
        )
        .first()
    )

    if existing:
        return mission

    # -----------------------------------------------------
    # CHECK CAPACITY
    # -----------------------------------------------------

    current_count = (
        get_mission_volunteer_count(
            db,
            mission_id,
        )
    )

    if (
        current_count
        >= mission.required_volunteers
    ):
        return None

    # -----------------------------------------------------
    # INSERT
    # -----------------------------------------------------

    now = datetime.utcnow()

    db.execute(
        mission_volunteers.insert().values(
            mission_id=mission_id,
            user_id=volunteer_id,
            assigned_at=now,
            completed_at=None,
            report=None,
            report_submitted_at=None,
            reviewed_at=None,
            review_status=None,
        )
    )

    # -----------------------------------------------------
    # UPDATE VOLUNTEER STATUS
    # -----------------------------------------------------

    volunteer.availability_status = (
        "assigned"
    )

    # -----------------------------------------------------
    # UPDATE MISSION
    # -----------------------------------------------------

    new_count = (
        current_count + 1
    )

    mission.assigned_at = now

    if (
        new_count
        >= mission.required_volunteers
    ):
        mission.status = "accepted"

    else:
        mission.status = "active"

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# AUTO ASSIGN BEST VOLUNTEERS
# =========================================================

def auto_assign_volunteers(
    db: Session,
    mission_id: int,
) -> List[Dict[str, Any]]:
    """
    تخصیص خودکار بهترین داوطلب‌ها.

    تعداد تخصیص:
        required_volunteers

    معیار:
        skill match
        location
        availability
    """

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return []

    current_count = (
        get_mission_volunteer_count(
            db,
            mission_id,
        )
    )

    remaining_capacity = (
        mission.required_volunteers
        - current_count
    )

    if remaining_capacity <= 0:
        return []

    candidates = (
        get_matching_volunteers(
            db,
            mission_id,
            limit=remaining_capacity,
        )
    )

    assigned = []

    for candidate in candidates:

        volunteer_id = (
            candidate["volunteer_id"]
        )

        result = (
            assign_volunteer_to_mission(
                db,
                mission_id,
                volunteer_id,
            )
        )

        if result:

            assigned.append(
                candidate
            )

    return assigned


# =========================================================
# GET AVAILABLE MISSIONS
# =========================================================

def get_available_missions(
    db: Session,
    volunteer_id: int,
) -> List[Mission]:
    """
    مأموریت‌های فعال را برای داوطلب برمی‌گرداند.

    ترتیب:

    1. بیشترین تطابق مهارتی
    2. اولویت بالاتر
    3. مأموریت جدیدتر
    """

    volunteer = (
        db.query(User)
        .filter(
            User.id == volunteer_id
        )
        .first()
    )

    if not volunteer:
        return []

    volunteer_skills = (
        volunteer.skills or ""
    )

    missions = (
        db.query(Mission)
        .filter(
            Mission.status == "active"
        )
        .all()
    )

    # -----------------------------------------------------
    # REMOVE ALREADY ACCEPTED
    # -----------------------------------------------------

    accepted_rows = (
        db.query(
            mission_volunteers.c.mission_id
        )
        .filter(
            mission_volunteers.c.user_id
            == volunteer_id
        )
        .all()
    )

    accepted_ids = {
        row[0]
        for row in accepted_rows
    }

    missions = [
        mission
        for mission in missions
        if mission.id
        not in accepted_ids
    ]

    # -----------------------------------------------------
    # SORT
    # -----------------------------------------------------

    mission_matches = []

    for mission in missions:

        match_count = (
            calculate_skill_match(
                volunteer_skills,
                mission,
            )
        )

        skill_ratio = (
            calculate_skill_match_ratio(
                volunteer_skills,
                mission,
            )
        )

        location_score = (
            calculate_location_match(
                volunteer,
                mission,
            )
        )

        mission_score = (
            skill_ratio * 60
            + location_score
            + get_priority_score(
                mission.priority
            ) * 5
        )

        mission_matches.append(
            (
                mission,
                match_count,
                mission_score,
            )
        )

    mission_matches.sort(
        key=lambda item: (
            item[2],
            item[1],
            item[0].id,
        ),
        reverse=True,
    )

    return [
        mission
        for mission, _, _
        in mission_matches
    ]


# =========================================================
# MY MISSIONS
# =========================================================

def get_my_missions(
    db: Session,
    user_id: int,
) -> List[Mission]:

    return (
        db.query(Mission)
        .join(
            mission_volunteers,
            Mission.id
            == mission_volunteers.c.mission_id,
        )
        .filter(
            mission_volunteers.c.user_id
            == user_id
        )
        .order_by(
            Mission.id.desc()
        )
        .all()
    )


# =========================================================
# UPDATE MISSION
# =========================================================

def update_mission(
    db: Session,
    mission_id: int,
    mission_data: MissionUpdate,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    data = mission_data.dict(
        exclude_unset=True
    )

    if "required_skills" in data:

        raw_skills = data.get(
            "required_skills"
        )

        if raw_skills:

            parsed = parse_skills(
                raw_skills
            )

            data["required_skills"] = (
                ", ".join(
                    sorted(parsed)
                )
            )

        else:

            data["required_skills"] = None

    for key, value in data.items():

        setattr(
            mission,
            key,
            value,
        )

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# ACCEPT MISSION
# =========================================================

def accept_mission(
    db: Session,
    mission_id: int,
    user_id: int,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    if mission.status != "active":
        return None

    volunteer = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == "volunteer",
        )
        .first()
    )

    if not volunteer:
        return None

    if not volunteer.is_active:
        return None

    existing = (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id,

            mission_volunteers.c.user_id
            == user_id,
        )
        .first()
    )

    if existing:
        return None

    current_count = (
        get_mission_volunteer_count(
            db,
            mission_id,
        )
    )

    if (
        current_count
        >= mission.required_volunteers
    ):
        return None

    # -----------------------------------------------------
    # INSERT
    # -----------------------------------------------------

    now = datetime.utcnow()

    db.execute(
        mission_volunteers.insert().values(
            mission_id=mission_id,
            user_id=user_id,
            assigned_at=now,
            completed_at=None,
            report=None,
            report_submitted_at=None,
            reviewed_at=None,
            review_status=None,
        )
    )

    # -----------------------------------------------------
    # VOLUNTEER STATUS
    # -----------------------------------------------------

    volunteer.availability_status = (
        "assigned"
    )

    # -----------------------------------------------------
    # MISSION STATUS
    # -----------------------------------------------------

    if (
        current_count + 1
        >= mission.required_volunteers
    ):
        mission.status = "accepted"

    else:
        mission.status = "active"

    mission.assigned_at = now

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# COMPLETE MISSION
# =========================================================

def complete_mission(
    db: Session,
    mission_id: int,
    user_id: int,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    volunteer = (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id,

            mission_volunteers.c.user_id
            == user_id,
        )
        .first()
    )

    if not volunteer:
        return None

    db.execute(
        mission_volunteers.update()
        .where(
            mission_volunteers.c.mission_id
            == mission_id
        )
        .where(
            mission_volunteers.c.user_id
            == user_id
        )
        .values(
            completed_at=datetime.utcnow()
        )
    )

    # -----------------------------------------------------
    # داوطلب دوباره آزاد شود
    # -----------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user:
        user.availability_status = (
            "available"
        )

    # -----------------------------------------------------
    # Mission
    # -----------------------------------------------------

    mission.status = "completed"

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# DELETE MISSION
# =========================================================

def delete_mission(
    db: Session,
    mission_id: int,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    db.delete(mission)

    db.commit()

    return mission


# =========================================================
# SUBMIT REPORT
# =========================================================

def submit_mission_report(
    db: Session,
    mission_id: int,
    user_id: int,
    report_text: str,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    volunteer = (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id,

            mission_volunteers.c.user_id
            == user_id,
        )
        .first()
    )

    if not volunteer:
        return None

    db.execute(
        mission_volunteers.update()
        .where(
            mission_volunteers.c.mission_id
            == mission_id
        )
        .where(
            mission_volunteers.c.user_id
            == user_id
        )
        .values(
            report=report_text,
            report_submitted_at=(
                datetime.utcnow()
            ),
            review_status="pending",
            reviewed_at=None,
        )
    )

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# GET REPORT
# =========================================================

def get_mission_report(
    db: Session,
    mission_id: int,
    user_id: int,
):

    return (
        db.query(
            mission_volunteers
        )
        .filter(
            mission_volunteers.c.mission_id
            == mission_id,

            mission_volunteers.c.user_id
            == user_id,
        )
        .first()
    )


# =========================================================
# REVIEW REPORT
# =========================================================

def review_mission_report(
    db: Session,
    mission_id: int,
    user_id: int,
    approved: bool,
) -> Optional[Mission]:

    mission = get_mission_by_id(
        db,
        mission_id,
    )

    if not mission:
        return None

    report = get_mission_report(
        db,
        mission_id,
        user_id,
    )

    if not report:
        return None

    status = (
        "approved"
        if approved
        else "rejected"
    )

    db.execute(
        mission_volunteers.update()
        .where(
            mission_volunteers.c.mission_id
            == mission_id
        )
        .where(
            mission_volunteers.c.user_id
            == user_id
        )
        .values(
            review_status=status,
            reviewed_at=datetime.utcnow(),
        )
    )

    db.commit()

    db.refresh(mission)

    return mission


# =========================================================
# PENDING REPORTS
# =========================================================

def get_pending_mission_reports(
    db: Session,
):

    return (
        db.query(
            mission_volunteers.c.mission_id,
            mission_volunteers.c.user_id,
            mission_volunteers.c.report,
            mission_volunteers.c.report_submitted_at,
            mission_volunteers.c.reviewed_at,
            mission_volunteers.c.review_status,

            Mission.title.label(
                "mission_title"
            ),

            Mission.status.label(
                "mission_status"
            ),

            User.full_name.label(
                "user_full_name"
            ),

            User.phone.label(
                "user_phone"
            ),
        )
        .join(
            Mission,
            Mission.id
            == mission_volunteers.c.mission_id,
        )
        .join(
            User,
            User.id
            == mission_volunteers.c.user_id,
        )
        .filter(
            mission_volunteers.c.review_status
            == "pending"
        )
        .all()
    )
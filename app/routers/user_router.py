from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session
from typing import List

from pathlib import Path
import shutil
import uuid
import traceback

from app.database.database import SessionLocal

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserProfileUpdate,
    UserRoleUpdate,
    UserStatusUpdate,
)

from app.services.user_service import (
    create_user,
    update_profile,
    get_all_volunteers,
    toggle_user_active,
    get_all_users,
    get_users_by_role,
    update_user_role,
    update_user_status,
    delete_user,
)

from app.core.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse,
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return create_user(
        db,
        user,
    )


# =========================================================
# MY PROFILE
# =========================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


# =========================================================
# UPDATE PROFILE
# =========================================================

@router.put(
    "/profile",
    response_model=UserResponse,
)
def update_my_profile(
    profile: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_profile(
        db,
        current_user.id,
        profile,
    )


# =========================================================
# UPLOAD PROFILE IMAGE
# =========================================================

@router.put(
    "/profile-image",
    response_model=UserResponse,
)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print()
    print("=" * 70)
    print("PROFILE IMAGE UPLOAD START")
    print("USER ID:", current_user.id)
    print("FILENAME:", file.filename)
    print("CONTENT TYPE:", file.content_type)
    print("=" * 70)

    # =====================================================
    # VALIDATE FILE
    # =====================================================

    if not file:
        raise HTTPException(
            status_code=400,
            detail="فایلی انتخاب نشده است",
        )

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="فقط JPG، PNG و WEBP مجاز است",
        )

    # =====================================================
    # PROJECT ROOT
    # =====================================================

    BASE_DIR = Path(__file__).resolve().parents[2]

    upload_dir = (
        BASE_DIR
        / "uploads"
        / "profile_images"
    )

    try:
        upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    except Exception as error:
        print()
        print("UPLOAD DIRECTORY ERROR")
        print(repr(error))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="خطا در ساخت پوشه عکس‌ها",
        )

    print("BASE DIR:", BASE_DIR)
    print("UPLOAD DIR:", upload_dir)

    # =====================================================
    # FILE EXTENSION
    # =====================================================

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    if extension not in allowed_extensions:
        extension = ".jpg"

    # =====================================================
    # UNIQUE FILE NAME
    # =====================================================

    filename = (
        f"{current_user.id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    file_path = upload_dir / filename

    print(
        "NEW FILE PATH:",
        file_path,
    )

    # =====================================================
    # MAX SIZE
    # =====================================================

    MAX_FILE_SIZE = 5 * 1024 * 1024

    total_size = 0

    # =====================================================
    # SAVE FILE
    # =====================================================

    try:

        with file_path.open(
            "wb"
        ) as buffer:

            while True:

                chunk = await file.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "حجم عکس نباید بیشتر از "
                            "۵ مگابایت باشد"
                        ),
                    )

                buffer.write(chunk)

        print(
            "FILE SAVED SUCCESSFULLY"
        )

        print(
            "FILE SIZE:",
            total_size,
        )

        print(
            "FILE EXISTS:",
            file_path.exists(),
        )

    except HTTPException:

        if file_path.exists():
            try:
                file_path.unlink()
            except Exception:
                pass

        raise

    except Exception as error:

        print()
        print("=" * 70)
        print("FILE SAVE ERROR")
        print("ERROR:", repr(error))
        traceback.print_exc()
        print("=" * 70)

        if file_path.exists():
            try:
                file_path.unlink()
            except Exception:
                pass

        raise HTTPException(
            status_code=500,
            detail="خطا در ذخیره فایل عکس",
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass

    # =====================================================
    # IMPORTANT:
    # GET USER USING THIS SESSION
    # =====================================================

    user = (
        db.query(User)
        .filter(
            User.id == current_user.id
        )
        .first()
    )

    if not user:

        if file_path.exists():
            try:
                file_path.unlink()
            except Exception:
                pass

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد",
        )

    # =====================================================
    # OLD IMAGE
    # =====================================================

    old_profile_image = (
        user.profile_image
    )

    print(
        "OLD PROFILE IMAGE:",
        old_profile_image,
    )

    # =====================================================
    # NEW DATABASE PATH
    # =====================================================

    new_profile_image = (
        f"/uploads/profile_images/{filename}"
    )

    print(
        "NEW DATABASE PATH:",
        new_profile_image,
    )

    # =====================================================
    # DATABASE UPDATE
    # =====================================================

    try:

        # user از همین db گرفته شده است.
        # بنابراین دیگر db.add(current_user)
        # لازم نیست.

        user.profile_image = (
            new_profile_image
        )

        db.commit()

        db.refresh(user)

        print()
        print("=" * 70)
        print("DATABASE UPDATE SUCCESS")
        print(
            "USER ID:",
            user.id,
        )
        print(
            "PROFILE IMAGE:",
            user.profile_image,
        )
        print("=" * 70)

    except Exception as error:

        print()
        print("=" * 70)
        print("DATABASE UPDATE ERROR")
        print("ERROR:", repr(error))
        traceback.print_exc()
        print("=" * 70)

        db.rollback()

        # اگر DB ذخیره نشد،
        # فایل جدید را پاک کن.
        if file_path.exists():

            try:
                file_path.unlink()

            except Exception as delete_error:

                print(
                    "NEW FILE DELETE ERROR:",
                    repr(delete_error),
                )

        raise HTTPException(
            status_code=500,
            detail=(
                "خطا در ذخیره اطلاعات عکس در دیتابیس"
            ),
        )

    # =====================================================
    # DELETE OLD IMAGE
    # =====================================================

    if old_profile_image:

        try:

            old_relative_path = (
                old_profile_image.lstrip("/")
            )

            old_path = (
                BASE_DIR
                / old_relative_path
            )

            print(
                "OLD IMAGE FULL PATH:",
                old_path,
            )

            # فقط فایل‌های داخل uploads را حذف کن
            uploads_root = (
                BASE_DIR / "uploads"
            ).resolve()

            old_resolved = (
                old_path.resolve()
            )

            if (
                old_resolved.exists()
                and uploads_root
                in old_resolved.parents
            ):

                old_resolved.unlink()

                print(
                    "OLD PROFILE IMAGE DELETED"
                )

        except Exception as error:

            # حذف عکس قبلی نباید باعث 500 شود
            print(
                "OLD IMAGE DELETE ERROR:",
                repr(error),
            )

    # =====================================================
    # RETURN UPDATED USER
    # =====================================================

    return user


# =========================================================
# COORDINATOR - READ ONLY USERS
# =========================================================

@router.get(
    "/coordinator-view",
    response_model=List[UserResponse],
)
def get_users_for_coordinator(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [
        "admin",
        "coordinator",
    ]:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return get_all_users(db)


# =========================================================
# COORDINATOR - READ ONLY VOLUNTEERS
# =========================================================

@router.get(
    "/coordinator/volunteers",
    response_model=List[UserResponse],
)
def get_volunteers_for_coordinator(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [
        "admin",
        "coordinator",
    ]:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return get_all_volunteers(db)


# =========================================================
# ADMIN - ALL USERS
# =========================================================

@router.get(
    "/",
    response_model=List[UserResponse],
)
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return get_all_users(db)


# =========================================================
# ADMIN - USERS BY ROLE
# =========================================================

@router.get(
    "/role/{role}",
    response_model=List[UserResponse],
)
def get_users_role(
    role: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return get_users_by_role(
        db,
        role,
    )


# =========================================================
# ADMIN - CHANGE ROLE
# =========================================================

@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def change_role(
    user_id: int,
    data: UserRoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return update_user_role(
        db,
        user_id,
        data.role,
    )


# =========================================================
# ADMIN - CHANGE STATUS
# =========================================================

@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
def change_status(
    user_id: int,
    data: UserStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return update_user_status(
        db,
        user_id,
        data.is_active,
    )


# =========================================================
# ADMIN - DELETE USER
# =========================================================

@router.delete(
    "/{user_id}",
)
def remove_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    delete_user(
        db,
        user_id,
    )

    return {
        "message": "User deleted successfully",
    }


# =========================================================
# ADMIN - VOLUNTEERS
# =========================================================

@router.get(
    "/volunteers",
    response_model=List[UserResponse],
)
def get_volunteers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return get_all_volunteers(db)


# =========================================================
# ADMIN - TOGGLE VOLUNTEER
# =========================================================

@router.patch(
    "/volunteers/{user_id}/toggle-active",
    response_model=UserResponse,
)
def toggle_volunteer_active(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return toggle_user_active(
        db,
        user_id,
    )
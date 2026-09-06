from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.models.otp import OTP
from app.database.database import engine, Base


# =========================================================
# Import models so SQLAlchemy knows them
# =========================================================

from app.models import user
from app.models import disaster
from app.models import mission


# =========================================================
# Import routers
# =========================================================

from app.routers.user_router import router as user_router
from app.routers.auth_router import router as auth_router
from app.routers.disaster_router import router as disaster_router
from app.routers.mission_router import router as mission_router
from app.routers.admin_router import router as admin_router


# =========================================================
# BASE DIRECTORY
# =========================================================
#
# main.py معمولاً داخل:
#
# project/
# ├── app/
# │   ├── main.py
# │   └── ...
# ├── uploads/
# │   └── profile_images/
# └── ...
#
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# =========================================================
# UPLOADS DIRECTORY
# =========================================================

UPLOAD_DIR = BASE_DIR / "uploads"

PROFILE_IMAGES_DIR = UPLOAD_DIR / "profile_images"


# =========================================================
# Create upload directories
# =========================================================

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

PROFILE_IMAGES_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# DATABASE TABLES
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Volunteer Crisis Management API",
)


# =========================================================
# STATIC FILES
# =========================================================
#
# فایل‌های آپلود شده از این آدرس قابل دسترسی هستند:
#
# http://127.0.0.1:8000/uploads/...
#
# =========================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(UPLOAD_DIR),
    ),
    name="uploads",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=[
        "*",
    ],

    allow_headers=[
        "*",
    ],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    user_router,
)

app.include_router(
    auth_router,
)

app.include_router(
    disaster_router,
)

app.include_router(
    mission_router,
)

app.include_router(
    admin_router,
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Volunteer API is running 🚀"
    }
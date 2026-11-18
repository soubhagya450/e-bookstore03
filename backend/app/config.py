import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ebook-library-super-secret-key-2026-production-secure-32bytes-long-key')
    JWT_SECRET = os.environ.get('JWT_SECRET', 'jwt-secret-token-key-ebook-2026-production-secure-64bytes-long-key-string-fixed')
    JWT_EXPIRES_DAYS = 7
    
    # Database: Supports SQLite out-of-the-box, or PostgreSQL via DATABASE_URL
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        # Standardize postgresql:// if rendered as postgres://
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        db_path = BASE_DIR / "ebook.db"
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload storage
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', str(BASE_DIR / "uploads"))
    MAX_CONTENT_LENGTH = 120 * 1024 * 1024  # 120 Megabytes max
    
    # Cloudflare R2 / S3 Config (optional, falls back to local storage)
    R2_ACCOUNT_ID = os.environ.get('R2_ACCOUNT_ID', '')
    R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', '')
    R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', '')
    R2_BUCKET_NAME = os.environ.get('R2_BUCKET_NAME', '')
    R2_PUBLIC_URL = os.environ.get('R2_PUBLIC_URL', '')
